const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 最小化中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 快速健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// 根路径
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 延迟加载主服务器
app.get('/api/ready', (req, res) => {
  // 动态加载主服务器模块
  const mainServer = require('./server.js');
  res.json({ message: 'Server ready', timestamp: new Date().toISOString() });
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`轻量级服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
});

server.timeout = 30000;

module.exports = app; 