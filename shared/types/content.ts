export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  tone: number
  sort: number
}

export interface ArticleSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  category: Category
  reading_minutes: number
  featured: boolean
  is_faq: boolean
  is_demo: boolean
  date_updated: string | null
}

export interface Article extends ArticleSummary {
  body: string
  toc: { id: string; title: string }[]
}

export interface KnowledgeBase {
  categories: Category[]
  articles: ArticleSummary[]
}
