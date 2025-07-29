#!/bin/bash

# 密码管理器服务器部署脚本
# 适用于Ubuntu/CentOS系统

echo "开始部署密码管理器..."

# 更新系统
echo "更新系统包..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 安装Node.js
echo "安装Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
echo "验证Node.js安装..."
node --version
npm --version

# 安装PM2进程管理器
echo "安装PM2..."
sudo npm install -g pm2

# 创建应用目录
echo "创建应用目录..."
sudo mkdir -p /var/www/password-manager
sudo chown $USER:$USER /var/www/password-manager

# 复制项目文件
echo "复制项目文件..."
cp -r * /var/www/password-manager/

# 进入应用目录
cd /var/www/password-manager

# 安装依赖
echo "安装项目依赖..."
npm install --production

# 创建环境变量文件
echo "创建环境变量文件..."
cat > .env << EOF
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
APP_URL=http://your-domain.com
NODE_ENV=production
EOF

# 启动应用
echo "启动应用..."
pm2 start server.js --name password-manager

# 设置PM2开机自启
pm2 startup
pm2 save

echo "应用部署完成！"
echo "应用运行在: http://your-server-ip:3000"
echo "使用以下命令查看日志: pm2 logs password-manager"
echo "使用以下命令重启应用: pm2 restart password-manager" 