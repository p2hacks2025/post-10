Post_detail=[]#ポストのいいねの数と悪いねの数
Appear_post=[]#表示するポスト
class Post:
    def __init__(self,good,bad):
        self.good=0  #ポストのいいねの数 
        self.bad=0 #ポストの悪いねの数
    def savePost(self):#ポストのいいねの数と悪いねの数を記録
        Post_detail.insert[self,self.good,self.bad]#Post_detailに保存
        Appear_post.insert(self)#Appear_postに保存
        if len(Appear_post)>20:#Appear_postの要素数が20を超える場合
            Appear_post.pop(0)#一番前の値を削除
    def calcPost(self):#postの評価を計算
        n=10#基準の数
        m=0.5#基準の数
        if self.good>n:#基準の数より多い
            if (self.good/(self.good+self.bad))>m:#割合が基準の数より高い
                print("キラキラ")#キラキラの実装　printはテスト用と考えて後から正しいものにする
            else:
                print("根暗")#根暗の実装　printはテスト用と考えて後から正しいものにする
                
