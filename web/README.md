# 古诗文起名系统 - 国际化版本

基于中华古典文学的智能起名系统，支持中英文双语界面。

## 🌟 新功能特性

### 🗣️ 国际化支持
- **三种语言模式**：
  - 🇨🇳 中文模式：纯中文界面
  - 🇺🇸 英文模式：纯英文界面  
  - 🌐 双语模式：中英文对照显示

- **语言切换**：右上角语言切换按钮，支持实时切换
- **统一排版**：中英文并行展示，保持一致的视觉风格

### 🎨 界面优化
- **双语标题**：所有页面标题都采用"中文 / English"格式
- **双语按钮**：操作按钮支持多语言显示
- **双语描述**：筛选、排序、视图切换等所有功能都有中英文说明

### 📱 用户体验
- **响应式设计**：支持移动端和桌面端
- **平滑动画**：悬停效果和过渡动画
- **直观操作**：清晰的语言切换和功能说明

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
npm start
```

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 15.5.0** - App Router架构
- **React 19.1.0** - 最新版本
- **TypeScript** - 类型安全
- **Tailwind CSS 4** - 现代化UI设计

### 国际化实现
- **i18n配置**：`src/lib/i18n.ts` - 集中管理所有文本
- **语言切换组件**：`src/components/LanguageSwitcher.tsx`
- **多语言支持**：所有组件都支持language属性

### 核心组件
- **LanguageSwitcher**：语言切换器，固定在右上角
- **NameCard**：名字详情卡片，支持多语言
- **SummaryCard**：名字摘要卡片，支持多语言

## 📁 项目结构

```
web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # 主页面（已国际化）
│   │   └── api/            # API路由
│   ├── components/          # React组件
│   │   ├── LanguageSwitcher.tsx  # 语言切换器
│   │   ├── NameCard.tsx          # 名字详情卡片
│   │   └── SummaryCard.tsx       # 名字摘要卡片
│   └── lib/                # 工具库
│       └── i18n.ts         # 国际化配置
└── README.md               # 项目说明
```

## 🌍 国际化配置

### 文本结构
```typescript
export interface I18nTexts {
  pageTitle: { zh: string; en: string; };
  subtitle: { zh: string; en: string; };
  buttons: {
    generate: { zh: string; en: string; };
    // ... 更多按钮文本
  };
  // ... 更多分类
}
```

### 使用方法
```typescript
import { getText, i18nTexts } from '@/lib/i18n';

// 获取当前语言的文本
const title = getText(i18nTexts.pageTitle, currentLanguage);

// 支持三种模式：
// 'zh' -> 只显示中文
// 'en' -> 只显示英文  
// 'bilingual' -> 中英文对照
```

## 🎯 功能特性

### 智能起名
- 基于姓氏和关键词生成候选名字
- 支持单字名和双字名
- 可选择性过滤来源（诗经、楚辞、唐诗、宋词等）

### 内容展示
- **网格视图**：快速浏览多个名字
- **详情视图**：深入了解单个名字
- **收藏功能**：保存喜欢的名字
- **分享功能**：分享名字卡片

### 数据源
- **诗经**：自然质朴的名字风格
- **楚辞**：华美香醇的名字风格
- **唐诗**：大气开阔的名字风格
- **宋词**：温婉雅致的名字风格

## 🔧 开发说明

### 添加新文本
1. 在`src/lib/i18n.ts`中添加新的文本配置
2. 使用`getText()`函数获取多语言文本
3. 在组件中传递`language`属性

### 样式规范
- 使用Tailwind CSS类名
- 保持中英文文本长度平衡
- 响应式设计，支持各种屏幕尺寸

### 性能优化
- 使用React.memo优化组件渲染
- 语言切换时避免不必要的重渲染
- 支持SSR/SSG，提升首屏加载速度

## 📝 更新日志

### v1.1.0 - 国际化版本
- ✅ 新增语言切换功能（中文/英文/双语）
- ✅ 全站中英文对照支持
- ✅ 优化用户界面和交互体验
- ✅ 修复TypeScript类型错误
- ✅ 完善ESLint配置

### v1.0.0 - 基础版本
- ✅ 智能起名算法
- ✅ 多数据源支持
- ✅ 名字卡片展示
- ✅ 响应式设计

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License - 详见LICENSE文件

## 🙏 致谢

感谢中华古典文学为这个项目提供了丰富的文化内涵和诗意灵感。
