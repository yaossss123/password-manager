// 全局变量
let currentUser = null;
let authToken = null;
let passwords = [];
let categories = [];
let currentCategory = 'all';
let masterPassword = '';

// DOM元素
const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabBtns = document.querySelectorAll('.tab-btn');
const passwordGrid = document.getElementById('password-grid');
const categoryList = document.getElementById('category-list');
const currentCategoryTitle = document.getElementById('current-category');
const passwordCount = document.getElementById('password-count');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.querySelector('.modal-body');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// API基础URL
const API_BASE = window.location.origin;

// 工具函数
function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function hideNotification() {
    notification.classList.add('hidden');
}

function showModal(title, content) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.remove('hidden');
}

function hideModal() {
    modalOverlay.classList.add('hidden');
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// API请求函数
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}/api${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || '请求失败');
        }
        
        return data;
    } catch (error) {
        showNotification(error.message, 'error');
        throw error;
    }
}

// 用户认证
async function register(username, password) {
    try {
        await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({ username, masterPassword: password })
        });
        showNotification('注册成功！请登录');
        switchTab('login');
    } catch (error) {
        console.error('注册失败:', error);
    }
}

async function login(username, password) {
    try {
        const data = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ username, masterPassword: password })
        });
        
        currentUser = data.user;
        authToken = data.token;
        masterPassword = password;
        
        // 保存到本地存储
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification('登录成功！');
        showMainApp();
        loadData();
    } catch (error) {
        console.error('登录失败:', error);
    }
}

function logout() {
    currentUser = null;
    authToken = null;
    masterPassword = '';
    passwords = [];
    categories = [];
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    showAuthApp();
    showNotification('已退出登录');
}

// 数据加载
async function loadData() {
    try {
        const [passwordsData, categoriesData] = await Promise.all([
            apiRequest('/passwords'),
            apiRequest('/categories')
        ]);
        
        passwords = passwordsData;
        categories = categoriesData;
        
        renderCategories();
        renderPasswords();
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

// 渲染分类
function renderCategories() {
    const allCategories = [
        { id: 'all', name: '所有密码', color: '#6C757D' },
        ...categories
    ];
    
    categoryList.innerHTML = allCategories.map(category => `
        <div class="category-item ${category.id === currentCategory ? 'active' : ''}" 
             data-category="${category.id}">
            <div class="category-color" style="background-color: ${category.color}"></div>
            <span>${category.name}</span>
        </div>
    `).join('');
    
    // 添加点击事件
    categoryList.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            currentCategory = item.dataset.category;
            renderCategories();
            renderPasswords();
        });
    });
}

// 渲染密码列表
function renderPasswords() {
    let filteredPasswords = passwords;
    
    if (currentCategory !== 'all') {
        filteredPasswords = passwords.filter(p => p.category === currentCategory);
    }
    
    passwordCount.textContent = `(${filteredPasswords.length})`;
    
    const currentCategoryData = categories.find(c => c.id === currentCategory) || 
                               { name: '所有密码' };
    currentCategoryTitle.textContent = currentCategoryData.name;
    
    passwordGrid.innerHTML = filteredPasswords.map(password => `
        <div class="password-card" data-id="${password.id}">
            <div class="password-header">
                <div>
                    <div class="password-title">${password.title}</div>
                    <div class="password-username">${password.username}</div>
                </div>
                <div class="password-actions">
                    <button class="action-btn" onclick="viewPassword('${password.id}')" title="查看">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editPassword('${password.id}')" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deletePassword('${password.id}')" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${password.url ? `<div class="password-field">
                <label>网址:</label>
                <span>${password.url}</span>
            </div>` : ''}
            ${password.notes ? `<div class="password-notes">${password.notes}</div>` : ''}
        </div>
    `).join('');
}

