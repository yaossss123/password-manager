@echo off
echo XAMPP密码管理器完整启动
echo ================================

echo 检查XAMPP是否安装...
if not exist "C:\xampp\apache\bin\httpd.exe" (
    echo 错误: XAMPP未安装
    echo 请先下载并安装XAMPP
    echo 下载地址: https://www.apachefriends.org/
    pause
    exit /b 1
)

echo XAMPP已安装，开始启动...

echo 第一步: 复制项目文件到XAMPP...
if not exist "C:\xampp\htdocs\password-manager" (
    mkdir "C:\xampp\htdocs\password-manager"
)
xcopy /E /I /Y "C:\Users\zly\Desktop\code\public\*" "C:\xampp\htdocs\password-manager\"

echo 第二步: 启动Apache服务...
start /B "Apache" "C:\xampp\apache\bin\httpd.exe"

echo 第三步: 等待服务启动...
timeout /t 3 /nobreak >nul

echo 第四步: 检查服务状态...
netstat -an | findstr :80 >nul
if %errorlevel% equ 0 (
    echo Apache服务启动成功
) else (
    echo 警告: Apache服务可能未正常启动
)

echo 第五步: 启动Node.js服务器...
cd /d "C:\Users\zly\Desktop\code"
start /B "Node.js Server" "npm start"

echo 第六步: 等待Node.js服务启动...
timeout /t 5 /nobreak >nul

echo.
echo ================================
echo 启动完成！
echo ================================
echo.
echo 访问地址:
echo 1. XAMPP版本: http://localhost/password-manager/xampp-version.html
echo 2. Node.js版本: http://localhost:3000
echo.
echo XAMPP控制面板:
echo http://localhost/xampp/
echo.
echo 如果无法访问，请检查:
echo 1. XAMPP是否正常安装
echo 2. 防火墙是否阻止了端口80和3000
echo 3. 其他程序是否占用了这些端口
echo.
echo 停止服务:
echo 1. 关闭命令行窗口
echo 2. 在XAMPP控制面板中停止Apache
echo.
echo 重启服务: 运行 start-xampp-complete.bat
echo.
pause 