# 密码管理器 (Password Manager)

一个安全、简单、便捷的密码管理解决方案，支持本地部署和XAMPP环境。

## 🌟 项目特色

- 🔐 **安全可靠**: 使用主密码加密保护所有数据
- 🎨 **现代化界面**: 美观的渐变设计和毛玻璃效果
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🚀 **双版本支持**: 标准Node.js版本和XAMPP版本
- 💾 **本地存储**: 数据存储在本地，保护隐私
- 🎯 **简单易用**: 直观的用户界面和操作流程

## 📋 功能特性

### 核心功能
- ✅ 用户注册和登录
- ✅ 密码添加、编辑、删除
- ✅ 密码分类管理
- ✅ 密码搜索和筛选
- ✅ 密码强度检查
- ✅ 数据导入导出

### 界面特性
- ✅ 现代化UI设计
- ✅ 毛玻璃效果
- ✅ 动画过渡效果
- ✅ 响应式布局
- ✅ 深色/浅色主题
- ✅ 无障碍访问支持

## 🛠️ 技术栈

### 前端
- **HTML5**: 语义化标记
- **CSS3**: 现代样式和动画
- **JavaScript**: 交互逻辑
- **Font Awesome**: 图标库

### 后端
- **Node.js**: 服务器环境
- **Express.js**: Web框架
- **XAMPP**: 集成开发环境

## 📦 安装部署

### 方式一：Node.js版本

1. **克隆项目**
```bash
git clone https://github.com/yaossss123/password-manager.git
cd password-manager
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务**
```bash
npm start
```

4. **访问应用**
```
http://localhost:3000
```

### 方式二：XAMPP版本

1. **安装XAMPP**
   - 下载并安装 [XAMPP](https://www.apachefriends.org/)
   - 启动Apache服务

2. **部署文件**
```bash
# 复制项目文件到XAMPP目录
xcopy /E /I "public\*" "C:\xampp\htdocs\password-manager\"
```

3. **访问应用**
```
http://localhost/password-manager/xampp-version.html
```

## 🚀 快速开始

### 首次使用

1. **注册账户**
   - 设置主密码（请务必记住）
   - 完成注册

2. **添加密码**
   - 点击"添加密码"按钮
   - 填写网站/应用信息
   - 选择分类

3. **管理密码**
   - 查看、编辑、删除密码
   - 按分类筛选
   - 搜索特定密码

### 使用技巧

- 🔑 **主密码**: 请设置强密码并妥善保管
- 📁 **分类管理**: 使用分类功能整理密码
- 🔍 **搜索功能**: 快速找到需要的密码
- 📱 **移动端**: 支持手机和平板访问

## 📁 项目结构

```
password-manager/
├── server.js                 # Node.js服务器
├── package.json              # 项目配置
├── public/                   # 前端文件
│   ├── index.html           # 标准版本主页
│   ├── app.js               # 前端逻辑
│   ├── styles.css           # 标准版本样式
│   ├── xampp-version.html   # XAMPP版本主页
│   └── xampp-styles.css     # XAMPP版本样式
├── start-xampp-complete.bat # XAMPP启动脚本
├── check-xampp-status.bat   # 状态检查脚本
└── docs/                    # 文档
    ├── XAMPP-DEPLOYMENT.md  # XAMPP部署指南
    ├── XAMPP-BEAUTIFICATION.md # 界面美化说明
    └── xampp-external-access.md # 外网访问配置
```

## 🔧 配置说明

### 环境要求

- **Node.js**: 版本 14.0+
- **XAMPP**: 版本 8.0+
- **浏览器**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

### 端口配置

- **Node.js版本**: 端口 3000
- **XAMPP版本**: 端口 80 (Apache默认)

## 🛡️ 安全特性

- **本地存储**: 数据存储在浏览器本地
- **主密码加密**: 使用主密码保护所有数据
- **无服务器依赖**: 完全离线运行
- **隐私保护**: 不收集用户数据

## 🎨 界面设计

### 设计理念
- **现代化**: 采用最新的UI设计趋势
- **简洁性**: 界面简洁，操作直观
- **一致性**: 统一的设计语言和交互模式

### 视觉特色
- **渐变背景**: 紫色渐变营造现代感
- **毛玻璃效果**: backdrop-filter实现模糊效果
- **动画过渡**: 流畅的交互动画
- **响应式**: 适配各种屏幕尺寸

## 📊 浏览器兼容性

| 浏览器 | 版本要求 | 支持状态 |
|--------|----------|----------|
| Chrome | 60+ | ✅ 完全支持 |
| Firefox | 55+ | ✅ 完全支持 |
| Safari | 12+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发环境设置

1. **Fork项目**
2. **创建功能分支**
3. **提交更改**
4. **发起Pull Request**

### 代码规范

- 使用ES6+语法
- 遵循ESLint规则
- 添加适当的注释
- 保持代码简洁

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✅ 初始版本发布
- ✅ 支持用户注册和登录
- ✅ 密码管理功能
- ✅ 分类管理
- ✅ 响应式设计
- ✅ XAMPP部署支持

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Font Awesome](https://fontawesome.com/) - 图标库
- [XAMPP](https://www.apachefriends.org/) - 开发环境
- [Express.js](https://expressjs.com/) - Web框架

## 📞 联系方式

- **GitHub**: [yaossss123/password-manager](https://github.com/yaossss123/password-manager)
- **Issues**: [GitHub Issues](https://github.com/yaossss123/password-manager/issues)

---

**⭐ 如果这个项目对您有帮助，请给个Star支持一下！** 