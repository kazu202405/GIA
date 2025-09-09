import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    selectedCompanyId: null
  })
})
