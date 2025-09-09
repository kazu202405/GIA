<template>
  <v-textarea
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :append-inner-icon="copied ? 'mdi-check-circle' : 'mdi-content-copy'"
    @click:append-inner="copyToClipboard"
    density="compact"
    hide-details
    class="copyable-textarea"
  >
    <template #append>
      <v-tooltip activator="parent" location="top">
        {{ copied ? 'コピーしました！' : 'クリックでコピー' }}
      </v-tooltip>
    </template>
  </v-textarea>
</template>

<script setup>
import { ref } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'

const props = defineProps(['modelValue'])
const { showSnackBar } = useSnackbar()

const copied = ref(false)

const copyToClipboard = () => {
  if (props.modelValue !== undefined && props.modelValue !== null) {
    navigator.clipboard.writeText(props.modelValue)
      .then(() => {
        copied.value = true
        showSnackBar('コピーしました！')
        setTimeout(() => copied.value = false, 1500)  // 1.5秒で元に戻す
      })
      .catch(() => showSnackBar('コピーに失敗しました…'))
  }
}
</script>

<style scoped>
.copyable-textarea .v-input__append {
  align-items: center;  /* アイコン縦中央 */
  display: flex;
  transition: color 0.3s;
}

.copyable-textarea .mdi-check-circle {
  color: green;  /* コピー成功時のアイコン色 */
}
</style>
