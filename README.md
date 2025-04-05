# 备忘录应用

一个基于Vue3和uni-app开发的跨平台备忘录应用，支持多端运行（iOS、Android、H5等）。

## 功能特性

- 📝 备忘录的增删改查
- 🔍 支持按标题搜索
- 📱 支持下拉刷新和上拉加载更多
- 🔄 支持按创建时间排序
- 👤 用户认证（登录、注册、退出）
- 🎨 美观的UI界面
- 🌐 支持多端运行

## 技术栈

- Vue 3
- uni-app
- Axios
- Vuex
- SCSS

## 项目结构

```
src/
├── api/                # API接口
│   ├── auth.js        # 用户认证相关接口
│   ├── index.js       # 备忘录相关接口
│   └── request.js     # Axios配置和拦截器
├── components/        # 公共组件
├── pages/            # 页面
│   ├── login/        # 登录页
│   ├── register/     # 注册页
│   ├── memo/         # 备忘录列表页
│   ├── memo-detail/  # 备忘录详情页
│   └── memo-add/     # 备忘录编辑页
├── static/           # 静态资源
├── store/            # Vuex状态管理
└── utils/            # 工具函数
```

## 安装说明

1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
npm install
```

3. 运行项目
```bash
# 运行到H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到App
npm run dev:app
```

## 使用说明

1. 首次使用需要注册账号
2. 登录后可以开始使用备忘录功能
3. 支持以下操作：
   - 创建新备忘录
   - 查看备忘录列表
   - 编辑现有备忘录
   - 删除备忘录
   - 批量删除备忘录
   - 搜索备忘录

## API接口

基础地址：`https://twicfngkiiwb.sealosbja.site/api/v1`

### 用户认证
- POST /auth/login - 用户登录
- POST /auth/register - 用户注册
- GET /auth/user-info - 获取用户信息
- POST /auth/logout - 退出登录

### 备忘录
- GET /memos - 获取备忘录列表
- GET /memos/:id - 获取备忘录详情
- POST /memos - 创建备忘录
- PUT /memos/:id - 更新备忘录
- DELETE /memos/:id - 删除备忘录
- POST /memos/batch-delete - 批量删除备忘录

## 开发团队

- 开发者：[您的名字]

## 许可证

MIT License 