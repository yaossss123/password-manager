@echo off
echo 准备部署到GitHub...
echo.

echo 检查Git是否安装...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Git，请先安装Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git已安装
echo.

echo 检查Git配置...
git config --global user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo Git用户信息未配置，请先运行 setup-git.bat
    echo 或者手动运行以下命令：
    echo git config --global user.name "张凌曜"
    echo git config --global user.email "911339006@qq.com"
    pause
    exit /b 1
)

echo Git配置正常
echo.

echo 初始化Git仓库...
if exist .git (
    echo Git仓库已存在，跳过初始化
) else (
    git init
)

echo 添加所有文件...
git add .

echo 提交代码...
git commit -m "Initial commit: Password Manager"

echo.
echo ========================================
echo GitHub仓库创建步骤：
echo ========================================
echo 1. 访问 https://github.com
echo 2. 注册或登录GitHub账号
echo 3. 点击右上角"+" → "New repository"
echo 4. 仓库名: password-manager
echo 5. 选择: Public
echo 6. 不要勾选"Add a README file"
echo 7. 点击"Create repository"
echo.
echo 创建仓库后，复制仓库URL，然后运行以下命令：
echo.
echo 示例命令（请替换YOUR_USERNAME为你的GitHub用户名）：
echo git remote add origin https://github.com/YOUR_USERNAME/password-manager.git
echo git branch -M main
echo git push -u origin main
echo.
echo 完成后，继续下一步部署到Vercel
echo ========================================
pause 