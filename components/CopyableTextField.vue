<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    append-inner-icon="mdi-content-copy"
    @click:append-inner="copyToClipboard"
    density="default"
    hide-details
    style="margin-inline: 4px"
  />
</template>

<script setup>
import { useSnackbar } from '@/composables/useSnackbar'

const props = defineProps(['modelValue'])
const { showSnackBar } = useSnackbar()

const copyToClipboard = () => {
  if (props.modelValue !== undefined && props.modelValue !== null) {
    navigator.clipboard.writeText(props.modelValue)
      .then(() => showSnackBar('コピーしました！'))
      .catch(() => showSnackBar('コピーに失敗しました…'))
  }
}
</script>

