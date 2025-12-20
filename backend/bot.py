import time
import requests
import os
from dotenv import load_dotenv # .env読み込み
import random

load_dotenv()

API_BASE = "http://127.0.0.1:5000" # API：バックエンドのドメイン

SUBJECTS = ["今日は", "たまには", "今は", "明日は", "しばらく", "僕は", "私は","うちは","俺は", "小生は","吾輩は","明日は","昨日は","おとといは" ,"一か月前は","来月は","来年は","去年は","おととしは","百年後は","人類は",
            "人間は","この世は","あの世は", "好きピが","推しが","ヲタクが","社会人が","国会議員が","その辺の犬が","公園で拾った石が","子供が","日本は","世界は", "実は", "大学は", "深夜には", "ビャンビャン麺は"]
VERBS = ["深呼吸して", "休憩して", "力を抜いて", "思いっきり走って", "止まって", "走って","飛び回って","笑って","のたうち回って","壊れて","あがいて","泣いて","喧嘩して", "引退して"，"転生して"，"ブレイクダンスして"，
         "テレビに出て"，"真剣白刃取りして"，"TikTokしてて"，"未知との遭遇して"，"消えてて"，"バイブスぶち上って"，"モノマネして"，"バイトしてて"，"パチンコ負けて", "ニュースになって"]
ENDINGS = ["みよう", "もいいね", "いいかも", "幸せ", "ハッピー", "極楽","地獄","楽しい","悲しい","寂しい","つらい","美しい","かまびすしい","なまめかしい","デリシャス", "草", "尊い", "顔ない"]

# いいねされやすい言葉
GOOD_WORDS = ["良い", "ハッピー", "嬉しい", "楽しい", "幸せ", "きれい", "綺麗", "美しい", "いいね", "頑張", "天国", "好き", "尊い", "たすかる"]
# よくないねされやすい言葉
BAD_WORDS  = ["つらい", "最悪", "嫌だ", "嫌い", "寂しい", "寒い", "地獄", "死", "あいつ", "うるさい"]

# (特定のワードに)確率でいいね/よくないねするbot
def decide_reaction(text):
    r = random.random()

    # ワードに引っかかった場合
    if any(w in text for w in GOOD_WORDS):
        if r < 0.7:
            return "good"

    if any(w in text for w in BAD_WORDS):
        if r < 0.7:
            return "bad"

    # ワードに引っかからなかった場合
    if r  < 0.1:
        return "good"
    elif r < 0.2:
        return "bad"

    return None

reacted_ids = set() # 評価済み

def watch_timeline_and_react(): # 投稿を定期的に監視、評価されてない（人が投げた）投稿を評価するやつ
    try:
        timeline = requests.get(f"{API_BASE}/timeline").json()
    except Exception as e:
        print("timeline error:", e) # エラー
        return

    for post in timeline:
        post_id = post["id"]

        # すでに評価済みならスキップ
        if post_id in reacted_ids:
            continue

        text = post["text"]
        reaction = decide_reaction(text) # 評価する

        if reaction: # いつもの評価処理
            requests.post(
                f"{API_BASE}/react",
                json={
                    "id": post_id,
                    "type": reaction
                }
            )
            print("reacted to timeline post:", reaction, text)

        reacted_ids.add(post_id)


# ランダムに投稿投げるbot
while True: # ずっと続く
    text = f"{random.choice(SUBJECTS)} {random.choice(VERBS)} {random.choice(ENDINGS)}"
    # 言葉をランダムに選んで文章を作る

    post_response = requests.post( # 通信
        f"{API_BASE}/post", # API指定
        json={"text": text}
    )

    print("posted:", text)

    post_id = post_response.json()["post_id"] # botによる投稿のID取得
    # botが反応する回数をランダムで決める(偏り気味)
    reaction_count = random.choices(
        [0, 1, 2, 3, 5, 7, 10, 12, 15, 20, 30, 50],
        weights=[4, 12, 16, 20, 16, 12, 8, 5, 3, 2, 1.5, 0.5]
    )[0] # 大体(85%くらいの確率の予定)は0~10回の抽選をされるように(現在88%)
    print(f"reaction count: {reaction_count}") # 「n回反応するで」

    for _ in range(reaction_count): # ランダムな回数反応
        reaction = decide_reaction(text) # botが反応
        if reaction:
            requests.post(
                f"{API_BASE}/react", # API取得
                json={
                    "id": post_id, # ID取得
                    "type": reaction # 反応を更新
                }
            )
            print("reacted:", reaction)

        time.sleep(random.uniform(0.5, 1)) # ある程度間をあける

    watch_timeline_and_react() # wait秒後に未評価投稿を探して評価
    wait = random.randint(60, 90) # 1~1.5分
    #wait = random.randint(10, 15) # 10~15秒（テスト用）
    print(f"wait {wait} seconds") # 「n分待つ」
    time.sleep(wait)
