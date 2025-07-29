# Railway 部署指南

## 为什么选择 Railway？

- ✅ 更快的启动时间
- ✅ 更稳定的性能
- ✅ 免费额度更慷慨
- ✅ 更好的冷启动处理

## 部署步骤

### 1. 注册 Railway 账号
访问：https://railway.app/
使用 GitHub 账号登录

### 2. 创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的 `password-manager` 仓库

### 3. 配置环境变量
在 Railway 项目设置中添加：
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
APP_URL=https://your-railway-app-url.railway.app
NODE_ENV=production
```

### 4. 部署
Railway 会自动检测 `package.json` 并部署

### 5. 获取域名
部署完成后，Railway 会提供一个域名，类似：
`https://password-manager-production-xxxx.up.railway.app`

## 优势对比

| 平台 | 启动时间 | 稳定性 | 免费额度 |
|------|----------|--------|----------|
| Vercel | 慢（冷启动） | 一般 | 有限 |
| Railway | 快 | 好 | 更慷慨 |

## 故障排除

如果遇到问题：
1. 检查环境变量是否正确设置
2. 查看 Railway 日志
3. 确保 `package.json` 中的 `start` 脚本正确

## 迁移现有数据

如果从 Vercel 迁移：
1. 导出当前数据（如果有）
2. 重新注册用户（因为数据是内存存储）
3. 重新添加密码条目 