// 密码操作
async function addPassword() {
    const content = `
        <form id="password-form">
            <div class="form-group">
                <label for="password-title">标题 *</label>
                <input type="text" id="password-title" required>
            </div>
            <div class="form-group">
                <label for="password-username">用户名 *</label>
                <input type="text" id="password-username" required>
            </div>
            <div class="form-group">
                <label for="password-password">密码 *</label>
                <div class="password-input">
                    <input type="password" id="password-password" required>
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('password-password')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label for="password-url">网址</label>
                <input type="url" id="password-url">
            </div>
            <div class="form-group">
                <label for="password-category">分类</label>
                <select id="password-category">
                    ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="password-notes">备注</label>
                <textarea id="password-notes" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="master-password">主密码 *</label>
                <div class="password-input">
                    <input type="password" id="master-password" required>
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('master-password')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal()">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
            </div>
        </form>
    `;
    
    showModal('添加密码', content);
    
    document.getElementById('password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('password-title').value,
            username: document.getElementById('password-username').value,
            password: document.getElementById('password-password').value,
            url: document.getElementById('password-url').value,
            category: document.getElementById('password-category').value,
            notes: document.getElementById('password-notes').value,
            masterPassword: document.getElementById('master-password').value
        };
        
        try {
            await apiRequest('/passwords', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            hideModal();
            loadData();
            showNotification('密码添加成功！');
        } catch (error) {
            console.error('添加密码失败:', error);
        }
    });
}

async function viewPassword(id) {
    const password = passwords.find(p => p.id === id);
    if (!password) return;
    
    const content = `
        <form id="view-password-form">
            <div class="form-group">
                <label for="view-master-password">主密码 *</label>
                <div class="password-input">
                    <input type="password" id="view-master-password" required>
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('view-master-password')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal()">取消</button>
                <button type="submit" class="btn btn-primary">查看密码</button>
            </div>
        </form>
    `;
    
    showModal('查看密码', content);
    
    document.getElementById('view-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const data = await apiRequest(`/passwords/${id}/decrypt`, {
                method: 'POST',
                body: JSON.stringify({
                    masterPassword: document.getElementById('view-master-password').value
                })
            });
            
            const content = `
                <div class="password-details">
                    <div class="password-field">
                        <label>标题:</label>
                        <span>${password.title}</span>
                    </div>
                    <div class="password-field">
                        <label>用户名:</label>
                        <span>${password.username}</span>
                    </div>
                    <div class="password-field">
                        <label>密码:</label>
                        <span style="color: #28a745; font-weight: bold;">${data.decryptedPassword}</span>
                    </div>
                    ${password.url ? `<div class="password-field">
                        <label>网址:</label>
                        <span>${password.url}</span>
                    </div>` : ''}
                    ${password.notes ? `<div class="password-field">
                        <label>备注:</label>
                        <span>${password.notes}</span>
                    </div>` : ''}
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="hideModal()">关闭</button>
                </div>
            `;
            
            showModal('密码详情', content);
        } catch (error) {
            console.error('查看密码失败:', error);
        }
    });
}

async function editPassword(id) {
    const password = passwords.find(p => p.id === id);
    if (!password) return;
    
    const content = `
        <form id="edit-password-form">
            <div class="form-group">
                <label for="edit-password-title">标题 *</label>
                <input type="text" id="edit-password-title" value="${password.title}" required>
            </div>
            <div class="form-group">
                <label for="edit-password-username">用户名 *</label>
                <input type="text" id="edit-password-username" value="${password.username}" required>
            </div>
            <div class="form-group">
                <label for="edit-password-password">新密码</label>
                <div class="password-input">
                    <input type="password" id="edit-password-password" placeholder="留空则不修改">
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('edit-password-password')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label for="edit-password-url">网址</label>
                <input type="url" id="edit-password-url" value="${password.url || ''}">
            </div>
            <div class="form-group">
                <label for="edit-password-category">分类</label>
                <select id="edit-password-category">
                    ${categories.map(cat => `<option value="${cat.id}" ${cat.id === password.category ? 'selected' : ''}>${cat.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="edit-password-notes">备注</label>
                <textarea id="edit-password-notes" rows="3">${password.notes || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="edit-master-password">主密码 *</label>
                <div class="password-input">
                    <input type="password" id="edit-master-password" required>
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('edit-master-password')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal()">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
            </div>
        </form>
    `;
    
    showModal('编辑密码', content);
    
    document.getElementById('edit-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('edit-password-title').value,
            username: document.getElementById('edit-password-username').value,
            url: document.getElementById('edit-password-url').value,
            category: document.getElementById('edit-password-category').value,
            notes: document.getElementById('edit-password-notes').value,
            masterPassword: document.getElementById('edit-master-password').value
        };
        
        const newPassword = document.getElementById('edit-password-password').value;
        if (newPassword) {
            formData.password = newPassword;
        }
        
        try {
            await apiRequest(`/passwords/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            
            hideModal();
            loadData();
            showNotification('密码更新成功！');
        } catch (error) {
            console.error('更新密码失败:', error);
        }
    });
}

