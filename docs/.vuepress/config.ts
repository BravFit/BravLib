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
            link: '/install',
            children: [
              {
                text: 'Android',
                link: '/install#android',
              },
              {
                text: 'iOS',
                link: '/install#ios',
              },
            ],
          },
          {
            text: 'Quick start',
            link: '/quick_start',
            children: [
              {
                text: 'Initialize',
                link: '/quick_start#initialize',
              },
              {
                text: 'Preliminary work',
                link: '/quick_start#preliminary-work',
              },
              {
                text: 'Scan device',
                link: '/quick_start#scan-device',
              },
              {
                text: 'Connect device',
                link: '/quick_start#connect-device',
              },
              {
                text: 'Measurement interface logic processing',
                link: '/quick_start#measurement-interface-logic-processing',
              },
              {
                text: 'Show measurement report',
                link: '/quick_start#show-measurement-report',
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
          link: '/api',
        },
        {
          text: 'FAQ',
          link: '/faq',
        },
        {
          text: 'Change Log',
          link: 'https://github.com/BravFit/BravLib/releases',
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
            link: '/zh/install',
            children: [
              {
                text: '安卓',
                link: '/zh/install#安卓',
              },
              {
                text: 'iOS',
                link: '/zh/install#ios',
              },
              {
                text: '微信小程序',
                link: '/zh/install#微信小程序',
              },
            ],
          },
          {
            text: '快速上手',
            link: '/zh/quick_start',
            children: [
              {
                text: '初始化',
                link: '/zh/quick_start#初始化',
              },
              {
                text: '前期工作',
                link: '/zh/quick_start#前期工作',
              },
              {
                text: '扫描设备',
                link: '/zh/quick_start#扫描设备',
              },
              {
                text: '连接设备',
                link: '/zh/quick_start#连接设备',
              },
              {
                text: '测量界面逻辑处理',
                link: '/zh/quick_start#测量界面逻辑处理',
              },
              {
                text: '展示测量报告',
                link: '/zh/quick_start#展示测量报告',
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
          link: '/zh/api',
        },
        {
          text: '常见问题',
          link: '/zh/faq',
        },
        {
          text: '更新记录',
          link: 'https://github.com/BravFit/BravLib/releases',
        },
      ],
    },
  },
};
const vuePressConfig = {
  base: '/BravLib/',
  title: 'BravLib',
  head: [['link', { rel: 'icon', href: '../img/app_76.png' }]],
  locales: localesConfig,
  themeConfig,
  alias: {
    '@img': path.resolve(__dirname, '../img'),
  },
};

export default vuePressConfig;
