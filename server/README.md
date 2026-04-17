# DTCI Backend Server

基于 NestJS 和 Prisma 构建的 DTCI 健康管理平台后端服务。

## 🛠️ 技术栈
- **框架**: NestJS (v11+)
- **ORM**: Prisma
- **数据库**: SQLite (./prisma/dev.db)
- **安全**: bcryptjs (密码哈希)

## 📁 核心模块
- **Auth**: 处理微信小程序登录及授权。
- **Users**: 管理终端用户信息，支持多维度过滤搜索。
- **Admins**: 系统管理员管理，支持真实账号校验与权限分级。

## 🚀 快速开始

### 1. 环境准备
确保已安装 Node.js (建议 v18+)。

### 2. 安装依赖
```bash
npm install
```

### 3. 初始化数据库
本项使用 SQLite，无需安装额外数据库软件。执行以下命令同步模型：
```bash
npx prisma db push
```

### 4. 启动服务
```bash
# 开发模式 (含热更新)
npm run start:dev

# 生产模式
npm run start:prod
```
服务默认运行在 http://localhost:3100。

## 🔑 预设账号
初次启动并同步数据库后，系统会自动创建初始管理员：
- **用户名**: `admin`
- **密码**: `admin123`

## 📡 主要 API 端点
- `POST /admins/login` - 管理员登录
- `GET /admins` - 管理员列表
- `GET /users` - 终端用户列表 (语义化搜索)
- `PATCH /users/:id` - 更新用户信息
- `POST /auth/login` - 小程序微信登录

---
*NestJS 官方文档请参考 [docs.nestjs.com](https://docs.nestjs.com)。*
