import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userRole: '', // ユーザーのロール情報を保存
    agencyId: '', // 代理店IDを保存
  }),
  actions: {
    // ロールを設定する関数
    setUserRole(role: string) {
      this.userRole = role;
    },
    // 代理店IDを設定する関数
    setAgencyId(id: string) {
      this.agencyId = id;
    },
    // ログアウト処理
    logout() {
      this.userRole = '';
      this.agencyId = '';
    },
  },
});
