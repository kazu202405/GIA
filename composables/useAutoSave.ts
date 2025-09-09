import { ref, watch, type Ref } from 'vue'
import { debounce } from 'lodash-es'

interface UseAutoSaveOptions {
  key: string
  delay?: number
  onSave?: (data: any) => void | Promise<void>
  onLoad?: (data: any) => any
  enabled?: boolean
}

export const useAutoSave = <T extends object>(
  data: Ref<T>,
  options: UseAutoSaveOptions
) => {
  const {
    key,
    delay = 1500,
    onSave,
    onLoad,
    enabled = true
  } = options

  const isSaving = ref(false)
  const lastSaved = ref<Date | null>(null)
  const saveError = ref<Error | null>(null)

  // ローカルストレージから読み込み
  const loadFromStorage = () => {
    if (!enabled) return

    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        const loadedData = onLoad ? onLoad(parsed.data) : parsed.data
        
        // データが存在する場合のみ読み込み
        if (loadedData && Object.keys(loadedData).length > 0) {
          Object.assign(data.value, loadedData)
          lastSaved.value = parsed.timestamp ? new Date(parsed.timestamp) : null
        }
      }
    } catch (error) {
      console.error('自動保存データの読み込みエラー:', error)
      saveError.value = error as Error
    }
  }

  // ローカルストレージに保存
  const saveToStorage = async (dataToSave: T) => {
    if (!enabled) return

    isSaving.value = true
    saveError.value = null

    try {
      const saveData = {
        data: dataToSave,
        timestamp: new Date().toISOString()
      }

      // カスタム保存処理がある場合
      if (onSave) {
        await onSave(dataToSave)
      }

      // ローカルストレージに保存
      localStorage.setItem(key, JSON.stringify(saveData))
      lastSaved.value = new Date()
    } catch (error) {
      console.error('自動保存エラー:', error)
      saveError.value = error as Error
    } finally {
      isSaving.value = false
    }
  }

  // デバウンスされた保存関数
  const debouncedSave = debounce(saveToStorage, delay)

  // データの変更を監視
  if (enabled) {
    watch(
      data,
      (newData) => {
        debouncedSave(newData)
      },
      { deep: true }
    )
  }

  // 手動保存
  const save = () => saveToStorage(data.value)

  // 保存データをクリア
  const clear = () => {
    try {
      localStorage.removeItem(key)
      lastSaved.value = null
      saveError.value = null
    } catch (error) {
      console.error('保存データのクリアエラー:', error)
      saveError.value = error as Error
    }
  }

  // 最後の保存からの経過時間（秒）
  const timeSinceLastSave = computed(() => {
    if (!lastSaved.value) return null
    return Math.floor((Date.now() - lastSaved.value.getTime()) / 1000)
  })

  return {
    isSaving: readonly(isSaving),
    lastSaved: readonly(lastSaved),
    saveError: readonly(saveError),
    timeSinceLastSave,
    loadFromStorage,
    save,
    clear
  }
}