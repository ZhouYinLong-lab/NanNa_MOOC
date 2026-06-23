<template>
  <div class="post-editor">
    <div v-if="showTitle" class="editor-field">
      <input
        v-model="title"
        class="input"
        placeholder="帖子标题"
        maxlength="200"
      />
    </div>
    <div class="editor-field">
      <textarea
        v-model="content"
        class="input editor-textarea"
        :placeholder="placeholder"
        rows="4"
        maxlength="10000"
      ></textarea>
    </div>
    <div class="editor-footer">
      <span class="char-count">{{ content.length }}/10000</span>
      <div class="editor-btns">
        <button class="btn btn-outline btn-sm" @click="$emit('cancel')" v-if="showCancel">
          取消
        </button>
        <button
          class="btn btn-primary btn-sm"
          :disabled="!canSubmit"
          @click="submit"
        >
          {{ submitLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  showTitle?: boolean
  showCancel?: boolean
  placeholder?: string
  submitLabel?: string
  initialTitle?: string
  initialContent?: string
}>(), {
  showTitle: true,
  showCancel: false,
  placeholder: '写下你的内容...',
  submitLabel: '发布',
  initialTitle: '',
  initialContent: '',
})

const emit = defineEmits<{
  submit: [data: { title: string; content: string }]
  cancel: []
}>()

const title = ref(props.initialTitle)
const content = ref(props.initialContent)

const canSubmit = computed(() => {
  if (props.showTitle && !title.value.trim()) return false
  return content.value.trim().length > 0
})

function submit() {
  if (!canSubmit.value) return
  emit('submit', {
    title: title.value.trim(),
    content: content.value.trim(),
  })
  title.value = ''
  content.value = ''
}
</script>

<style scoped>
.post-editor {
  background-color: var(--color-bg-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 16px;
}

.editor-field {
  margin-bottom: 12px;
}

.editor-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.6;
}

.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.char-count {
  font-size: 12px;
  color: var(--color-text-muted);
}

.editor-btns {
  display: flex;
  gap: 8px;
}
</style>
