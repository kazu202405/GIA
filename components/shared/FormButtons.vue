<template>
  <div class="d-flex justify-space-between align-center mt-6 px-6 mb-8">

    <!-- 戻るボタン -->
    <div>
      <v-btn
        v-if="!isFirst"
        color="grey"
        @click="$emit('back')"
        prepend-icon="mdi-arrow-left"
      >
        戻る
      </v-btn>
    </div>

    <!-- 次へ or 最終ボタン -->
    <div>
      <v-btn
        v-if="!isLast"
        color="primary"
        @click="$emit('next')"
        append-icon="mdi-arrow-right"
      >
        次へ
      </v-btn>
      <v-btn
        v-else
        color="success"
        @click="$emit('submit')"
        :loading="isProcessing"
        :disabled="isProcessing"
        append-icon="mdi-check-circle"
      >
        {{ completeLabel }}
      </v-btn>
    </div>

  </div>
</template>

<script setup>
defineProps({
  isLast: { type: Boolean, default: false },
  isFirst: { type: Boolean, default: false },
  isProcessing: { type: Boolean, default: false },
  completeLabel: { type: String, default: '文言を作成' } 
})
</script>
