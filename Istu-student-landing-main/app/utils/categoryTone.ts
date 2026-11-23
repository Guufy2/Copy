// Complete class names let Tailwind detect every category color at build time.
const tones = [
  'bg-[#568cff38] text-[#a8d0ff]',
  'bg-[#875bea40] text-[#d9bbff]',
  'bg-[#3c9bb940] text-[#a6ecdf]',
  'bg-[#bb739a3f] text-[#ffd2ae]',
  'bg-[#8b77ce45] text-[#e9c7ff]',
] as const

export function categoryTone(tone: number) {
  return tones[tone] ?? tones[0]
}
