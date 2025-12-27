---
sidebar_position: 2
sidebar_label: 介绍
---

# Tutorial Intro 测试

Let's discover **Docusaurus in less than 5 minutes**.


# 1. 把当前所有修改加入暂存区
git add .

# 2. 修正上一次提交 (并保留上一次的提交文字，不弹窗编辑)
git commit --amend --no-edit

如果你想顺便改一下提交的文字，把第二句改成：git commit --amend -m "新的提交说明"

如果你的 上一次提交 已经推送到 GitHub 了（即你之前已经 git push 过了）：
合并后，你的本地版本会和 GitHub 上的版本不一致（产生分叉）。
此时如果你想推送到 GitHub，必须使用强制推送：
git push -f
如果你还没推送到 GitHub，则不需要 -f，直接合并完正常 push 即可。