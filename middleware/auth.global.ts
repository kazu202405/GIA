import { navigateTo } from '#app';
import { useAuthStore } from '@/stores/auth'; // Piniaストアをインポート

export default defineNuxtRouteMiddleware((to) => {
  // テスト段階のため認証をスキップ
  // 本番環境では以下のコメントを外して認証を有効化
  
  /*
  // ストアからユーザー情報を取得
  const authStore = useAuthStore();
  
  // ログインが必要なパスかどうかを判定
  const authRequired = to.path !== '/admin/login' && (to.path === '/' || to.path.startsWith('/admin'));

  // 未ログイン状態のチェック（roleが空かどうかで判断）
  const isLoggedIn = !!authStore.userRole;

  // リダイレクト処理
  if (authRequired && !isLoggedIn) {
    console.log('未ログインのためリダイレクト');
    return navigateTo('/admin/login');
  }
  */
});
