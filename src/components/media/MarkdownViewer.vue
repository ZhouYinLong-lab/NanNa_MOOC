<template>
  <div class="markdown-viewer markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import katex from 'katex'

const props = defineProps<{
  content: string
}>()

// Initialize markdown-it with KaTeX and highlight.js support
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch {
        // Fall through
      }
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
  },
})

// Custom LaTeX rendering: handle $...$ (inline) and $$...$$ (block)
function renderLatex(content: string): string {
  // Block LaTeX: $$...$$
  let result = content.replace(/\$\$([\s\S]*?)\$\$/g, (_match, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })
    } catch {
      return `<pre>${formula}</pre>`
    }
  })

  // Inline LaTeX: $...$
  result = result.replace(/\$(.*?)\$/g, (_match, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
    } catch {
      return formula
    }
  })

  return result
}

const renderedHtml = computed(() => {
  if (!props.content) return ''
  // First render LaTeX, then markdown
  const withLatex = renderLatex(props.content)
  return md.render(withLatex)
})
</script>

<style scoped>
.markdown-viewer {
  padding: 4px 0;
}
</style>
