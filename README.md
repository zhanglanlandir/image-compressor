# Image Compression Tool 图片压缩工具

A simple and elegant online image compression tool with Apple-style design.
一个简洁优雅的在线图片压缩工具，采用苹果设计风格。

## Features 功能特点

- Upload images by clicking or drag-and-drop 支持点击或拖放上传图片
- Support PNG and JPG formats 支持 PNG、JPG 等常见图片格式
- Real-time preview of original and compressed images 实时预览压缩前后的效果
- Display file size comparison 显示压缩前后的文件大小对比
- Adjustable compression quality 支持自定义压缩比例
- One-click download of compressed images 一键下载压缩后的图片
- Responsive design for all devices 响应式设计，支持各种设备访问

## Live Demo 在线演示

Visit the live demo at: [https://[your-username].github.io/image-compression/](https://[your-username].github.io/image-compression/)

## Technical Details 技术实现

- Pure HTML5 + CSS3 for the user interface 使用原生 HTML5 + CSS3 构建用户界面
- FileReader API for image preview 采用 FileReader API 实现图片预览
- Canvas API for image compression 使用 Canvas API 进行图片压缩处理
- Flexbox layout for responsive design 应用 Flexbox 布局实现响应式设计

## Local Development 本地开发

1. Clone the repository 克隆仓库
```bash
git clone https://github.com/[your-username]/image-compression.git
```

2. Navigate to the project directory 进入项目目录
```bash
cd image-compression
```

3. Start a local server 启动本地服务器
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server
```

4. Open in browser 在浏览器中打开
```
http://localhost:8000
```

## Project Structure 项目结构

```
/
├── index.html          # Main page 主页面
├── css/               
│   └── style.css      # Styles 样式文件
├── js/
│   └── main.js        # Core logic 主要逻辑代码
└── README.md          # Documentation 项目说明文档
```

## Design Style 设计风格

- Apple-style design language 采用苹果风格设计语言
- Clean white background 使用简洁的白色背景
- Elegant shadow effects 应用优雅的阴影效果
- Smooth transitions and animations 注重交互细节和动画过渡
- Intuitive user interface 遵循直观易用的设计原则

## License 许可证

MIT License