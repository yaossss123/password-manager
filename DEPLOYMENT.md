# 密码管理器部署指南

## 本地部署

### 1. 环境要求
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 2. 快速启动
```bash
# Windows用户
双击运行 start.bat

# 或者手动执行
npm install
npm start
```

### 3. 访问应用
打开浏览器访问：http://localhost:3000

## 云端部署

### 选项1: Vercel部署

1. 安装Vercel CLI：
```bash
npm install -g vercel
```

2. 登录Vercel：
```bash
vercel login
```

3. 部署项目：
```bash
vercel
```

4. 设置环境变量：
- 在Vercel控制台中设置 `JWT_SECRET`
- 设置 `APP_URL` 为你的域名

### 选项2: Heroku部署

1. 安装Heroku CLI
2. 创建Heroku应用：
```bash
heroku create your-password-manager
```

3. 设置环境变量：
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set APP_URL=https://your-app.herokuapp.com
```

4. 部署：
```bash
git push heroku main
```

### 选项3: 阿里云/腾讯云部署

1. 购买云服务器
2. 安装Node.js和PM2：
```bash
# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2
npm install -g pm2
```

3. 上传项目文件
4. 安装依赖：
```bash
npm install --production
```

5. 使用PM2启动：
```bash
pm2 start server.js --name password-manager
pm2 startup
pm2 save
```

6. 配置Nginx反向代理：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 生产环境配置

### 1. 环境变量
创建 `.env` 文件：
```env
PORT=3000
JWT_SECRET=your-very-secure-jwt-secret-key
APP_URL=https://your-domain.com
NODE_ENV=production
```

### 2. 安全配置
- 使用强密码作为JWT_SECRET
- 启用HTTPS
- 配置防火墙
- 定期更新依赖

### 3. 数据库集成（可选）
当前版本使用内存存储，生产环境建议使用数据库：

#### MongoDB
```bash
npm install mongoose
```

#### PostgreSQL
```bash
npm install pg
```

### 4. 监控和日志
```bash
# 安装监控工具
npm install winston morgan

# 使用PM2监控
pm2 monit
```

## 域名和SSL配置

### 1. 域名解析
- 将域名解析到服务器IP
- 等待DNS生效（通常几分钟到几小时）

### 2. SSL证书
使用Let's Encrypt免费SSL证书：

```bash
# 安装certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

## 备份策略

### 1. 数据备份
```bash
# 创建备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz /path/to/your/app
```

### 2. 自动备份
```bash
# 添加到crontab
0 2 * * * /path/to/backup-script.sh
```

## 故障排除

### 常见问题

1. **端口被占用**
```bash
# 查看端口占用
netstat -tulpn | grep :3000

# 杀死进程
kill -9 <PID>
```

2. **权限问题**
```bash
# 修改文件权限
chmod +x start.bat
chmod 755 public/
```

3. **内存不足**
```bash
# 增加Node.js内存限制
node --max-old-space-size=4096 server.js
```

### 日志查看
```bash
# PM2日志
pm2 logs password-manager

# 系统日志
tail -f /var/log/syslog
```

## 性能优化

### 1. 启用压缩
```bash
npm install compression
```

### 2. 缓存配置
```javascript
// 在server.js中添加
app.use(express.static('public', {
    maxAge: '1d',
    etag: true
}));
```

### 3. 数据库连接池
如果使用数据库，配置连接池：
```javascript
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

## 更新部署

### 1. 代码更新
```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 重启应用
pm2 restart password-manager
```

### 2. 零停机部署
```bash
# 使用PM2集群模式
pm2 start server.js -i max --name password-manager

# 滚动更新
pm2 reload password-manager
```

---

**重要提醒**：
- 生产环境务必修改默认密钥
- 定期备份数据
- 监控应用性能
- 及时更新安全补丁 