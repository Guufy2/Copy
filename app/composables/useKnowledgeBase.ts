import type { KnowledgeBase } from '~~/shared/types/content'

export function useKnowledgeBase() {
  return useFetch<KnowledgeBase>('/api/knowledge', { key: 'knowledge-base' })
}
