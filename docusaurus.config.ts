import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Docs', // 标题
  tagline: 'Dinosaurs are cool', // 副标题
  favicon: 'img/favicon.ico', // 站点图标

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // 域名
  url: 'https://systemcaller.online',
  // 统一前缀,和部署的路径一致,即部署后的文件都放到服务器的 .../域名/docs/目录下
  baseUrl: '/docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'systemcaller', // Usually your GitHub org/user name.
  projectName: 'wordpress-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // 国际化
  i18n: {
    defaultLocale: 'zh-Hans', // 默认语言设为简体中文
    locales: ['zh-Hans', 'en'], // 支持的语言列表：中文、英文
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
      },
      en: {
        label: 'English',
      },
    },
  },
  presets: [
    [
      'classic',
      {
        // ========== 默认 文档 ==========
        docs: {
          sidebarPath: './sidebars.ts',
          // 因为站点的路径已经有docs了, 为了避免地址出现重复,这个把他改为 / , 默认不加会出现docs/docs这样的访问路径
          routeBasePath: '/',
          // 编辑按钮和地址,效果是每篇文档最后面都有一个编辑按钮
          // editUrl: 
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  // 其他文档配置
  plugins: [
    // ========== Java 文档 ==========
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'java',
        path: 'docs-java',
        routeBasePath: 'java',
        sidebarPath: './sidebars-java.ts',
        // editUrl: 'https://github.com/your-repo/edit/main/',
        versions: {
          current: {
            label: 'V 3.0-SNAPSHOT', // 正在开发的版本
            path: 'next',
            banner: 'none',
          },
          '2.0': {
            label: 'V 2.0 (Current)', // 稳定版
            banner: 'none',
          },
          '1.0': {
            label: 'V 1.0 (GA)', // 老版本
            banner: 'unmaintained',
          },
        }
      },
    ],

    // ========== Python 文档 ==========
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'python',// 给它一个唯一的 ID
        path: 'docs-python',// 文件夹名字
        routeBasePath: 'python', // 访问路径：域名/python/...
        sidebarPath: './sidebars-python.ts',// 侧边栏配置文件路径
        // context: true, // 如果你想在版本控制中包含它
      },
    ],
  ],



  // 全文搜索插件,build后才生效
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // 你的文档路径哈希化，通常设为 true
        hashed: true,
        // 语言支持：支持中文和英文
        language: ["en", "zh"],
        // 侧边栏高亮
        highlightSearchTermsOnTargetPage: true,
        // 搜索框位置：设为 right 让它出现在右上角
        searchBarPosition: "right",
        // 👇👇👇 核心修改：添加这行配置 👇👇👇
        // 告诉插件，这些路径下的页面都是文档，都要建索引
        // 对应你 plugins 和 presets 里配置的 routeBasePath
        docsRouteBasePath: ['/', 'java', 'python'],

        // 博客路径（默认就是 /blog，写上更保险）
        blogRouteBasePath: '/blog',
      }),
    ],
  ],

  // ========== 导航配置 ==========
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true, // 开启侧边栏可隐藏功能
        autoCollapseCategories: true, // (可选) 自动折叠其他分类，保持侧边栏整洁
      },
    },
    // 导航栏配置
    navbar: {
      title: 'Systemcaller Docs',
      logo: {
        alt: 'Systemcaller Logo',
        src: '/img/logo.jpg', // logo图片
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
          // 这里的 docsPluginId 必须留空，因为它是默认实例
          // label: 'Tutorial',
        },
        // ========== dropdown菜单下配置子菜单 ==========
        {
          type: 'dropdown',              // 关键：类型为 dropdown,下拉框
          label: '教程',                 // 主菜单显示文字
          position: 'left',
          items: [
            {
              label: 'Java 教程',
              // to: '/java/intro',
              to: '/java/versions',//连接到一/src/page/java/versions.tsx页面
            },
            {
              label: 'Python 教程',
              to: '/python/intro',
            },
          ]
        },
        // Java 的版本控制器 (加了 className 控制显示与否)
        {
          type: 'docsVersionDropdown',
          position: 'right',
          docsPluginId: 'java',
          className: 'navbar-version-java', // 关键：加上这个类名
        },
        // Python 的版本控制器 (加了 className)
        {
          type: 'docsVersionDropdown',
          position: 'right',
          docsPluginId: 'python',
          className: 'navbar-version-python', // 关键：加上这个类名
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        // ========== 搜索框,不写会默认跑到最右边不好看 ==========
        {
          type: 'search',  // 指定类型为搜索框
          position: 'right', // 放在右侧
        },
        {
          href: 'https://github.com/systemcaller',
          label: 'GitHub',
          position: 'right',
        },
        // 语言切换下拉菜单（自动出现在右上角）
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/intro',
            },
          ],
        },
        {
          title: '友情链接',
          items: [
            {
              label: 'nobody',
              href: '#',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'https://systemcaller.online',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Systemcaller, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