async function deletePassword(id) {
    if (!confirm('确定要删除这个密码条目吗？')) return;
    
    try {
        await apiRequest(`/passwords/${id}`, {
            method: 'DELETE'
        });
        
        loadData();
        showNotification('密码删除成功！');
    } catch (error) {
        console.error('删除密码失败:', error);
    }
}

// 分类管理
async function addCategory() {
    const content = `
        <form id="category-form">
            <div class="form-group">
                <label for="category-name">分类名称 *</label>
                <input type="text" id="category-name" required>
            </div>
            <div class="form-group">
                <label for="category-color">颜色</label>
                <input type="color" id="category-color" value="#6C757D">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal()">取消</button>
                <button type="submit" class="btn btn-primary">添加</button>
            </div>
        </form>
    `;
    
    showModal('添加分类', content);
    
    document.getElementById('category-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('category-name').value,
            color: document.getElementById('category-color').value
        };
        
        try {
            await apiRequest('/categories', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            hideModal();
            loadData();
            showNotification('分类添加成功！');
        } catch (error) {
            console.error('添加分类失败:', error);
        }
    });
}

// 设置功能
async function showSettings() {
    const content = `
        <form id="settings-form">
            <div class="form-group">
                <label for="current-password">当前主密码 *</label>
                <div class="password-input">
                    <input type="password" id="current-password" required>
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('current-password')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label for="new-password">新主密码 *</label>
                <div class="password-input">
                    <input type="password" id="new-password" required>
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('new-password')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label for="confirm-new-password">确认新主密码 *</label>
                <div class="password-input">
                    <input type="password" id="confirm-new-password" required>
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('confirm-new-password')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal()">取消</button>
                <button type="submit" class="btn btn-primary">修改密码</button>
            </div>
        </form>
    `;
    
    showModal('修改主密码', content);
    
    document.getElementById('settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-new-password').value;
        
        if (newPassword !== confirmPassword) {
            showNotification('新密码和确认密码不匹配', 'error');
            return;
        }
        
        try {
            await apiRequest('/change-master-password', {
                method: 'PUT',
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });
            
            hideModal();
            showNotification('主密码修改成功！');
        } catch (error) {
            console.error('修改主密码失败:', error);
        }
    });
}

// 二维码分享
async function showQRCode() {
    try {
        const data = await apiRequest('/qr-code');
        
        const content = `
            <div style="text-align: center;">
                <p>扫描二维码访问密码管理器</p>
                <img src="${data.qrCodeDataURL}" alt="二维码" style="max-width: 200px; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">${data.appUrl}</p>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal()">关闭</button>
            </div>
        `;
        
        showModal('分享应用', content);
    } catch (error) {
        console.error('生成二维码失败:', error);
    }
}

// 界面切换
function showAuthApp() {
    authContainer.classList.remove('hidden');
    mainContainer.classList.add('hidden');
}

function showMainApp() {
    authContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');
}

function switchTab(tabName) {
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已登录
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showMainApp();
        loadData();
    }
    
    // 标签切换
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
    
    // 登录表单
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        login(username, password);
    });
    
    // 注册表单
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
            showNotification('密码和确认密码不匹配', 'error');
            return;
        }
        
        register(username, password);
    });
    
    // 主应用按钮
    document.getElementById('add-password-btn').addEventListener('click', addPassword);
    document.getElementById('add-category-btn').addEventListener('click', addCategory);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    document.getElementById('qr-code-btn').addEventListener('click', showQRCode);
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // 模态框关闭
    document.querySelector('.modal-close').addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });
    
    // 通知关闭
    document.querySelector('.notification-close').addEventListener('click', hideNotification);
    
    // 密码显示切换
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
});

// 全局函数
window.togglePasswordVisibility = togglePasswordVisibility;
window.viewPassword = viewPassword;
window.editPassword = editPassword;
window.deletePassword = deletePassword; 