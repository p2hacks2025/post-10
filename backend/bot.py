import time
import requests
import os
from dotenv import load_dotenv # .env読み込み
import random

load_dotenv()

API_BASE = "http://127.0.0.1:5000" # API

SUBJECTS = ["今日は", "たまには", "今は", "明日は", "しばらく"]
VERBS = ["深呼吸して", "休憩して", "力を抜いて", "思いっきり走って", "止まって"]
ENDINGS = ["みよう", "もいいね", "いいかも", "幸せ", "ハッピー"]

# いいねされやすい言葉
GOOD_WORDS = ["良い", "ハッピー"]
# よくないねされやすい言葉
BAD_WORDS  = ["つらい", "最悪"]

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
        weights=[6, 14, 16, 18, 14, 12, 8, 5, 3, 2, 1.5, 0.5]
    )[0] # 大体(85%くらいの確率の予定)は0~10回の反応をされるように(現在88%)
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

        time.sleep(random.randint(3, 10)) # ある程度間をあける

    wait = random.randint(60, 300) # 1~5分
    print(f"wait {wait} seconds") # 「n分待つ」
    time.sleep(wait)