---
id: pnpm-setup-guide
date: 2026-03-22
authors: stilman
tags: [pnpm, 开发环境, 工具链]
keywords: [pnpm, npm, 包管理器, Node.js]
draft: false
---

# pnpm 包管理器安装指南

本文档记录在 Windows 11 和 Ubuntu 22.04 系统上安装 pnpm 的完整流程。

<!-- truncate -->

## 什么是 pnpm

pnpm（Performant npm）是一个快速、节省空间的 npm 替代品。它采用**硬链接**和**符号链接**的方式管理依赖，避免了 npm 和 yarn 的重复下载问题。

### pnpm 的优势

| 特性 | npm | yarn | pnpm |
|------|-----|------|------|
| 依赖安装速度 | 慢 | 中等 | 快 |
| 磁盘空间占用 | 大 | 中等 | 小 |
| node_modules 结构 | 扁平化 | 扁平化 | 隔离式 |
| monorepo 支持 | 一般 | 良好 | 优秀 |

## Windows 11 安装步骤

### 方法一：使用 winget（推荐）

```powershell
winget install pnpm.pnpm
```

安装完成后，重启终端即可使用。

### 方法二：使用 npm 安装

```powershell
npm install -g pnpm
```

### 方法三：使用 PowerShell 脚本

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 验证安装

```powershell
pnpm --version
```

## Ubuntu 22.04 安装步骤

### 方法一：使用 corepack（推荐，Node.js 18+）

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 方法二：使用 npm 安装

```bash
npm install -g pnpm
```

### 方法三：使用安装脚本

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 方法四：手动安装

如果以上方法都失败，可以手动添加到 PATH：

```bash
# 1. 创建软链接到用户目录
mkdir -p ~/.local/bin
ln -s ~/.npm/_npx/.../pnpm ~/.local/bin/pnpm

# 2. 或者直接下载二进制文件
curl -fsSL https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linux-x64 -o ~/.local/bin/pnpm
chmod +x ~/.local/bin/pnpm
```

### 验证安装

```bash
pnpm --version
```

### 常见问题：pnpm: command not found

如果终端提示找不到 pnpm，需要将 pnpm 路径添加到 PATH：

```bash
# 临时生效（当前终端）
export PATH="$HOME/.local/bin:$PATH"

# 永久生效
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## 在项目中使用 pnpm

### 初始化新项目

```bash
pnpm init
```

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 添加依赖
pnpm add <package-name>
pnpm add -D <package-name>  # devDependencies

# 移除依赖
pnpm remove <package-name>
```

### 运行脚本

```bash
pnpm <script-name>
```

### 常用命令对比

| npm | pnpm | 说明 |
|-----|------|------|
| `npm install` | `pnpm install` | 安装依赖 |
| `npm install <pkg>` | `pnpm add <pkg>` | 添加依赖 |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` | 移除依赖 |
| `npm update` | `pnpm update` | 更新依赖 |
| `npm run <script>` | `pnpm <script>` | 运行脚本 |

## 项目迁移指南

### 从 npm 迁移

```bash
# 1. 删除旧的 lock 文件
rm package-lock.json

# 2. 使用 pnpm 安装
pnpm install

# 3. pnpm 会自动生成 pnpm-lock.yaml
```

### 从 yarn 迁移

```bash
# 1. 删除旧的 lock 文件
rm yarn.lock

# 2. 使用 pnpm 安装
pnpm install
```

## pnpm 配置文件

在项目根目录创建 `.npmrc` 文件进行配置：

```ini
# 启用提升（解决某些包的 peerDependencies 问题）
shamefully-hoist=true

# 设置严格的 peerDependencies 检查
# strict-peer-dependencies=false

# 自动安装 peerDependencies
# auto-install-peers=true
```

## 常见问题

### 1. permission denied 权限错误

```bash
# 设置正确的 npm 缓存目录权限
sudo chown -R $(whoami) ~/.npm
```

### 2. EACCES 错误

如果遇到权限问题，可以使用 npm 的配置来设置全局目录：

```bash
# 创建全局目录
mkdir ~/.npm-global

# 配置 npm 使用这个目录
npm config set prefix '~/.npm-global'

# 添加到 PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 3. 网络超时

如果下载速度慢，可以更换镜像源：

```bash
# 设置淘宝镜像
pnpm config set registry https://registry.npmmirror.com
```

## 相关资源

- [pnpm 官网](https://pnpm.io/zh/)
- [pnpm GitHub 仓库](https://github.com/pnpm/pnpm)
- [pnpm 文档](https://pnpm.io/zh/motivation)
