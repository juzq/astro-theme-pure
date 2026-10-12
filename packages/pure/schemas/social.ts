import { z } from 'astro/zod'

import { socialLinks } from '../types/constants'

// Object (not `z.record`) so the inferred TypeScript shape is a partial
// record: users only have to provide the platforms they actually use.
// `.partial()` makes every key optional at the type level, while the
// per-key schema still validates that any provided value is a valid URL.
export const SocialLinksSchema = () =>
  z
    .object(
      Object.fromEntries(socialLinks.map((key) => [key, z.string().url().optional()])) as {
        [K in (typeof socialLinks)[number]]?: z.ZodOptional<z.ZodString>
      }
    )
    .partial()
    .transform((links) => {
      // Zod 4 narrows the indexed access to `unknown` for partial objects;
      // narrow back to `string` after the truthiness guard.
      const labelledLinks: Partial<Record<keyof typeof links, { label: string; url: string }>> = {}
      for (const _k in links) {
        const key = _k as keyof typeof links
        const rawUrl = links[key]
        if (typeof rawUrl !== 'string') continue
        const label: string | undefined = {
          github: 'GitHub',
          gitlab: 'GitLab',
          discord: 'Discord',
          youtube: 'YouTube',
          instagram: 'Instagram',
          x: 'X',
          telegram: 'Telegram',
          rss: 'RSS',
          email: 'Email',
          reddit: 'Reddit',
          bluesky: 'BlueSky',
          tiktok: 'TikTok',
          weibo: 'Weibo',
          steam: 'Steam',
          bilibili: 'Bilibili',
          zhihu: 'Zhihu',
          coolapk: 'Coolapk',
          netease: 'NetEase'
        }[key]
        // The label table above covers every key in `socialLinks`, so an
        // unknown platform falls through to `undefined`; skip it.
        if (!label) continue
        labelledLinks[key] = { label, url: rawUrl }
      }
      return labelledLinks
    })
    .optional()
