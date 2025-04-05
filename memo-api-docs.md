# 备忘录应用接口文档

## 基础信息

- API根地址: `https://kqhsdclnqvle.sealosbja.site`
- 基础URL: `/api/v1`
- 完整API前缀: `https://kqhsdclnqvle.sealosbja.site/api/v1`
- 数据格式: JSON
- 认证方式: Bearer Token (除登录和注册接口外，所有接口需要在请求头中携带 `Authorization: Bearer {token}`)

## 错误码说明

- 0: 成功
- 40001: 参数错误
- 40100: 未授权
- 40400: 资源不存在
- 50000: 服务器内部错误

## 用户认证接口

### 1. 用户登录

**请求**
- 方法: `POST`
- URL: `/api/v1/auth/login`
- 请求体:
```json
{
  "username": "用户名",
  "password": "密码"
}
```

**成功响应** (状态码: 200)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

**失败响应 - 参数错误** (状态码: 400)
```json
{
  "code": 40001,
  "message": "用户名或密码不能为空",
  "data": null
}
```

**失败响应 - 认证失败** (状态码: 401)
```json
{
  "code": 40100,
  "message": "用户名或密码错误",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

### 2. 用户注册

**请求**
- 方法: `POST`
- URL: `/api/v1/auth/register`
- 请求体:
```json
{
  "username": "用户名",
  "password": "密码"
}
```

**成功响应** (状态码: 201)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "5f8a4d8c7d3e2a1b3c4d5e6f",
    "username": "用户名",
    "created_at": "2023-08-01T12:00:00Z"
  }
}
```

**失败响应 - 参数错误** (状态码: 400)
```json
{
  "code": 40001,
  "message": "用户名或密码不能为空",
  "data": null
}
```

**失败响应 - 用户名已存在** (状态码: 400)
```json
{
  "code": 40001,
  "message": "用户名已存在",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

### 3. 获取用户信息

**请求**
- 方法: `GET`
- URL: `/api/v1/auth/user-info`
- 请求头:
  - `Authorization: Bearer {token}`

**成功响应** (状态码: 200)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "5f8a4d8c7d3e2a1b3c4d5e6f",
    "username": "用户名",
    "created_at": "2023-08-01T12:00:00Z",
    "updated_at": "2023-08-01T12:00:00Z"
  }
}
```

