#このファイルは邪道ゴリラが機能を理解するために作ったものである．実際に使うことはない．
Post_detail=[]  #ポストのいいねの数と悪いねの数　これクラスの中格納でもいいかも
Appear_post=[]  #表示するポスト
class User:
    def __init__(self,goodnumber,badnumber):    #(ユーザー,いいねの数（ユーザー）,悪いねの数（ユーザー）)
        self.posts=[]   #ユーザーが今まで投稿したポスト
        self.goodnunber=goodnumber
        self.badnumber=badnumber
        self.pushGood=False     #ポストにいいね押した判定
        self.pushBad=False      #ポストに悪いねを押した判定
    def PushGood(self):     #ユーザーがいいねや悪いねを押した数
        if self.pushGood==True:     #いいね押されたら
            self.goodnunber+=1     #いいねの数（ユーザー）を追加
        if self.pushBad==True:    #悪いね押されたら
            self.badnunber+=1   #悪いねの数（ユーザー）を追加

class Post:
    def __init__(self,user,good,bad):   #(ポスト,ユーザー（投稿者）,いいねの数（ポスト）,悪いねの数（ポスト）)
        self.user=user  #ポストのユーザー
        self.good=good  #ポストのいいねの数 
        self.bad=bad    #ポストの悪いねの数
        self.pushedGood=False   #ポストにいいね押された判定
        self.pushedBad=False    #ポストに悪いねを押された判定
    def savePost(self):     #ポストのいいねの数と悪いねの数を記録
        Post_detail.append([self,self.user,self.good,self.bad])     #Post_detailに保存
        Appear_post.append(self)    #Appear_postに保存
        if len(Appear_post)>20:     #Appear_postの要素数が20を超える場合
            Appear_post.pop(0)      #一番前の値を削除
        #self.user.posts.append(self)    #Userのpostsに保存
    def calcPost(self):     #postの評価を計算
        n=10   #基準の数
        m=0.5   #基準の数
        if self.good>n:     #基準の数より多い
            if (self.good/(self.good+self.bad))>m:      #割合が基準の数より高い
                print("キラキラ")   #キラキラの実装　printはテスト用と考えて後から正しいものにする
            else:#ここelifにして条件細かくした方がよくね？
                print("根暗")   #根暗の実装　printはテスト用と考えて後から正しいものにする
#ここより下はchatGPTに出してもらった例　追加したものはコメント入れる
import tkinter as tk
from tkinter import ttk, messagebox
user_1 = User(0,0)#投稿者
user_2=User(0,0)#閲覧者
test_post=Post(user_1,0,0)
# 評価選択画面（プルダウン）
def open_select_window(text):
    select_window = tk.Toplevel()
    select_window.title("評価選択")
    select_window.geometry("250x150")

    ttk.Label(
        select_window,
        text=f"投稿内容：{text}"
    ).pack(pady=5)

    # プルダウン（Combobox）
    combo = ttk.Combobox(
        select_window,
        values=["いいね", "わるいね","どうでもいいね"],
        state="readonly"
    )
    combo.current(0)  # 初期選択
    combo.pack(pady=10)

    # 決定ボタン
    def submit():
        choice = combo.get()
        #ここら辺ジャゴリ作
        if combo.get()=="いいね":
            if user_2.pushGood==False:
                test_post.good+=1#Postクラスのselfのgoodの数を1プラスしたい
                user_2.pushGood=True
        elif combo.get()=="悪いね":
            if user_2.pushBad==False:
                test_post.bad+=1
                user_2.pushBad=True
        elif combo.get()=="どうでもいいね":
            if user_2.pushGood==True:
                user_2.pushGood=False
                test_post.good-=1
            elif user_2.pushBad==True:
                user_2.pushBad=False
                test_post.bad-=1
        test_post.savePost()
        print(test_post.good)
    #ここまで　どうでもいいねはキャンセル想定　いいねとわるいね混在して押せるようになってる
        messagebox.showinfo(
            "結果",
            f"投稿内容：{text}\n評価：{choice}"
        )
        select_window.destroy()

    ttk.Button(
        select_window,
        text="決定",
        command=submit
    ).pack(pady=10)

# 最初の画面（テキスト入力）
def on_next():
    text = entry.get()
    if text == "":
        messagebox.showwarning("警告", "文字を入力してください")
    else:
        open_select_window(text)

root = tk.Tk()
root.title("テキスト入力")
root.geometry("300x150")

ttk.Label(root, text="投稿内容を入力してください").pack(pady=5)

entry = ttk.Entry(root, width=30)
entry.pack(pady=5)

ttk.Button(root, text="次へ", command=on_next).pack(pady=10)

root.mainloop()
