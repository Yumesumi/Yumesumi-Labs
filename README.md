# 梦澄实验室 · Yumesumi Labs

收集奇思妙想，也认真把其中一些做成可以拿在手里的小玩意。

这是 Yumesumi Labs 的纯静态站点。视觉体系沿用 [Yumesumi Center](https://yumesumi.cyou/)：深紫夜色、MiSans、固定环境层、四芒星粒子与缓慢的极光。

## 页面

- `index.html` — 实验室首页：介绍、已发布作品、孵化中的想法与关于
- `projects/honest-scale.html` — 作品详情：心里那杆秤（Honest Scale）

## 作品

### 心里那杆秤 · Honest Scale

把包装规格一键换算成「每克 / 每毫升多少钱」的 Android 小工具。

- 源码：https://github.com/Yumesumi/Honest-Scale
- 平台：Android 10（API 29）及以上
- 技术：Kotlin · Jetpack Compose · Material 3

页面中的手机界面为依据实际功能绘制的示意，不是实机截图。

## 本地预览

```bash
python -m http.server 4173
```

访问 http://localhost:4173/

## 技术说明

- 纯 HTML / CSS / JavaScript，无构建步骤
- 共享样式：`assets/css/site.css`
- 星空、导航与首屏扫光：`assets/js/site.js`
- 品牌字体与 Logo 复用自主站；实验室配图与分享图由主站素材裁切生成
- 支持 `prefers-reduced-motion`，移动端提供全屏导航

## 部署

仓库根目录即为站点根，GitHub Pages 从 `main` 分支根目录发布：

https://yumesumi.github.io/Yumesumi-Labs/
