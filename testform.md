meta:
  form_name: exit_lead
  version: 1
  groups:
    - id: required
      label: 常時表示（必須）
    - id: helpful
      label: あると助かる（任意・おすすめ）
      type: accordion
      badge: "＋精度↑"
    - id: details
      label: 詳細（任意・後でOK）
      type: accordion

fields:
  # --- 常時表示（必須） ---
  - id: reason
    group: required
    label: 閉店検討理由
    component: chips
    multiple: true
    required: true
    options: [売上不振, 人材不足, 他事業集中, 引退, その他]
    allow_unknown_text: true   # "その他の詳細"テキストを別フィールドで出す場合は show_if で

  - id: cancel_status
    group: required
    label: 解約予告状況
    component: radio
    required: true
    options: [未提出, 提出予定, 提出済]

  - id: exit_when
    group: required
    label: 退店時期
    component: chips
    required: true
    options: [今月, 来月, 3ヶ月以内, 半年以内, 1年以内]
    indeterminate_chip: 未定   # ← 未定/不明チップで通過可

  - id: inquiry
    group: required
    label: お問い合わせ内容
    component: textarea
    required: true
    props: { rows: 3, counter: 1000 }

  - id: station_id
    group: required
    label: お店の最寄駅
    component: autocomplete
    required: true
    data_source: stations          # Supabase側の駅テーブル等
    search_by: [name, name_kana]
    suggest_from:
      - current_location           # 現在地→近隣駅
      - address                    # 住所→近隣駅
    special_values:
      - id: roadside
        label: 駅が近くにない（ロードサイド）

  - id: name
    group: required
    label: 氏名
    component: text
    required: true

  - id: kana
    group: required
    label: ふりがな
    component: text
    required: true
    validate: { pattern: "^[ぁ-ゖー\\s]+$", message: "ひらがなで入力してください" }



 （※確認用メール）
 - id: email_confirm
   group: required
   label: メールアドレス（確認）
   component: text
   required: true
   validate: { equals_field: email }

  # --- 折りたたみ①：あると助かる ---
  - id: rent_range
    group: helpful
    label: お店の賃料
    component: chips
    options: [〜10万円, 10〜20万円, 20〜30万円, 30万円〜]

  - id: tsubo_range
    group: helpful
    label: お店の坪数
    component: chips
    options: [〜10坪, 10〜20坪, 20〜30坪, 30坪〜]

  - id: address_zip
    group: helpful
    label: 郵便番号
    component: text
    mask: "999-9999"
    on_change: auto_fill_address

  - id: address
    group: helpful
    label: お店の住所
    component: text
    props: { placeholder: "市区町村・番地（任意）" }

  - id: shop_name
    group: helpful
    label: お店の屋号名
    component: text

  # --- 折りたたみ②：詳細 ---
  - id: corp_flag
    group: details
    label: 法人として申し込む
    component: switch

  - id: corp_name
    group: details
    label: 法人名
    component: text
    show_if: corp_flag == true

  - id: ask_price
    group: details
    label: 売却希望金額
    component: number
    props: { prefix: "¥", inputmode: "numeric" }

  - id: lease_flag
    group: details
    label: 設備リース有無
    component: switch

  - id: lease_note
    group: details
    label: リースの内容
    component: text
    show_if: lease_flag == true

  - id: phone
    group: details
    label: 電話番号
    component: text
    props: { type: "tel", inputmode: "numeric" }

behavior:
  autosave: { debounce_ms: 1500, storage: local }
  submit_unblocked: true              # 任意は未入力でも送信可能
  progress_footer: true               # 「あとn項目で送信できます」を表示
  sticky_estimate:
    desktop: { type: sticky, top_px: 72 }
    mobile:  { type: floating, bottom_px: 16, right_px: 16, collapsible: true }
