# XAMPP部署指南

## 什么是XAMPP？

XAMPP是一个集成的Web开发环境，包含：
- Apache Web服务器
- MySQL数据库
- PHP编程语言
- phpMyAdmin数据库管理工具

## 安装步骤

### 1. 下载XAMPP

访问官方网站：https://www.apachefriends.org/
下载Windows版本的XAMPP（约150MB）

### 2. 安装XAMPP

1. 运行下载的安装程序
2. 选择安装路径：`C:\xampp`
3. 选择组件：至少选择Apache
4. 完成安装

### 3. 启动XAMPP

1. 打开XAMPP Control Panel
2. 点击Apache旁边的"Start"按钮
3. 等待Apache服务启动（状态变为绿色）

### 4. 部署项目

1. 打开命令行，进入项目目录：
```bash
cd C:\Users\zly\Desktop\code
```

2. 复制项目文件到XAMPP：
```bash
xcopy /E /I "public\*" "C:\xampp\htdocs\password-manager\"
```

3. 启动Node.js服务器：
```bash
npm start
```

## 配置说明

### Apache配置

文件位置：`C:\xampp\apache\conf\httpd.conf`

主要配置项：
```apache
# 文档根目录
DocumentRoot "C:/xampp/htdocs"

# 默认首页
DirectoryIndex index.html index.php

# 启用模块
LoadModule rewrite_module modules/mod_rewrite.so
```

### 访问地址

- XAMPP版本：http://localhost/password-manager/xampp-version.html
- Node.js版本：http://localhost:3000
- XAMPP控制面板：http://localhost/xampp/

## 快速启动

使用提供的批处理文件：

1. **完整启动**：运行 `start-xampp-complete.bat`
2. **状态检查**：运行 `check-xampp-status.bat`

## 故障排除

### 常见问题

1. **端口80被占用**
   - 解决方案：停止其他Web服务器（IIS、Nginx等）
   - 或修改Apache端口：编辑 `httpd.conf` 中的 `Listen 80` 改为其他端口

2. **防火墙阻止**
   - 解决方案：在Windows防火墙中允许Apache和Node.js

3. **权限问题**
   - 解决方案：以管理员身份运行XAMPP Control Panel

### 服务管理

- **启动Apache**：在XAMPP Control Panel中点击"Start"
- **停止Apache**：在XAMPP Control Panel中点击"Stop"
- **重启Apache**：先点击"Stop"，再点击"Start"

## 部署对比

| 特性 | XAMPP | Vercel | Railway |
|------|-------|--------|---------|
| 部署难度 | 简单 | 中等 | 中等 |
| 本地开发 | 支持 | 支持 | 支持 |
| 外网访问 | 需要配置 | 自动 | 自动 |
| 数据库 | MySQL | 外部 | 外部 |
| 成本 | 免费 | 免费额度 | 免费额度 |
| 维护 | 手动 | 自动 | 自动 |

## 推荐部署方案

1. **开发阶段**: 使用XAMPP + Node.js
2. **生产环境**: 使用XAMPP + 静态文件部署

## 安全建议

1. 修改默认密码
2. 限制访问权限
3. 定期更新XAMPP
4. 使用HTTPS（生产环境）

## 性能优化

1. 启用Apache缓存
2. 压缩静态文件
3. 优化图片大小
4. 使用CDN加速

## 备份策略

1. 定期备份项目文件
2. 备份数据库（如果使用）
3. 备份配置文件
4. 使用版本控制（Git）

## 监控和维护

1. 检查服务状态
2. 查看错误日志
3. 监控资源使用
4. 定期清理临时文件

---

**注意**: 本指南适用于Windows环境，其他操作系统请参考XAMPP官方文档。 