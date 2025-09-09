<template>
  <v-app>
    <div class="gia-layout">
      <!-- ヘッダー -->
      <header class="gia-header" role="banner" aria-label="Global Information Academy">
        <v-container>
          <v-row align="center" class="py-2">
            <v-col cols="auto">
              <!-- ロゴ部分 -->
              <div class="d-flex align-center logo-wrapper">
                <img src="/gia-logo.png" alt="GIA Logo" class="logo-image" />
                <span class="company-logo">GIA</span>
              </div>
            </v-col>
            <v-spacer />
            <v-col cols="auto" class="d-none d-md-flex">
              <!-- デスクトップナビゲーション -->
              <nav class="main-nav">
                <a href="#services" class="nav-link">サービス</a>
                <a href="#about" class="nav-link">私たちについて</a>
                <a href="#works" class="nav-link">実績</a>
                <!-- <a href="#contact" class="nav-link">お問い合わせ</a> -->
              </nav>
            </v-col>
            <v-col cols="auto">
              <!-- CTAボタン -->
              <!-- <v-btn
                variant="flat"
                class="cta-button"
                @click="scrollToContact"
              >
                無料相談する
              </v-btn> -->
            </v-col>
          </v-row>
        </v-container>
      </header>

      <!-- メインコンテンツ -->
      <main class="gia-main">
        <slot />
      </main>

      <!-- フッター -->
      <footer class="gia-footer">
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <!-- 会社情報 -->
              <h3 class="footer-title">Global Information Academy</h3>
              <p class="footer-text">
                〒531-0056<br>
                大阪市中央区久太郎町1-7-11<br>
                global.information.academy[at]gmail.com
              </p>
            </v-col>
            <v-col cols="12" md="4">
              <!-- リンク -->
              <h4 class="footer-subtitle">サービス</h4>
              <ul class="footer-links">
                <li><a href="#services">価値に寄り添うホームページ制作</a></li>
                <li><a href="#services">現場を変えるDXシステム開発</a></li>
                <li><a href="#services">人と仕組みに寄り添うコンサルティング</a></li>
              </ul>
            </v-col>
            <v-col cols="12" md="4">
              <!-- その他 -->
              <h4 class="footer-subtitle">お問い合わせ</h4>
              <p class="footer-text">
                営業時間: 平日 10:00-17:00<br>
                お気軽にご相談ください
              </p>
            </v-col>
          </v-row>
          <v-divider class="my-6" />
          <v-row>
            <v-col cols="12" class="text-center">
              <!-- コピーライト -->
              <p class="copyright">
                © 2025 Global Information Academy. All rights reserved.
              </p>
            </v-col>
          </v-row>
        </v-container>
      </footer>
    </div>
  </v-app>
</template>

<script setup lang="ts">
// スクロール処理
const scrollToContact = () => {
  // コンタクトセクションへスムーズスクロール
  const element = document.getElementById('contact')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* 基本設定 */
.gia-layout {
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
  color: #1e3a5f;
  /* ヘッダー高さ変数 */
  --header-h: 64px;
}

/* ヘッダー */
.gia-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(255, 255, 255, 0.85) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  box-shadow: 0 1px 0 rgba(30, 58, 95, 0.12); /* 帯の原因を除去 */
  transition: all 0.3s ease;
  height: 64px;
  display: flex;
  align-items: center;
}

.gia-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(30, 58, 95, 0.06) 20%, 
    rgba(30, 58, 95, 0.06) 80%, 
    transparent);
}

.logo-wrapper {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo-wrapper:hover {
  transform: translateX(4px);
}

.logo-image {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  object-fit: contain;
}

.company-logo {
  font-size: 24px;
  font-weight: 700;
  color: #1e3a5f;
  letter-spacing: -0.5px;
}

.main-nav {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  position: relative;
  transition: color 0.3s ease;
  padding: 4px 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #3B82F6;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #1e3a5f;
}

.nav-link:hover::after {
  width: 100%;
}

.cta-button {
  background: #1e40af;
  color: white;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  padding: 0 24px;
  height: 36px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
}

/* フッター */
.gia-footer {
  /* background: #1e293b; */
  background: #0f1f33;
  color: white;
  padding: 60px 0 24px;
  margin-top: 0px;
}

.footer-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.footer-subtitle {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.footer-text {
  font-size: 14px;
  line-height: 1.8;
  opacity: 0.8;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition: opacity 0.3s;
}

.footer-links a:hover {
  opacity: 1;
}

.copyright {
  font-size: 14px;
  opacity: 0.6;
}

/* メインコンテンツの余白調整 */
.gia-main {
  padding-top: var(--header-h);
}

/* 固定ヘッダーでアンカーが隠れないように */
.gia-main :target {
  scroll-margin-top: var(--header-h);
}
</style>