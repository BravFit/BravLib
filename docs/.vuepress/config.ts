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
      ],
    },
  },
};
const vuePressConfig = {
  locales: localesConfig,
  themeConfig,
  alias: {
    '@img': path.resolve(__dirname, '../img'),
  },
};

export default vuePressConfig;
