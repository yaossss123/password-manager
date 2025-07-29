@echo off
echo 配置Git用户信息...
echo.

echo 设置用户名...
git config --global user.name "张凌曜"

echo 设置邮箱...
git config --global user.email "911339006@qq.com"

echo.
echo Git配置完成！
echo 用户名: 张凌曜
echo 邮箱: 911339006@qq.com
echo.

echo 验证配置...
git config --global user.name
git config --global user.email

echo.
echo 现在可以继续GitHub部署了！
pause 