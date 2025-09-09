# GIA Landing Page - TODO

## セットアップ手順

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   ブラウザで http://localhost:3000 を開く

3. **本番ビルド（SSG）**
   ```bash
   npm run generate
   ```
   distフォルダに静的ファイルが生成される

4. **プレビュー**
   ```bash
   npm run preview
   ```

## 画像差し替え箇所

以下の箇所に実際の画像を配置してください：

1. **Hero背景画像**
   - ファイル: `/public/images/hero-bg.jpg`
   - 推奨サイズ: 1920x1080px以上
   - 場所: `pages/index.vue` の `.hero-bg` セクション

2. **サービス画像（4枚）**
   - ファイル: `/public/images/service-1.jpg` 〜 `service-4.jpg`
   - 推奨サイズ: 600x400px
   - 場所: 各サービスカードの `.image-placeholder`

3. **About画像**
   - ファイル: `/public/images/about.jpg`
   - 推奨サイズ: 800x600px
   - 場所: `.large-image-placeholder`

4. **実績画像（6枚）**
   - ファイル: `/public/images/work-1.jpg` 〜 `work-6.jpg`
   - 推奨サイズ: 600x450px
   - 場所: 各ワークカードの `.work-placeholder`

## Supabase接続予定箇所

1. **お問い合わせフォーム**
   - ファイル: `pages/index.vue`
   - 関数: `submitForm()`
   - テーブル: `inquiries` (仮)
   - カラム: name, email, message, created_at

2. **アナリティクストラッキング**
   - ページビュー記録
   - CTAクリック記録

## テキスト差し替えリスト

| セクション | 現在のテキスト | 説明 |
|----------|------------|------|
| Hero H1 | 小さなチームで、大きな成果を。 | メインキャッチコピー |
| Hero サブ | DXとAIの実践を、現場の言葉で。 | サブキャッチコピー |
| サービス1 | ホームページ制作 | サービス名 |
| サービス2 | DX・システム開発 | サービス名 |
| サービス3 | 不動産事業 | サービス名 |
| サービス4 | 建築設計 | サービス名 |
| About | 私たちについてのテキスト | 会社説明文 |
| フッター | test@gmail.com | 実際のメールアドレス |
| フッター | 大阪市北区 | 詳細な住所 |

## パフォーマンス目標

- Lighthouse スコア目標
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 100

## 将来の拡張予定

1. **多言語対応**
   - i18nモジュールの追加
   - 日本語/英語切り替え

2. **ブログ機能**
   - `/blog` ルートの追加
   - Contentモジュールの導入

3. **アニメーション強化**
   - Lottieアニメーションの追加
   - GSAP導入（必要に応じて）

4. **CMS連携**
   - Strapi or Contentful
   - 動的コンテンツ管理

5. **分析ツール**
   - Google Analytics 4
   - ヒートマップツール

## 注意事項

- 画像は必ずWebP/AVIF形式に最適化してから配置
- アクセシビリティ: alt属性を必ず設定
- SEO: 各ページにmeta description設定
- モバイルファースト設計を維持