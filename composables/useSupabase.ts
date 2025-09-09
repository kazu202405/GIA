import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/plugins/supabase'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { ref } from 'vue'

// クライアントサイド用のフック
export const useSupabase = () => {
  const nuxtApp = useNuxtApp()
  const { $supabase } = nuxtApp
  if (!$supabase) {
    throw new Error('Supabase client is not initialized')
  }
  return $supabase as SupabaseClient<Database>
}


// サーバーサイド用のクライアント
export const useSupabaseService = () => {
  const config = useRuntimeConfig()

  if (!config.supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_KEY is missing in environment variables')
    throw new Error('SUPABASE_SERVICE_KEY is required for server-side operations')
  }

  try {
    return createClient<Database>(
      config.public.supabaseUrl as string,
      config.supabaseServiceKey as string,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )
  } catch (error) {
    console.error('Failed to initialize Supabase service client:', error)
    throw error
  }
}

// useSupabaseUser の実装を追加
const user = ref<User | null>(null)
export const useSupabaseUser = () => {
  if (!user.value) {
    const supabase = useSupabase()
    supabase.auth.getUser().then(({ data }) => {
      user.value = data.user
    })
    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user || null
    })
  }
  return user
}