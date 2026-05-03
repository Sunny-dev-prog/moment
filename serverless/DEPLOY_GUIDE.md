# 腾讯云云函数部署指南

## 概述

本项目使用腾讯云云函数作为后端代理，保护 DeepSeek API Key 不暴露给前端。

## 部署步骤

### 1. 创建云函数

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入「云函数 SCF」
3. 点击「新建」
4. 选择「从头开始」
5. 配置：
   - 函数名称：`scenic-journeys-deepseek-proxy`
   - 运行环境：`Node.js 16.13`
   - 创建方式：空白函数

### 2. 上传代码

1. 进入函数详情页
2. 点击「函数代码」标签
3. 选择「方法二：在线编辑」
4. 将 `index.js` 的内容粘贴进去
5. 点击「保存」

### 3. 配置环境变量

1. 进入「函数管理」→「函数配置」
2. 点击「编辑」
3. 添加环境变量：
   - `DEEPSEEK_API_URL` = `https://api.deepseek.com/v1/chat/completions`
   - `DEEPSEEK_API_KEY` = `你的DeepSeek API Key`

### 4. 配置触发器

1. 进入「函数管理」→「触发器管理」
2. 点击「添加触发器」
3. 配置：
   - 触发方式：API网关
   - 认证方式：免认证
   - 启用集成响应：否
4. 点击「保存」

### 5. 获取访问地址

1. 创建触发器后，点击触发器名称进入 API网关控制台
2. 复制「访问地址」，格式类似：
   ```
   https://service-xxxxx-xxxx.gz.apigw.tencentcs.com/release/函数名
   ```

### 6. 更新前端配置

1. 复制 API网关访问地址
2. 编辑 `src/lib/deepseekApi.ts`，修改 `DEEPSEEK_API_URL`：
   ```typescript
   const DEEPSEEK_API_URL = "你的云函数访问地址";
   ```
3. 或者创建 `.env` 文件：
   ```
   VITE_API_URL=你的云函数访问地址
   ```
4. 重新构建项目

## 安全建议

1. **启用 API 网关鉴权**（可选但推荐）：
   - 在 API网关控制台启用 Key 认证
   - 前端调用时携带认证信息

2. **配置 IP 白名单**（可选）：
   - 在云函数配置中限制访问 IP
   - 只允许你的网站域名或指定 IP 访问

3. **设置 QPS 限制**：
   - 在 API网关配置中限制请求频率
   - 防止 API 被滥用

## 本地开发

本地开发时仍可使用 Vite 代理，无需配置云函数：

```bash
# 创建 .env 文件
cp .env.example .env
# 编辑 .env 填入你的 API Key

# 启动开发服务器
npm run dev
```

## 费用说明

- 腾讯云云函数：每月前 40 万 GB-秒免费
- API 网关：每月前 500 万次调用免费

对于个人项目或小流量应用，基本不会产生费用。

## 常见问题

### Q: 云函数调用失败怎么办？
A: 检查以下几点：
1. 环境变量是否正确配置了 API Key
2. 云函数是否正常运行（查看日志）
3. API网关触发器是否正确创建

### Q: 如何查看云函数日志？
A: 在云函数控制台，点击「日志」标签查看。
