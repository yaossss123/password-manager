@echo off
echo 准备上传代码到GitHub...
echo.

echo 检查Git配置...
git config --global user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Git用户信息未配置
    pause
    exit /b 1
)

echo Git配置正常
echo.

echo 初始化Git仓库...
if exist .git (
    echo Git仓库已存在
) else (
    git init
)

echo 添加所有文件...
git add .

echo 提交代码...
git commit -m "Initial commit: Password Manager"

echo.
echo ========================================
echo 下一步操作：
echo ========================================
echo 1. 确保已在GitHub创建了password-manager仓库
echo 2. 复制仓库URL（类似：https://github.com/你的用户名/password-manager.git）
echo 3. 在PowerShell中运行以下命令：
echo.
echo git remote add origin YOUR_REPOSITORY_URL
echo git branch -M main
echo git push -u origin main
echo.
echo 请告诉我你的GitHub用户名，我会帮你生成完整的命令
echo ========================================
pause 