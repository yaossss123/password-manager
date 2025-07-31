# XAMPP外网访问配置指南

## 概述

本指南将帮助您配置XAMPP，使密码管理器可以从外网访问。

## 访问地址

- 本地访问：http://localhost/password-manager/xampp-version.html
- 外网访问：http://你的公网IP/password-manager/xampp-version.html

## 配置步骤

### 1. 获取公网IP

#### 方法一：使用命令行
```bash
curl ifconfig.me
```

#### 方法二：访问网站
访问 https://whatismyipaddress.com/ 查看您的公网IP

#### 方法三：使用在线服务
```bash
curl ipinfo.io/ip
```

### 2. 配置防火墙

#### Windows防火墙设置

1. 打开Windows防火墙设置
2. 点击"允许应用或功能通过Windows防火墙"
3. 点击"更改设置"
4. 找到Apache HTTP Server，确保勾选"专用"和"公用"
5. 如果没有找到，点击"允许其他应用"添加Apache

#### 手动添加端口规则

```bash
# 添加入站规则（端口80）
netsh advfirewall firewall add rule name="Apache HTTP Server" dir=in action=allow protocol=TCP localport=80

# 添加出站规则（端口80）
netsh advfirewall firewall add rule name="Apache HTTP Server" dir=out action=allow protocol=TCP localport=80
```

### 3. 配置路由器

#### 端口转发设置

1. 登录路由器管理界面（通常是192.168.1.1）
2. 找到"端口转发"或"Port Forwarding"设置
3. 添加新规则：
   - 协议：TCP
   - 外部端口：80
   - 内部端口：80
   - 内部IP：您的电脑IP地址
   - 描述：Apache Web Server

#### 获取本机IP地址

```bash
ipconfig | findstr "IPv4"
```

### 4. 测试外网访问

#### 使用curl测试
```bash
curl http://你的公网IP/password-manager/xampp-version.html
```

#### 使用浏览器测试
在浏览器中访问：http://你的公网IP/password-manager/xampp-version.html

## 使用natapp进行内网穿透

如果您的网络环境不支持端口转发，可以使用natapp进行内网穿透。

### 1. 下载natapp

访问 https://natapp.cn/ 下载客户端

### 2. 注册账号

1. 注册natapp账号
2. 购买隧道（免费版即可）
3. 获取authtoken

### 3. 配置natapp

创建配置文件 `natapp.ini`：
```ini
# natapp配置文件
authtoken=你的authtoken
log=natapp.log
loglevel=INFO
http_proxy=false
```

### 4. 启动natapp

```bash
# 启动natapp
natapp -config=natapp.ini
```

### 5. 访问地址

natapp会提供一个公网地址，例如：
`http://abc123.natapp1.cc`

朋友可以通过 `http://abc123.natapp1.cc/password-manager/xampp-version.html` 访问

## 安全配置

### 1. 修改Apache配置

编辑 `C:\xampp\apache\conf\httpd.conf`：

```apache
# 限制访问目录
<Directory "C:/xampp/htdocs">
    Require all granted
    # 只允许特定IP访问（可选）
    # Require ip 192.168.1.0/24
</Directory>

# 禁用目录浏览
Options -Indexes

# 设置安全头
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### 2. 设置访问密码

创建密码文件：
```bash
# 创建密码文件
htpasswd -c C:\xampp\apache\passwords username
```

配置Apache：
```apache
# 在httpd.conf中添加
<Directory "C:/xampp/htdocs/password-manager">
    AuthType Basic
    AuthName "Password Manager"
    AuthUserFile "C:/xampp/apache/passwords"
    Require valid-user
</Directory>
```

### 3. 启用HTTPS（推荐）

1. 生成SSL证书
2. 配置Apache SSL模块
3. 设置HTTPS重定向

## 故障排除

### 常见问题

#### 1. 无法从外网访问

**检查项目：**
- 防火墙设置
- 路由器端口转发
- Apache服务状态
- 网络连接

**解决方案：**
```bash
# 检查Apache状态
netstat -an | findstr :80

# 检查防火墙规则
netsh advfirewall firewall show rule name="Apache HTTP Server"
```

#### 2. 访问速度慢

**优化建议：**
- 使用CDN加速
- 压缩静态文件
- 启用Apache缓存
- 优化图片大小

#### 3. 安全警告

**安全措施：**
- 定期更新XAMPP
- 使用强密码
- 限制访问IP
- 启用HTTPS

### 测试命令

#### 测试本地访问
```bash
curl http://localhost/password-manager/xampp-version.html
```

#### 测试外网访问
```bash
curl http://你的公网IP/password-manager/xampp-version.html
```

#### 测试端口连通性
```bash
telnet 你的公网IP 80
```

## 监控和维护

### 1. 日志监控

查看Apache访问日志：
```bash
tail -f C:\xampp\apache\logs\access.log
```

查看错误日志：
```bash
tail -f C:\xampp\apache\logs\error.log
```

### 2. 性能监控

使用Apache状态模块：
```apache
# 在httpd.conf中启用
LoadModule status_module modules/mod_status.so

<Location /server-status>
    SetHandler server-status
    Require ip 127.0.0.1
</Location>
```

### 3. 定期维护

- 清理日志文件
- 更新XAMPP版本
- 备份配置文件
- 检查安全更新

## 总结

通过以上配置，您的密码管理器就可以从外网安全访问了。记住：

1. **安全第一**：使用HTTPS和访问控制
2. **定期维护**：更新软件和监控日志
3. **备份重要**：定期备份配置和数据
4. **测试验证**：定期测试访问功能

---

**注意**：外网访问存在安全风险，请谨慎配置访问权限。 