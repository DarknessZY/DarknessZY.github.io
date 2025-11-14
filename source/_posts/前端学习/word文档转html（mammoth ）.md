---
title: word文档转html（mammoth ）
date: 2025-11-10 19:53
tags: [随笔,脚本]
categories: 前端随笔
---

# 前言
> 最近老有需要把协议Word转化为html纯预览展示的需求，为了后面方便摸鱼，用工具包脚本直接转化（手动狗头），主要使用的是 mammoth 。

# Word 转 HTML 工具

使用 [mammoth](https://github.com/mwilliamson/mammoth.js) 将 Word 文档转换为 HTML，特别适用于协议文档的在线预览。

## 安装依赖

bash

```
npm install mammoth
```

## 完整代码

javascript

```
const mammoth = require('mammoth')
const fs = require('fs')
const path = require('path')

function getFileConfig() {
  const inputDir = path.resolve(__dirname, 'input');
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.docx'));
  return files.map(f => {
    return {
      inputPath: path.join(__dirname, 'input',f),
      outputPath: path.join(__dirname, 'output', f.replace('.docx', '.html'))
    }
  });
}

function transformParagraph(element) {
  let styleName = "";
  if (element.alignment === "center") {
    styleName = "text-center";
  } else if (element.alignment === "right") {
    styleName = "text-right";
  }
  
  return {
      ...element,
      styleName
  };
}

const options = {
  styleMap: [
    "p[style-name='text-center'] => p.text-center:fresh",
    "p[style-name='text-right'] => p.text-right:fresh",
     "u => span.text-underline:fresh"
  ],
  transformDocument: mammoth.transforms.paragraph(transformParagraph)
}

const convertToHtml = (config) => {
  const { inputPath, outputPath } = config;
  return mammoth.convertToHtml({ path: inputPath }, options).then(function(result){
    const html = result.value
    const templatePath = path.join(__dirname, 'template.html')
    const tempHtml = fs.readFileSync(templatePath, 'utf8')
    const insertTag = '<div id="app">'
    const insertIndex = tempHtml.lastIndexOf(insertTag) + insertTag.length
    const resHtml = tempHtml.slice(0, insertIndex) + html + tempHtml.slice(insertIndex)
    fs.writeFileSync(outputPath, resHtml, 'utf8')
  }).catch(function(err){
    console.log(err);
  });
}

const allFileConfig = getFileConfig();
const allFileConfigLength = allFileConfig.length;
// 清空 output 目录
if (fs.existsSync(path.join(__dirname, 'output'))) {
  fs.rmdirSync(path.join(__dirname, 'output'), { recursive: true, force: true });
}
fs.mkdirSync(path.join(__dirname, 'output'));

let index = 0;
console.log(`开始转换，共 ${allFileConfigLength} 个文件`);
function runNext() {
  if (index >= allFileConfigLength) {
    console.log('文件转换完成，请查看 output 目录');
    return;
  }
  
  const config = allFileConfig[index];
  console.log(`${index + 1}: ${path.basename(config.inputPath)}`);
  
  convertToHtml(config).then(() => {
    index++;
    runNext();
  }).catch(err => {
    console.error(`Error processing file ${path.basename(config.inputPath)}:`, err);
    index++;
    runNext();
  });
}

runNext();




```

## 目录结构

text

```
word-to-html/
├── input/                 # 存放要转换的 .docx 文件
│   ├── 协议1.docx
│   └── 协议2.docx
├── output/                # 转换后的 HTML 文件输出目录
├── template.html          # HTML 模板文件   
├──index.js
```
## 在package.json的scripts中添加命令行脚本

```js
  "convert-doc": "node ./bin/word-to-html/index.js",
```

## 使用方法

1.  将 Word 文档 (.docx) 放入 `input` 目录
2.  运行脚本：
3.  查看 `output` 目录获取转换后的 HTML 文件

## 模板文件示例 (template.html)

```

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>协议文档预览</title>
    <style>
        body {
            font-family: "Microsoft YaHei", sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        #app {
            background: white;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-underline { text-decoration: underline; }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
        }
    </style>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

## 注意事项

-   确保 Word 文档为 .docx 格式
-   复杂表格样式可能需要额外调整
-   脚本会自动覆盖 output 目录中的现有文件
-   建议在转换前备份重要的 Word 文档