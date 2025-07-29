@echo off
echo 启动密码管理器...
echo.
echo 正在检查Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js已安装
echo.
echo 正在安装依赖...
npm install

echo.
echo 正在启动服务器...
echo 应用将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo.
node server.js 