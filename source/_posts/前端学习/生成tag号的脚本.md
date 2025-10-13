---
title: 生成tag号的脚本
date: 2025-10-13 17:53
tags: [随笔]
categories: 脚本
---

平时改完bug重新部署测试环境，总要重新打tag，虽然也就几行git命令的事，但能用一句命令解决还是舒服的

在scripts新建文件 generateTag.js
```js
/**
 * 基于当前分支生成 tag 号，并推送至远程
 */
const { execSync } = require('child_process');
const readline = require('readline');

// 生成当前时间的 tag，格式为 YYYYMMDDHHmmss
function getCurrentTag() {
    const now = new Date();
    const pad = n => n < 10 ? '0' + n : n;
    return [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds())
    ].join('');
}


try {
    // 获取当前分支名
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`当前分支为 "${branch}"，确定要在该分支上打 tag 并推送吗？(y/N): `, (answer) => {
        if (answer.toLowerCase() !== 'y') {
            console.log('操作已取消。');
            rl.close();
            process.exit(0);
        }
        try {
            const tag = getCurrentTag();
            execSync(`git tag ${tag}`, { stdio: 'inherit' });
            execSync(`git push origin ${tag}`, { stdio: 'inherit' });
            console.log(`Tag ${tag} 已创建并推送到远端`);
        } catch (err) {
            console.error('创建或推送 tag 失败:', err.message);
            process.exit(1);
        }
        rl.close();
        process.exit(0);
    });
    return;
} catch (err) {
    console.error('创建或推送 tag 失败:', err.message);
    process.exit(1);
}
```

在package.json中的'scripts'添加
```js
  "tag": "node ./scripts/generateTag"
```

使用

```js
npm run tag
```