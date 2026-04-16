# DTCI 项目

基于墨刀原型开发的DTCI健康管理平台，包含小程序端用户端和PC管理后台。

## 项目结构

```
DTCI/
├── mini-program/     # 小程序端（用户端）
│   ├── pages/         # 页面
│   │   ├── login/     # 登录注册
│   │   ├── home/      # 首页
│   │   ├── detail/    # 服务详情
│   │   ├── feedback/  # 意见反馈
│   │   ├── about/     # 关于我们
│   │   ├── agreement/ # 服务协议
│   │   └── privacy/   # 隐私政策
│   ├── components/    # 组件
│   ├── styles/        # 样式
│   └── utils/         # 工具函数
│
└── admin/            # PC管理后台
    └── src/
        ├── pages/     # 页面
        │   ├── dashboard/         # 仪表盘
        │   ├── users/              # 用户管理
        │   ├── assessment/         # 测评管理
        │   ├── feedback/           # 反馈管理
        │   ├── finance/            # 财务管理
        │   ├── content/            # 内容管理
        │   └── settings/           # 系统设置
        ├── components/             # 组件
        └── styles/                 # 样式
```

## 功能模块

### 小程序端

1. **登录注册**
   - 微信授权登录
   - 用户协议勾选

2. **首页**
   - 搜索栏
   - 轮播图
   - 服务分类
   - 热门服务
   - 快捷入口

3. **服务详情**
   - 服务信息展示
   - 预约功能
   - 收藏/分享

4. **意见反馈**
   - 反馈类型选择
   - 问题描述
   - 图片上传
   - 历史反馈查看

5. **关于我们**
   - 公司介绍
   - 联系方式
   - 关注公众号

6. **服务协议 & 隐私政策**

### PC管理后台

1. **仪表盘**
   - 数据统计卡片
   - 预约概览
   - 最近订单

2. **用户管理**
   - 用户列表
   - 分销员列表
   - 用户详情查看

3. **测评管理**
   - 测评列表
   - 用户测评
   - 测评报告
   - 问卷管理
   - 题库管理

4. **反馈管理**
   - 反馈列表
   - 回复功能

5. **财务管理**
   - 佣金明细
   - 提现列表

6. **内容管理**
   - 轮播图管理
   - 案例管理
   - 服务管理

7. **系统设置**
   - 系统用户
   - 首页设置
   - 关于我们
   - 服务协议
   - 隐私政策

## 技术栈

### 小程序端
- 微信小程序
- WXML + WXSS + JS

### PC管理后台
- React 18
- React Router 6
- Ant Design 5
- Vite

## 快速开始

### 小程序端

1. 导入 `mini-program` 目录到微信开发者工具
2. 修改 `app.json` 中的页面配置
3. 配置并启动

### PC管理后台

```bash
cd admin
npm install
npm run dev
```

访问 http://localhost:8080

默认登录账号：
- 用户名：admin
- 密码：admin

## 原型链接

- 小程序端原型：https://modao.cc/proto/JIreaoE6sunte26u5g5hyB
- PC管理端原型：https://modao.cc/proto/FsxDsCKzsv5ch4OumFOHe
