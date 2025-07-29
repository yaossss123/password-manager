const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const cors = require('cors');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 内存存储（生产环境应使用数据库）
let users = [];
let passwords = [];
let categories = [
  { id: 'social', name: '社交媒体', color: '#FF6B6B' },
  { id: 'email', name: '邮箱', color: '#4ECDC4' },
  { id: 'banking', name: '银行金融', color: '#45B7D1' },
  { id: 'shopping', name: '购物网站', color: '#96CEB4' },
  { id: 'work', name: '工作相关', color: '#FFEAA7' },
  { id: 'other', name: '其他', color: '#DDA0DD' }
];

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 验证JWT中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '访问令牌无效' });
    }
    req.user = user;
    next();
  });
};

// 加密密码
const encryptPassword = (password, masterPassword) => {
  return CryptoJS.AES.encrypt(password, masterPassword).toString();
};

// 解密密码
const decryptPassword = (encryptedPassword, masterPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterPassword);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};

// 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const { username, masterPassword } = req.body;

    if (!username || !masterPassword) {
      return res.status(400).json({ error: '用户名和主密码不能为空' });
    }

    // 检查用户是否已存在
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    // 加密主密码
    const hashedPassword = await bcrypt.hash(masterPassword, 10);

    const newUser = {
      id: uuidv4(),
      username,
      masterPassword: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({ 
      message: '注册成功',
      userId: newUser.id 
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, masterPassword } = req.body;

    if (!username || !masterPassword) {
      return res.status(400).json({ error: '用户名和主密码不能为空' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const isValidPassword = await bcrypt.compare(masterPassword, user.masterPassword);
    if (!isValidPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ 
      message: '登录成功',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取密码列表
app.get('/api/passwords', authenticateToken, (req, res) => {
  try {
    const userPasswords = passwords.filter(p => p.userId === req.user.userId);
    res.json(userPasswords);
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加密码
app.post('/api/passwords', authenticateToken, (req, res) => {
  try {
    const { title, username, password, url, category, notes } = req.body;
    const { masterPassword } = req.body;

    if (!title || !username || !password || !masterPassword) {
      return res.status(400).json({ error: '标题、用户名、密码和主密码不能为空' });
    }

    // 加密密码
    const encryptedPassword = encryptPassword(password, masterPassword);

    const newPassword = {
      id: uuidv4(),
      userId: req.user.userId,
      title,
      username,
      password: encryptedPassword,
      url: url || '',
      category: category || 'other',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    passwords.push(newPassword);

    res.status(201).json({ 
      message: '密码添加成功',
      password: {
        ...newPassword,
        password: '***' // 不返回实际密码
      }
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新密码
app.put('/api/passwords/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, username, password, url, category, notes, masterPassword } = req.body;

    const passwordIndex = passwords.findIndex(p => p.id === id && p.userId === req.user.userId);
    if (passwordIndex === -1) {
      return res.status(404).json({ error: '密码条目不存在' });
    }

    const encryptedPassword = password ? encryptPassword(password, masterPassword) : passwords[passwordIndex].password;

    passwords[passwordIndex] = {
      ...passwords[passwordIndex],
      title: title || passwords[passwordIndex].title,
      username: username || passwords[passwordIndex].username,
      password: encryptedPassword,
      url: url !== undefined ? url : passwords[passwordIndex].url,
      category: category || passwords[passwordIndex].category,
      notes: notes !== undefined ? notes : passwords[passwordIndex].notes,
      updatedAt: new Date()
    };

    res.json({ 
      message: '密码更新成功',
      password: {
        ...passwords[passwordIndex],
        password: '***'
      }
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除密码
app.delete('/api/passwords/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const passwordIndex = passwords.findIndex(p => p.id === id && p.userId === req.user.userId);
    
    if (passwordIndex === -1) {
      return res.status(404).json({ error: '密码条目不存在' });
    }

    passwords.splice(passwordIndex, 1);
    res.json({ message: '密码删除成功' });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 解密密码
app.post('/api/passwords/:id/decrypt', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { masterPassword } = req.body;

    const password = passwords.find(p => p.id === id && p.userId === req.user.userId);
    if (!password) {
      return res.status(404).json({ error: '密码条目不存在' });
    }

    const decryptedPassword = decryptPassword(password.password, masterPassword);
    if (!decryptedPassword) {
      return res.status(400).json({ error: '主密码错误' });
    }

    res.json({ decryptedPassword });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取分类
app.get('/api/categories', authenticateToken, (req, res) => {
  try {
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加自定义分类
app.post('/api/categories', authenticateToken, (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: '分类名称不能为空' });
    }

    const newCategory = {
      id: uuidv4(),
      name,
      color: color || '#6C757D'
    };

    categories.push(newCategory);
    res.status(201).json({ message: '分类添加成功', category: newCategory });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 修改主密码
app.put('/api/change-master-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: '当前密码和新密码不能为空' });
    }

    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 验证当前密码
    const isValidPassword = await bcrypt.compare(currentPassword, user.masterPassword);
    if (!isValidPassword) {
      return res.status(400).json({ error: '当前密码错误' });
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新用户密码
    user.masterPassword = hashedNewPassword;

    // 重新加密所有密码条目
    const userPasswords = passwords.filter(p => p.userId === req.user.userId);
    userPasswords.forEach(p => {
      const decryptedPassword = decryptPassword(p.password, currentPassword);
      if (decryptedPassword) {
        p.password = encryptPassword(decryptedPassword, newPassword);
      }
    });

    res.json({ message: '主密码修改成功' });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 生成访问二维码
app.get('/api/qr-code', authenticateToken, async (req, res) => {
  try {
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const qrCodeDataURL = await QRCode.toDataURL(appUrl);
    res.json({ qrCodeDataURL, appUrl });
  } catch (error) {
    res.status(500).json({ error: '生成二维码失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 根路径重定向到首页
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`密码管理器服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
});

// 设置超时时间
server.timeout = 30000; // 30秒

module.exports = app; 