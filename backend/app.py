import os
from flask import Flask
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv() # .env を読み込む

app = Flask(__name__)

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





# テスト用コード
@app.route("/health", methods=["GET"]) # Flaskの構文っぽい
def health():
    return {"status": "ok"}

if __name__ == "__main__": # 直接実行時のみ
    app.run(debug=True) # サーバー起動(開発用。本番で使わない)