import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import AstroPureIntegration from 'astro-pure'
import { defineConfig, fontProviders } from 'astro/config'
// import vercel from '@astrojs/vercel'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// Local integrations
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
// Shiki
import {
  addCollapse,
  addCopyButton,
  addLanguage,
  addTitle,
  updateStyle
} from './src/plugins/shiki-custom-transformers.ts'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerRemoveNotationEscape
} from './src/plugins/shiki-official/transformers.ts'
import config from './src/site.config.ts'

// https://astro.build/config
export default defineConfig({
  // [Basic]
  site: 'https://juzzi.qzz.io',
  // Deploy to a sub path
  // https://astro-pure.js.org/docs/setup/deployment#platform-with-base-path
  // base: '/astro-pure/',
  trailingSlash: 'never',
  // root: './my-project-directory',
  server: { host: true },

  // [Adapter]
  // https://docs.astro.build/en/guides/deploy/
  // adapter: vercel(),
  output: 'static',
  // Local (standalone)
  // adapter: node({ mode: 'standalone' }),
  // output: 'server',x

  // [Assets]
  image: {
    domains: ['ghchart.rshah.org'], // 允许此域名的图片
    responsiveStyles: true,
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  // [Markdown]
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, {}],
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        // Two copies of @shikijs/types used to clash (one under node_modules
        // and another nested under @astrojs/markdown-remark → shiki); the
        // surrounding custom transformers below bridge the gap with
        // `as never` casts where needed.
        // Official transformers
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerRemoveNotationEscape(),
        // Custom transformers
        updateStyle(),
        addTitle(),
        addLanguage(),
        addCopyButton(2000), // timeout in ms
        addCollapse(15) // max lines that needs to collapse
      ]
    }
  },

  // [Integrations]
  integrations: [
    // astro-pure will automatically add sitemap, mdx & unocss
    // sitemap(),
    // mdx(),
    AstroPureIntegration(config)
  ],

  // [Fonts]
  // Local Satoshi fonts (woff2 under src/assets/fonts/) — switched from
  // fontshare() to local() so the build doesn't depend on cdn.fontshare.com
  // reachability from the dev environment. In Astro 7 the `fonts` API moved
  // out of `experimental` and is now a top-level config option.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Satoshi',
      cssVariable: '--font-satoshi',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/Satoshi-Regular.woff2'],
            weight: 400,
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/Satoshi-Italic.woff2'],
            weight: 400,
            style: 'italic'
          },
          {
            src: ['./src/assets/fonts/Satoshi-Medium.woff2'],
            weight: 500,
            style: 'normal'
          },
          {
            src: ['./src/assets/fonts/Satoshi-MediumItalic.woff2'],
            weight: 500,
            style: 'italic'
          }
        ]
      }
    }
  ],

  // [Experimental]
  experimental: {
    // Allow compatible editors to support intellisense features for content collection entries
    // https://docs.astro.build/en/reference/experimental-flags/content-intellisense/
    contentIntellisense: true
  },
  // ... 其他配置
  vite: {
    server: {
      hmr: false // 彻底禁用热更新
    }
  }
})
