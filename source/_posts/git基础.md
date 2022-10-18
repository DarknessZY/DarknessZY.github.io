---
title: git基础
date: 2022-09-30 17:52
categories: git
tag: [git,前端随笔] 
---

# 一、git基础
## 重新下载git后

**1.先配钥匙（钥匙的作用是把你电脑上面的git和github或gitab连接）**

$ ssh-keygen -t rsa -C "[your_email@youremail.com](mailto:your_email@youremail.com)" //注意啊孩子，双引号里面是你的邮箱(如果在公司你应该有自己的企业邮箱)。填你常用的就行。还有enter代表执行。

添加公钥到 Github(gitee等) 中

登录 github 账号，选中并打开 setting，选择 SSH and GPG keys，选择 New SSH key，在 Title 中填入题目，在 Key 中填入id_rsa.pub 文件中的公钥。

可用如下命令验证上述配置是否成功：

```
ssh -T [git@github.com](mailto:git@github.com) 
```

**2.配置user.name   user.email**

```
# 配置用户名 
git config --global user.name "xxx"                       
# 配置邮件
git config --global user.email "[xxx@xxx.com](mailto:xxx@xxx.com)"              
```

**3.建本地仓库**

新建一个文件夹，用vscode打开该文件夹，git init，该命令执行完后会在当前目录生成一个 .git 目录

**4.添加远程地址（将本地仓库与远程仓库关联起来）**

```
git remote add origin [git@github.com](mailto:git@github.com)/你的github用户名/仓库名.git
```

**5.新建一个txt文本，里面写点东西。我的命名为read**

**6.add和commit**

```
 git add read.txt $ git commit -m "这是你commit的原因，写了方便你我他"
```

**7.push推送到你的github**

```
git push -u origin master
```

**另外注意事项：**

 生成秘钥

  在windows下查看[c盘->用户->用户名->.ssh]下是否有id_rsa、id_rsa.pub文件

，如果没有需要手动生成

  打开git bash，在控制台中输入以下命令： $ ssh-keygen -t rsa -C "自己邮箱"。

------

## 创建分支流程

**1.先切换到主分支，然后创建本地新分支**

```
git branch  <BranchName>（master）
```

**2.显示所有本地分支（创建完看看本地有没有该分支）**

```
git branch
```

**3.切换分支(既然都创建了，肯定要用这个分支，切换到该分支)**

```
git checkout <BranchName>
```

**4.建立远程分支**

```
git push --set-upstream origin + 刚刚创建的分支名 
```

## 删除分支流程

**1.切换分支(先切换到其他分支上)**

```
git checkout  <BranchName2>
```

**2.删除本地分支( 需要切换到别的分支上去删除)  命令行：** 

```
git branch -d  <BranchName>
```

**3.删除远程分支（没建立远程分支就不要没必要） 命令行**：

```
git push origin --delete  <BranchName>
```

## Git 把master的内容更新到自己分支上

**1.如果分支(将此分支暂命名为feature)有修改，则先提交修改的内容，如果没有，直接跳到下一步**

```
git commit -m “这是你commit的原因，写了方便你我他”
```

**2.切换到master分支下**

```
git checkout master
```

**3.将远程的master代码pull拉取到本地**

```
git pull
```

**4.切换到自己分支下**

```
git checkout  <BranchName>
```

**5.合并master到自己分支**

```
git merge master
```

如果在合并的过程中，例如提示Test.java文件出现冲突了，手动修改一下这个文件，修改成自己想要内容；如果没有出现冲突，vs code上下载git history插件 ，可以对比冲突，保留自己想要的代码，没有就直接跳到7步
![冲突解决](https://cdn.jsdelivr.net/gh/DarknessZY/myblog@master/img/image-20221018105811855.png)
上方的Accept Current Change等四种选择按钮，根据情况选择保留Current Change或者Incoming Change;颜色提示很明显，<<<<<< HEAD以下绿色部分是current change,同理蓝色部分是incoming.
both是全部保留

**6.添加修改的文件，将新添加的文件提交上去**

```
git add Test.java

git commit -m “这是你commit的原因，写了方便你我他”
```

**7.将本地分支的代码push到远程仓库对应的分支上**

```
git push origin  
```

# 测试通过后可以上线了将自己分支代码合并到master

1.需要先在，Git 把master的内容更新到自己分支上（在上面）

2.切换到master主分支 git checkout master

3.git pull一下

4.合并到master 

```
git merge （自己分支名字）
```

5.在vscode 源代码管理工具或者sourecetree上对比一下自己提交的代码

5.git push 上传推送代码

##  git stash的使用

应用场景：某一天你正在 feature 分支开发新需求，突然产品经理跑过来说线上有bug，必须马上修复。而此时你的功能开发到一半，于是你急忙想切到 master 分支，然后你就会看到以下报错：

因为当前有文件更改了，需要提交commit保持工作区干净才能切分支

使用git stash代码就被存起来了

当你修复完线上问题，切回 feature 分支，想恢复代码也只需要：git stash apply

```
相关的命令
# 保存当前未commit的代码
git stash

# 保存当前未commit的代码并添加备注
git stash save "备注的内容"

# 列出stash的所有记录
git stash list

# 删除stash的所有记录
git stash clear

# 应用最近一次的stash
git stash apply

# 应用最近一次的stash，随后删除该记录
git stash pop

# 删除最近的一次stash
git stash drop
```

## git reset --soft的使用

应用场景1：有时候手滑不小心把不该提交的内容 commit 了，这时想改回来，只能再 commit 一次，又多一条“黑历史”。

```
# 恢复最近一次 commit
git reset --soft HEAD^
```

reset --soft 相当于后悔药，给你重新改过的机会。对于上面的场景，就可以再次修改重新提交，保持干净的 commit 记录

# 二、电脑同时配置github与公司内部使用的gitlab

下载git

生成对应的gitlab和github的公秘钥 ssh-keygen -t rsa -C “你的gitlab邮箱” -f ~/.ssh/id_rsa_gitlab ssh-keygen -t rsa -C “注册 github 账户的邮箱”

这样你会在.ssh文件夹(.ssh在哪具体百度去)，找到四个文件

这四个文件分别对应gitlab和github的公私钥，分别将gitlab和github的公钥配置到github和你公司的gitlab的ssh上

在.ssh目录下创建一个config文件，写入以下内容

```
Host github.com
HostName github.com
User zhangyao
IdentityFile ~/.ssh/github_rsa 

Host hcgit.hengchang6.com
HostName gitlab.com
User zhangyao
IdentityFile ~/.ssh/id_rsa
```

测试连接是否成功

```
ssh -T git@gitlab
ssh -T git@github.com
# Hi XXX! You've successfully authenticated, but GitHub does not provide shell access.
# 出现上边这句，表示链接成功
```

<font color='#478fd2'>参考文章：</font>[电脑同时配置github与公司内部使用的gitlab](https://blog.csdn.net/jueji1998/article/details/103815585)

# 本地已有项目如何上传到github上

不和你多bb了,自己看：[本地已有项目如何上传到github上_前端学狗的博客-CSDN博客](https://blog.csdn.net/weixin_44370837/article/details/121565864)

# git 冲突相关

**#预防发生冲突的方法：在每次push前git pull一下，保证本地代码都是最新的。**

**\#冲突解决方法：**

第一种冲突：在Git push的时候提示冲突了。

这种解决方法可以使用    git stash

保存本地代码，然后拉取最新的远程分支代码

```
git fetch --all   //只是下载远程内容，不做任何合并  
git reset --hard origin/master    //把HEAD指向刚下载的最新版本
再使用git stash apply应用最近存储，重新push即可。
```