**失败响应 - 未授权** (状态码: 401)
```json
{
  "code": 40100,
  "message": "未授权",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

### 4. 退出登录

**请求**
- 方法: `POST`
- URL: `/api/v1/auth/logout`
- 请求头:
  - `Authorization: Bearer {token}`

**成功响应** (状态码: 200)
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**失败响应 - 未授权** (状态码: 401)
```json
{
  "code": 40100,
  "message": "未授权",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

## 备忘录接口

### 1. 获取备忘录列表

**请求**
- 方法: `GET`
- URL: `/api/v1/memos`
- 请求头:
  - `Authorization: Bearer {token}`
- 参数:
  - `page`: 页码，默认1
  - `limit`: 每页数量，默认20
  - `sort`: 排序方式，可选值: `created_desc`(默认), `created_asc`, `updated_desc`, `updated_asc`

**成功响应** (状态码: 200)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "memos": [
      {
        "id": "5f8a4d8c7d3e2a1b3c4d5e6f",
        "title": "备忘录标题",
        "content": "备忘录内容",
        "created_at": "2023-08-01T12:00:00Z",
        "updated_at": "2023-08-01T12:00:00Z"
      }
    ]
  }
}
```

**失败响应 - 未授权** (状态码: 401)
```json
{
  "code": 40100,
  "message": "未授权",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

### 2. 获取备忘录详情

**请求**
- 方法: `GET`
- URL: `/api/v1/memos/:id`
- 请求头:
  - `Authorization: Bearer {token}`
- 路径参数:
  - `id`: 备忘录ID

**成功响应** (状态码: 200)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "5f8a4d8c7d3e2a1b3c4d5e6f",
    "title": "备忘录标题",
    "content": "备忘录内容",
    "created_at": "2023-08-01T12:00:00Z",
    "updated_at": "2023-08-01T12:00:00Z"
  }
}
```

**失败响应 - 未授权** (状态码: 401)
```json
{
  "code": 40100,
  "message": "未授权",
  "data": null
}
```

**失败响应 - 备忘录不存在** (状态码: 404)
```json
{
  "code": 40400,
  "message": "备忘录不存在",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

### 3. 创建备忘录

**请求**
- 方法: `POST`
- URL: `/api/v1/memos`
- 请求头:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
- 请求体:
```json
{
  "title": "备忘录标题",
  "content": "备忘录内容"
}
```

**成功响应** (状态码: 201)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "5f8a4d8c7d3e2a1b3c4d5e6f",
    "title": "备忘录标题",
    "content": "备忘录内容",
    "created_at": "2023-08-01T12:00:00Z",
    "updated_at": "2023-08-01T12:00:00Z"
  }
}
```

**失败响应 - 未授权** (状态码: 401)
```json
{
  "code": 40100,
  "message": "未授权",
  "data": null
}
```

**失败响应 - 参数错误** (状态码: 400)
```json
{
  "code": 40001,
  "message": "标题和内容不能为空",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

### 4. 更新备忘录

**请求**
- 方法: `PUT`
- URL: `/api/v1/memos/:id`
- 请求头:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
- 路径参数:
  - `id`: 备忘录ID
- 请求体:
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

**成功响应** (状态码: 200)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "5f8a4d8c7d3e2a1b3c4d5e6f",
    "title": "更新后的标题",
    "content": "更新后的内容",
    "created_at": "2023-08-01T12:00:00Z",
    "updated_at": "2023-08-01T12:30:00Z"
  }
}
```

**失败响应 - 未授权** (状态码: 401)
```json
{
  "code": 40100,
  "message": "未授权",
  "data": null
}
```

**失败响应 - 参数错误** (状态码: 400)
```json
{
  "code": 40001,
  "message": "更新内容不能为空",
  "data": null
}
```

**失败响应 - 备忘录不存在** (状态码: 404)
```json
{
  "code": 40400,
  "message": "备忘录不存在",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

### 5. 删除备忘录

**请求**
- 方法: `DELETE`
- URL: `/api/v1/memos/:id`
- 请求头:
  - `Authorization: Bearer {token}`
- 路径参数:
  - `id`: 备忘录ID

**成功响应** (状态码: 200)
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**失败响应 - 未授权** (状态码: 401)
```json
{
  "code": 40100,
  "message": "未授权",
  "data": null
}
```

**失败响应 - 备忘录不存在** (状态码: 404)
```json
{
  "code": 40400,
  "message": "备忘录不存在",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

### 6. 批量删除备忘录

**请求**
- 方法: `POST`
- URL: `/api/v1/memos/batch-delete`
- 请求头:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
- 请求体:
```json
{
  "ids": ["5f8a4d8c7d3e2a1b3c4d5e6f", "5f8a4d8c7d3e2a1b3c4d5e70", "5f8a4d8c7d3e2a1b3c4d5e71"]
}
```

**成功响应** (状态码: 200)
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**失败响应 - 未授权** (状态码: 401)
```json
{
  "code": 40100,
  "message": "未授权",
  "data": null
}
```

**失败响应 - 参数错误** (状态码: 400)
```json
{
  "code": 40001,
  "message": "参数错误",
  "data": null
}
```

**失败响应 - 服务器错误** (状态码: 500)
```json
{
  "code": 50000,
  "message": "错误信息",
  "data": null
}
```

## 接口调用示例

### 前端调用示例（使用Fetch API）

```javascript
// API根地址
const API_BASE_URL = 'https://kqhsdclnqvle.sealosbja.site/api/v1';

// 用户登录
async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('登录失败:', error);
  }
}

// 用户注册
async function register(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('注册失败:', error);
  }
}

// 获取用户信息
async function getUserInfo(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user-info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
}

// 退出登录
async function logout(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('退出登录失败:', error);
  }
}

// 获取备忘录列表
async function getMemos(token, page = 1, limit = 20, sort = 'created_desc') {
  try {
    const response = await fetch(`${API_BASE_URL}/memos?page=${page}&limit=${limit}&sort=${sort}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取备忘录列表失败:', error);
  }
}

// 获取备忘录详情
async function getMemo(token, id) {
  try {
    const response = await fetch(`${API_BASE_URL}/memos/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取备忘录详情失败:', error);
  }
}

// 创建备忘录
async function createMemo(token, title, content) {
  try {
    const response = await fetch(`${API_BASE_URL}/memos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('创建备忘录失败:', error);
  }
}

// 更新备忘录
async function updateMemo(token, id, title, content) {
  try {
    const response = await fetch(`${API_BASE_URL}/memos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('更新备忘录失败:', error);
  }
}

// 删除备忘录
async function deleteMemo(token, id) {
  try {
    const response = await fetch(`${API_BASE_URL}/memos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('删除备忘录失败:', error);
  }
}

// 批量删除备忘录
async function batchDeleteMemos(token, ids) {
  try {
    const response = await fetch(`${API_BASE_URL}/memos/batch-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('批量删除备忘录失败:', error);
  }
}
``` 