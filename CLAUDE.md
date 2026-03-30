# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with [Astro](https://astro.build/) using the `astro-theme-pure` theme. The site features blog posts, documentation pages, tools, and about pages.

## Common Commands

```shell
# Install dependencies (use pnpm as specified in packageManager)
pnpm install

# Development server with hot reload
pnpm dev

# Type checking
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview

# Format code (prettier)
pnpm format

# Lint code (eslint)
pnpm lint

# Sync content collections
pnpm sync
```

## Architecture

### Content Structure

- **`src/content/blog/`** - Blog posts in Markdown/MDX format
- **`src/content/docs/`** - Documentation pages
- **`src/content.config.ts`** - Content collection schemas (blog and docs)
- **`src/site.config.ts`** - Theme configuration (theme, integrations, header, footer)

### Key Directories

- **`src/pages/`** - Astro pages (404, about, tools, etc.)
- **`src/layouts/`** - Page layouts (BaseLayout, BlogPost, ContentLayout)
- **`src/components/`** - Astro components (home, links, projects, waline, about)
- **`src/plugins/`** - Custom Shiki transformers and rehype plugins
- **`packages/pure/`** - Reusable theme components and utilities published as `astro-pure` npm package
- **`preset/`** - Preset configurations (avatars caching scripts)

### Configuration Files

- **`astro.config.ts`** - Astro configuration including Shiki syntax highlighting, markdown plugins (remark-math, rehype-katex), and integrations
- **`uno.config.ts`** - UnoCSS configuration
- **`src/site.config.ts`** - Theme-specific settings (header, footer, Waline comments, pagefind search)

### Dependencies

- **Astro 5.x** with content collections
- **Shiki** for syntax highlighting (with custom transformers for diff/highlight notation)
- **Waline** for comment system
- **UnoCSS** for utility CSS
- **Pagefind** for full-text search
- **KaTeX** for math rendering (via remark-math/rehype-katex)
