# Vercel部署详细指南

## 步骤1：准备GitHub仓库

### 1.1 安装Git
- 下载：https://git-scm.com/download/win
- 安装时选择默认选项

### 1.2 运行GitHub部署脚本
双击运行 `deploy-to-github.bat`

### 1.3 创建GitHub仓库
1. 访问：https://github.com
2. 点击右上角"+" → "New repository"
3. 仓库名：`password-manager`
4. 选择：Public
5. 不要勾选"Add a README file"
6. 点击"Create repository"

### 1.4 上传代码
在PowerShell中运行：
```bash
# 替换YOUR_USERNAME为你的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/password-manager.git
git branch -M main
git push -u origin main
```

## 步骤2：部署到Vercel

### 2.1 注册Vercel账号
1. 访问：https://vercel.com
2. 点击"Sign Up"
3. 选择"Continue with GitHub"
4. 授权Vercel访问你的GitHub

### 2.2 导入项目
1. 登录Vercel后，点击"New Project"
2. 在"Import Git Repository"中找到你的`password-manager`仓库
3. 点击"Import"

### 2.3 配置项目
在项目配置页面：

**项目名称**：`password-manager`（或自定义）

**Framework Preset**：选择"Other"

**Root Directory**：留空（默认）

**Build Command**：留空

**Output Directory**：留空

**Install Command**：`npm install`

### 2.4 设置环境变量
点击"Environment Variables"添加：

**变量名**：`JWT_SECRET`
**值**：`your-super-secret-jwt-key-2024-change-this`
**环境**：Production, Preview, Development

**变量名**：`NODE_ENV`
**值**：`production`
**环境**：Production, Preview, Development

### 2.5 部署
点击"Deploy"按钮

## 步骤3：配置域名

### 3.1 获取部署URL
部署完成后，Vercel会提供一个URL，类似：
`https://password-manager-xxx.vercel.app`

### 3.2 设置APP_URL环境变量
1. 在Vercel控制台找到你的项目
2. 点击"Settings" → "Environment Variables"
3. 添加新变量：
   **变量名**：`APP_URL`
   **值**：你的部署URL（如：`https://password-manager-xxx.vercel.app`）
   **环境**：Production, Preview, Development

### 3.3 重新部署
1. 在Vercel控制台点击"Deployments"
2. 找到最新部署，点击"..." → "Redeploy"

## 步骤4：测试应用

### 4.1 访问应用
打开浏览器访问你的部署URL

### 4.2 测试功能
1. **注册账号**：创建新用户
2. **登录系统**：使用注册的凭据登录
3. **添加密码**：测试密码管理功能
4. **移动端测试**：用手机访问测试响应式设计

## 步骤5：自定义域名（可选）

### 5.1 购买域名
- 阿里云：https://wanwang.aliyun.com/
- 腾讯云：https://dnspod.cloud.tencent.com/
- 其他：GoDaddy、Namecheap等

### 5.2 配置域名
1. 在Vercel控制台点击"Settings" → "Domains"
2. 点击"Add Domain"
3. 输入你的域名
4. 按照提示配置DNS记录

### 5.3 更新APP_URL
更新环境变量中的APP_URL为你的自定义域名

## 故障排除

### 常见问题

**1. 部署失败**
- 检查环境变量是否正确设置
- 查看Vercel部署日志
- 确保所有文件都已上传到GitHub

**2. 应用无法访问**
- 检查部署URL是否正确
- 查看Vercel控制台的错误信息
- 确认环境变量已正确设置

**3. 功能异常**
- 检查浏览器控制台错误
- 确认JWT_SECRET已设置
- 测试API端点是否正常

### 查看日志
1. 在Vercel控制台点击你的项目
2. 点击"Functions"查看函数日志
3. 点击"Deployments"查看部署日志

## 成功部署后

### 分享给朋友
1. 在应用中点击"分享"按钮
2. 扫描生成的二维码
3. 朋友可以通过二维码直接访问

### 监控应用
- 在Vercel控制台查看访问统计
- 监控错误日志
- 定期检查应用状态

---

**恭喜！你的密码管理器已经成功部署到云端！** 🎉

现在你可以：
- 在任何地方访问你的密码管理器
- 通过二维码分享给朋友
- 享受Vercel的全球CDN加速
- 获得免费的HTTPS证书 