import time
import requests
import os
from dotenv import load_dotenv # .env読み込み
import random

load_dotenv()

API_BASE = "http://127.0.0.1:5000"

SUBJECTS = ["今日は", "たまには", "今は", "明日は", "しばらく"]
VERBS = ["深呼吸して", "休憩して", "力を抜いて", "思いっきり走って", "止まって"]
ENDINGS = ["みよう", "もいいね", "いいかも", "幸せ", ""]

while True:
    text = f"{random.choice(SUBJECTS)} {random.choice(VERBS)} {random.choice(ENDINGS)}"
    # 言葉をランダムに選んで文章を作る

    r = requests.post( # 通信
        f"{API_BASE}/post", # API指定
        json={"text": text}
    )

    print("posted:", text)

    wait = random.randint(60, 300) # 1~5分
    print(f"wait {wait} seconds") # n分待つ
    time.sleep(wait)
