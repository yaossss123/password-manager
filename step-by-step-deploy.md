# 密码管理器部署步骤指南

## 🚀 第一步：配置Git

### 1.1 运行Git配置脚本
双击运行 `setup-git.bat`

按照提示输入：
- **姓名**：你的真实姓名（如：张三）
- **邮箱**：你的邮箱地址（如：zhangsan@example.com）

### 1.2 验证Git配置
在PowerShell中运行：
```bash
git config --global user.name
git config --global user.email
```

应该显示你刚才输入的信息。

## 🎯 第二步：创建GitHub仓库

### 2.1 注册GitHub账号
1. 访问：https://github.com
2. 点击"Sign up"
3. 填写用户名、邮箱、密码
4. 完成注册

### 2.2 创建仓库
1. 登录GitHub后，点击右上角"+"号
2. 选择"New repository"
3. 填写仓库信息：
   - **Repository name**: `password-manager`
   - **Description**: `A simple and secure password manager`
   - **Visibility**: 选择"Public"
   - **不要勾选** "Add a README file"
   - **不要勾选** "Add .gitignore"
   - **不要勾选** "Choose a license"
4. 点击"Create repository"

### 2.3 复制仓库URL
创建完成后，你会看到一个页面，复制仓库URL，类似：
`https://github.com/你的用户名/password-manager.git`

## 📤 第三步：上传代码到GitHub

### 3.1 运行部署脚本
双击运行 `deploy-to-github.bat`

### 3.2 添加远程仓库
在PowerShell中运行（替换YOUR_USERNAME为你的GitHub用户名）：
```bash
git remote add origin https://github.com/YOUR_USERNAME/password-manager.git
```

### 3.3 推送代码
```bash
git branch -M main
git push -u origin main
```

如果提示输入用户名和密码：
- **用户名**：你的GitHub用户名
- **密码**：使用GitHub Personal Access Token（不是登录密码）

### 3.4 创建Personal Access Token
如果提示需要密码，需要创建Token：

1. 在GitHub点击右上角头像 → "Settings"
2. 左侧菜单点击"Developer settings"
3. 点击"Personal access tokens" → "Tokens (classic)"
4. 点击"Generate new token" → "Generate new token (classic)"
5. 填写信息：
   - **Note**: `password-manager-deploy`
   - **Expiration**: 选择"90 days"
   - **Select scopes**: 勾选"repo"
6. 点击"Generate token"
7. **复制生成的token**（重要！只显示一次）

使用这个token作为密码推送代码。

## 🌐 第四步：部署到Vercel

### 4.1 注册Vercel账号
1. 访问：https://vercel.com
2. 点击"Sign Up"
3. 选择"Continue with GitHub"
4. 授权Vercel访问你的GitHub

### 4.2 导入项目
1. 登录Vercel后，点击"New Project"
2. 在"Import Git Repository"中找到你的`password-manager`仓库
3. 点击"Import"

### 4.3 配置项目
在项目配置页面：

**项目设置**：
- **Project Name**: `password-manager`（或自定义）
- **Framework Preset**: 选择"Other"
- **Root Directory**: 留空
- **Build Command**: 留空
- **Output Directory**: 留空
- **Install Command**: `npm install`

### 4.4 设置环境变量
点击"Environment Variables"添加：

**第一个变量**：
- **Name**: `JWT_SECRET`
- **Value**: `your-super-secret-jwt-key-2024-change-this`
- **Environments**: 勾选 Production, Preview, Development

**第二个变量**：
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environments**: 勾选 Production, Preview, Development

### 4.5 部署
点击"Deploy"按钮，等待部署完成。

## 🔧 第五步：配置域名

### 5.1 获取部署URL
部署完成后，Vercel会提供一个URL，类似：
`https://password-manager-xxx.vercel.app`

### 5.2 设置APP_URL环境变量
1. 在Vercel控制台找到你的项目
2. 点击"Settings" → "Environment Variables"
3. 添加新变量：
   - **Name**: `APP_URL`
   - **Value**: 你的部署URL（如：`https://password-manager-xxx.vercel.app`）
   - **Environments**: 勾选 Production, Preview, Development

### 5.3 重新部署
1. 在Vercel控制台点击"Deployments"
2. 找到最新部署，点击"..." → "Redeploy"

## ✅ 第六步：测试应用

### 6.1 访问应用
打开浏览器访问你的部署URL

### 6.2 测试功能
1. **注册账号**：创建新用户
2. **登录系统**：使用注册的凭据登录
3. **添加密码**：测试密码管理功能
4. **移动端测试**：用手机访问测试响应式设计

## 🎉 部署完成！

### 成功标志
- ✅ 应用可以正常访问
- ✅ 注册和登录功能正常
- ✅ 密码管理功能正常
- ✅ 移动端访问正常
- ✅ HTTPS证书正常

### 分享给朋友
1. 在应用中点击"分享"按钮
2. 扫描生成的二维码
3. 朋友可以通过二维码直接访问

---

**恭喜！你的密码管理器已经成功部署到云端！** 🎉

现在你可以：
- 在任何地方访问你的密码管理器
- 通过二维码分享给朋友
- 享受Vercel的全球CDN加速
- 获得免费的HTTPS证书 