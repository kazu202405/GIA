<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- ヘッダー -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-btn
              icon
              @click="$router.back()"
              class="mr-2"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span>出店希望者詳細</span>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="editMode = !editMode"
              :prepend-icon="editMode ? 'mdi-close' : 'mdi-pencil'"
            >
              {{ editMode ? 'キャンセル' : '編集' }}
            </v-btn>
          </v-card-title>
        </v-card>

        <!-- 基本情報 -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon left>mdi-account-details</v-icon>
            基本情報
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.customerId"
                  label="顧客ID"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="entryData.status"
                  :items="statusOptions"
                  label="ステータス"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.name"
                  label="氏名"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.nameKana"
                  label="フリガナ"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.companyName"
                  label="会社名"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="entryData.nationality"
                  :items="['日本', '中国', '韓国', 'アメリカ', 'その他']"
                  label="国籍"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 連絡先情報 -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon left>mdi-phone</v-icon>
            連絡先情報
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.mobilePhone"
                  label="携帯電話番号"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.otherPhone"
                  label="その他電話番号"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.loginEmail"
                  label="メールアドレス"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.fax"
                  label="FAX番号"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 出店条件 -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon left>mdi-store-search</v-icon>
            出店条件
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.businessCategory"
                  label="業態"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.desiredCondition"
                  label="希望引き渡し状態"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12">
                <v-chip-group>
                  <v-chip
                    v-for="prefecture in entryData.desiredPrefectures"
                    :key="prefecture"
                    class="ma-1"
                  >
                    {{ prefecture }}
                  </v-chip>
                </v-chip-group>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.rentMin"
                  label="賃料下限"
                  suffix="円"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entryData.rentMax"
                  label="賃料上限"
                  suffix="円"
                  :readonly="!editMode"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 対応履歴 -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon left>mdi-history</v-icon>
            対応履歴
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              size="small"
              @click="showHistoryDialog = true"
              prepend-icon="mdi-plus"
            >
              履歴追加
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-timeline density="compact">
              <v-timeline-item
                v-for="history in responseHistory"
                :key="history.id"
                :dot-color="history.type === 'call' ? 'blue' : 'green'"
                size="small"
              >
                <template v-slot:opposite>
                  <span class="text-caption">{{ formatDate(history.date) }}</span>
                </template>
                <div>
                  <strong>{{ history.title }}</strong>
                  <div class="text-caption">{{ history.content }}</div>
                  <div class="text-caption text-grey">担当: {{ history.staff }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>

        <!-- 保存ボタン -->
        <v-row v-if="editMode">
          <v-col cols="12" class="text-center">
            <v-btn
              color="primary"
              size="large"
              @click="saveEntry"
              prepend-icon="mdi-content-save"
            >
              保存
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 履歴追加ダイアログ -->
    <v-dialog
      v-model="showHistoryDialog"
      max-width="600"
    >
      <v-card>
        <v-card-title>対応履歴を追加</v-card-title>
        <v-card-text>
          <v-form>
            <v-select
              v-model="newHistory.type"
              :items="historyTypes"
              label="種別"
              variant="outlined"
              density="compact"
            />
            <v-text-field
              v-model="newHistory.title"
              label="タイトル"
              variant="outlined"
              density="compact"
            />
            <v-textarea
              v-model="newHistory.content"
              label="内容"
              rows="3"
              variant="outlined"
              density="compact"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showHistoryDialog = false">キャンセル</v-btn>
          <v-btn color="primary" @click="addHistory">追加</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// 編集モード
const editMode = ref(false)
const showHistoryDialog = ref(false)

// データ（実際はSupabaseから取得）
const entryData = ref({
  id: route.params.id,
  customerId: 'E12345678',
  name: '山田太郎',
  nameKana: 'ヤマダタロウ',
  companyName: '株式会社山田',
  nationality: '日本',
  mobilePhone: '090-1234-5678',
  otherPhone: '03-1234-5678',
  loginEmail: 'yamada@example.com',
  fax: '03-1234-5679',
  businessCategory: '飲食',
  desiredCondition: '居抜き',
  desiredPrefectures: ['大阪府', '兵庫県'],
  rentMin: 100000,
  rentMax: 300000,
  status: 'in_progress'
})

// 対応履歴
const responseHistory = ref([
  {
    id: 1,
    date: '2024-01-15T10:00:00',
    type: 'call',
    title: '初回ヒアリング',
    content: '希望条件の詳細を確認。梅田エリアを中心に探している。',
    staff: '営業 田中'
  },
  {
    id: 2,
    date: '2024-01-16T14:30:00',
    type: 'email',
    title: '物件情報送付',
    content: '梅田エリアの3件の物件情報を送付。',
    staff: '営業 田中'
  }
])

// 新規履歴
const newHistory = ref({
  type: 'call',
  title: '',
  content: ''
})

// ステータスオプション
const statusOptions = [
  { title: '新規', value: 'new' },
  { title: '対応中', value: 'in_progress' },
  { title: '商談中', value: 'negotiating' },
  { title: '成約', value: 'completed' },
  { title: '保留', value: 'on_hold' },
  { title: 'キャンセル', value: 'cancelled' }
]

// 履歴種別
const historyTypes = [
  { title: '電話', value: 'call' },
  { title: 'メール', value: 'email' },
  { title: '訪問', value: 'visit' },
  { title: 'その他', value: 'other' }
]

// メソッド
const saveEntry = async () => {
  // 保存処理
  console.log('保存処理')
  editMode.value = false
}

const addHistory = () => {
  responseHistory.value.push({
    id: responseHistory.value.length + 1,
    date: new Date().toISOString(),
    ...newHistory.value,
    staff: '営業スタッフ' // 認証実装後はログインユーザー名
  })
  showHistoryDialog.value = false
  newHistory.value = {
    type: 'call',
    title: '',
    content: ''
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ページタイトル
useHead({
  title: `出店希望者詳細 - ${entryData.value.name} - 管理画面`
})
</script>

<style scoped>
.v-timeline-item {
  padding-bottom: 24px;
}
</style>