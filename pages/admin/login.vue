<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mt-5">
          <v-card-title class="text-center">
            管理者ログイン
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="メールアドレス"
                type="email"
                required
                :rules="[v => !!v || 'メールアドレスは必須です']"
              />
              <v-text-field
                v-model="password"
                label="パスワード"
                type="password"
                required
                :rules="[
                  v => !!v || 'パスワードは必須です',
                  v => (v && v.length >= 6) || 'パスワードは6文字以上必要です'
                ]"
              />
              <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading"
                class="mb-4"
              >
                ログイン
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- エラーメッセージ -->
        <v-snackbar
          v-model="showError"
          color="error"
          timeout="3000"
        >
          {{ errorMessage }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import bcrypt from 'bcryptjs' // bcryptライブラリのインポート
import { useAuthStore } from '@/stores/auth'; // ストアをインポート

const router = useRouter()
const supabase = useSupabase()

const email = ref('')
const password = ref('')
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// エラーメッセージの表示
const showErrorMessage = (message: string) => {
  errorMessage.value = message
  showError.value = true
}

// フォームの送信処理
const handleSubmit = async () => {
  if (!email.value || !password.value) {
    showErrorMessage('メールアドレスとパスワードを入力してください')
    return
  }

  if (password.value.length < 6) {
    showErrorMessage('パスワードは6文字以上必要です')
    return
  }

  loading.value = true
  
  try {
    // console.log('ログインを開始します')

    // login_usersテーブルでメールアドレスとパスワードをチェック
    const { data: loginUser, error: loginError } = await supabase
      .from('login_users')
      .select('id, role, agency_id, password_hash') // 必要なフィールドを指定
      .eq('email', email.value)
      .single()

    if (loginError || !loginUser) {
      console.error('ログインエラー:', loginError)
      throw new Error('メールアドレスまたはパスワードが間違っています')
    }

    // bcryptでパスワードを比較
    const isPasswordValid = await bcrypt.compare(password.value, loginUser.password_hash)
    if (!isPasswordValid) {
      throw new Error('メールアドレスまたはパスワードが間違っています')
    }

    console.log('Login 成功:', loginUser)

    // ストアにログイン情報を保存
    const authStore = useAuthStore();
    authStore.setUserRole(loginUser.role); // roleを保存
    authStore.setAgencyId(loginUser.agency_id); // agency_idを保存

    // ログイン後、ユーザーロールとagency_idを保持してダッシュボードに遷移
    await router.push({
      path: '/',
      query: { role: loginUser.role, agencyId: loginUser.agency_id },
    })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'エラーが発生しました'
    showErrorMessage(errorMessage)
  } finally {
    loading.value = false
  }
}

// ページタイトルの設定
useHead({
  title: '管理者ログイン'
})
</script>