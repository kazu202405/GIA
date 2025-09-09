export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.css",
    "@/assets/styles/global.css",   // ここを追加！
    "@/assets/styles/global-fix.css"   // 右端チラ見え対策CSS
  ],
  build: {
    transpile: ["vuetify"],
  },
  plugins: [
    "@/plugins/vuetify",
    "@/plugins/supabase", // Supabaseプラグインを追加
    '~/plugins/pinia.ts', // Piniaプラグインを登録

  ],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["dayjs-nuxt"],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  runtimeConfig: {
    // サーバーサイドのみの設定を追加
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    openaiApiUrl: process.env.NUXT_OPENAI_API_URL,
    
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
    app: {
      port: process.env.PORT || 8080,
      host: "0.0.0.0",
    },
  },
  components: true // 自動インポートを有効化
});