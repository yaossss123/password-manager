@echo off
echo XAMPP密码管理器状态检查
echo ================================

echo 检查XAMPP安装状态...
if exist "C:\xampp\apache\bin\httpd.exe" (
    echo ✓ XAMPP已安装
) else (
    echo ✗ XAMPP未安装
    echo 请先下载并安装XAMPP
    pause
    exit /b 1
)

echo.
echo 检查项目文件...
if exist "C:\xampp\htdocs\password-manager\xampp-version.html" (
    echo ✓ XAMPP版本文件存在
) else (
    echo ✗ XAMPP版本文件不存在
    echo 请运行 start-xampp-complete.bat 复制文件
)

echo.
echo 检查Apache服务状态...
netstat -an | findstr :80 >nul
if %errorlevel% equ 0 (
    echo ✓ Apache服务正在运行 (端口80)
) else (
    echo ✗ Apache服务未运行
)

echo.
echo 检查Node.js服务状态...
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ✓ Node.js服务正在运行 (端口3000)
) else (
    echo ✗ Node.js服务未运行
)

echo.
echo 测试访问...
echo 测试XAMPP版本...
curl -s http://localhost/password-manager/xampp-version.html >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ XAMPP版本可以访问
) else (
    echo ✗ XAMPP版本无法访问
)

echo 测试Node.js版本...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js版本可以访问
) else (
    echo ✗ Node.js版本无法访问
)

echo.
echo 获取本机IP地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set ip=%%a
    goto :found_ip
)
:found_ip
set ip=%ip: =%
echo 本机IP: %ip%

echo.
echo ================================
echo 访问地址:
echo ================================
echo 1. 本地访问: http://localhost/password-manager/xampp-version.html
echo 2. 局域网访问: http://%ip%/password-manager/xampp-version.html
echo 3. Node.js版本: http://localhost:3000
echo.
echo XAMPP控制面板:
echo http://localhost/xampp/
echo.
echo 如果无法访问，请检查:
echo 1. 防火墙设置
echo 2. 端口是否被占用
echo 3. 服务是否正常启动
echo.
echo 重启服务: 运行 start-xampp-complete.bat
echo.
pause 