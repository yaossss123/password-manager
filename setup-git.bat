@echo off
echo 配置Git用户信息...
echo.

echo 请按照提示输入你的GitHub信息：
echo.

set /p git_name="张凌曜: "
set /p git_email="911339006@qq.com: "

echo.
echo 正在配置Git...
git config --global user.name "%git_name%"
git config --global user.email "%git_email%"

echo.
echo Git配置完成！
echo 用户名: %git_name%
echo 邮箱: %git_email%
echo.

echo 现在可以继续GitHub部署了...
pause 