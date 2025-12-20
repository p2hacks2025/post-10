import os
from flask import Flask
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import timezone, timedelta
from flask_cors import CORS
import math

# python app.py で起動！

load_dotenv() # .env を読み込む

JST = timezone(timedelta(hours=9)) # 日本のタイムゾーン

app = Flask(__name__)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000") # env内のURLを取得

CORS(app, resources={r"/*": {
    "origins": "*" # リスト形式で渡す
    }
}) # CORSの許可設定

MONGODB_URI = os.getenv("MONGODB_URI") # env内のURLを取得

client = MongoClient(MONGODB_URI) # MongoDBへの接続
db = client.get_default_database() # デフォルトのDB名、dbはデータベースの名前（変わるかも）

posts = db["posts"] # 投稿のターブルを作成

try: # DBへの接続確認
    client.admin.command("ping") # 「生きてる？」
    print("MongoDB connected") # 返答帰ってきたら表示
except Exception as e:
    print("MongoDB connection failed:", e) # 「ダメです」


from flask import request, jsonify # フロント（https）からの中身を受け取って、JSONでレスポンス
from bson import ObjectId # 文字列のままだとDBに保存できないから使う型
from datetime import datetime # 投稿時間

@app.route("/post", methods=["POST"]) # URLが/postでPOSTリクエストのみ
def create_post():
    data = request.json # 送られたJSONを格納

    if not data or not data.get("text"): # テキストが不十分
        return jsonify({"error": "text is required"}), 400 # エラー吐いて終わり

    post = { # そうじゃないなら投稿データ作るよ
        "text": data["text"], # 投稿文
        "good": 0, # goodの初期値
        "bad": 0, # badの初期値
        "point": 0.0, # キラキラ度の初期値
        "created_at": datetime.utcnow() # 投稿時刻
    }

    result = posts.insert_one(post) # DBにぶち込む

    return jsonify({ # 投稿成功の返答
        "message": "posted!", # 「投稿したで」
        "post_id": str(result.inserted_id) # 投稿ID
    }), 201 # HTTPのステータス

TL_Limit = 20

@app.route("/timeline", methods=["GET"]) # GETリクエストで実行（取得だけ）
def timeline():
    # フロントエンドから ?offset=20 のように送られてくる値を取得
    # 指定がない場合は 0（最初から）にする
    offset = request.args.get('offset', default=0, type=int)
    timeline_posts = [] # タイムラインのリスト

    # .skip(offset) を追加して、既に読み込んだ分を飛ばす
    # .sort("created_at", -1) で最新順を維持
    for post in posts.find().sort("created_at", -1).skip(offset).limit(TL_Limit):
        timeline_posts.append({ # 変換した投稿をリストに追加
        "id": str(post["_id"]),  # ← ()なしのID、投稿のIDをJSONに変換
        "text": post["text"],
        "good": post["good"],
        "bad": post["bad"],
        "point": post["point"],
        "created_at": post["created_at"].astimezone(JST).isoformat() # 日本の時間に変更
    })

    return jsonify(timeline_posts), 200


@app.route("/react", methods=["POST"]) # POSTリクエストで実行
def react(): # G/B処理の本体
    data = request.json # 送られたJSONを格納

    if not data or not data.get("id") or not data.get("type"): # テキストというかデータが不十分
        return jsonify({"error": "id and type are required"}), 400 # 「エラーやで」

    if data["type"] not in ["good", "bad"]: # 形がおかしい
        return jsonify({"error": "type must be good or bad"}), 400 # 「エラーやで」

    # undoフラグを確認。送られてこなければ False とする
    is_undo = data.get("undo", False)
    # undoなら -1、そうでなければ +1
    change = -1 if is_undo else 1

    try:
        post_id = ObjectId(data["id"])
    except Exception:
        return jsonify({"error": "invalid id"}), 400

    # 対象のフィールド（good か bad）を決定
    field = "good" if data["type"] == "good" else "bad"

    # 数値を更新
    posts.update_one(
        {"_id": post_id},
        {"$inc": {field: change}}
    )

    post = posts.find_one({"_id": post_id}) # GB評価後の投稿に更新

    # 念のため数値がマイナスにならないようガード（トグル連打対策）
    if post[field] < 0:
        posts.update_one({"_id": post_id}, {"$set": {field: 0}})
        post[field] = 0

    if (post["good"] + post["bad"]) == 0:
        point = 0
    else:
        point = (post["good"] - post["bad"]) / (post["good"] + post["bad"]) * math.log((post["good"] + post["bad"]) + 1)# キラキラ度の計算
        # (いいね-よくないね / 全体) * 補正（logで上昇を緩やかに）

    posts.update_one( # 計算したキラキラ度を保存
        {"_id": post_id},
        {"$set": {"point": point}}
    )

    return jsonify({ # フロントに返す
        "message": "reacted",
        "good": post["good"],
        "bad": post["bad"],
        "point": point
    }), 200 # 「うまくいったで」





# テスト用コード
@app.route("/health", methods=["GET"]) # Flaskの構文っぽい
def health():
    return {"status": "ok"}

if __name__ == "__main__": # 直接実行時のみ
    app.run(debug=True) # サーバー起動(開発用。本番で使わない)
