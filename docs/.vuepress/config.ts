const path = require('path');
const localesConfig = {
  '/': {
    lang: 'en-US',
    selectLanguageText: 'English',
    title: 'Brav Smart Device Lib',
    description: 'English',
  },
  '/zh/': {
    lang: 'zh-CN',
    title: '智能设备SDK',
    selectLanguageText: '简体中文',
  },
};

const themeConfig = {
  locales: {
    '/': {
      selectLanguageName: 'English',
      sidebar: {
        '/': [
          {
            text: 'Guide',
            link: '/',
          },
          {
            text: 'Installation',
            link: '/install.md',
            children: [
              {
                text: '安卓',
                link: '/install.md#android',
              },
              {
                text: 'iOS',
                link: '/install.md#ios',
              },
            ],
          },
          {
            text: 'Quick start',
            link: '/quick_start.md',
            children: [
              {
                text: 'Initial',
                link: '/quick_start.md#initial',
              },
              {
                text: 'Prepared',
                link: '/quick_start.md##preliminary-work',
              },
              {
                text: 'Scan device',
                link: '/quick_start.md#scan-device',
              },
              {
                text: 'Connect device',
                link: '/quick_start.md#connect-device',
              },
              {
                text: 'Measurement interface logic processing',
                link: '/quick_start.md#measurement-interface-logic-processing',
              },
              {
                text: 'Show measurement report',
                link: '/quick_start.md#show-measurement-report',
              },
            ],
          },
        ],
      },
      navbar: [
        {
          text: 'Guide',
          link: '/',
        },
        {
          text: 'API',
          link: '/api.md',
        },
        {
          text: 'FAQ',
          link: '/faq.md',
        },
        {
          text: 'Change Log',
          link: 'https://www.github.com',
        },
      ],
    },
    '/zh/': {
      selectLanguageName: '简体中文',
      sidebar: {
        '/zh/': [
          {
            text: '简介',
            link: '/zh/',
          },
          {
            text: '安装方式',
            link: '/zh/install.md',
            children: [
              {
                text: '安卓',
                link: '/zh/install.md#安卓',
              },
              {
                text: 'iOS',
                link: '/zh/install.md#ios',
              },
            ],
          },
          {
            text: '快速上手',
            link: '/zh/quick_start.md',
            children: [
              {
                text: '初始化',
                link: '/zh/quick_start.md#初始化',
              },
              {
                text: '前期工作',
                link: '/zh/quick_start.md#前期工作',
              },
              {
                text: '扫描设备',
                link: '/zh/quick_start.md#扫描设备',
              },
              {
                text: '连接设备',
                link: '/zh/quick_start.md#连接设备',
              },
              {
                text: '测量界面逻辑处理',
                link: '/zh/quick_start.md#测量界面逻辑处理',
              },
              {
                text: '展示测量报告',
                link: '/zh/quick_start.md#展示测量报告',
              },
            ],
          },
        ],
      },
      navbar: [
        {
          text: '指南',
          link: '/zh/',
        },
        {
          text: 'api',
          link: '/zh/api.md',
        },
        {
          text: '常见问题',
          link: '/zh/faq.md',
        },
        {
          text: '更新记录',
          link: 'https://www.github.com',
        },
      ],
    },
  },
};
const vuePressConfig = {
  head: [['link', { rel: 'icon', href: '../img/app_76.png' }]],
  locales: localesConfig,
  themeConfig,
  alias: {
    '@img': path.resolve(__dirname, '../img'),
  },
};

export default vuePressConfig;
