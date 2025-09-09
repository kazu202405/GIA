<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-account-group</v-icon>
            出店希望者一覧
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="$router.push('/admin/entry-form')"
              prepend-icon="mdi-plus"
            >
              新規登録
            </v-btn>
          </v-card-title>

          <!-- 検索・フィルター -->
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="検索（氏名・会社名・電話番号）"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  hide-details
                  @input="performSearch"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterStatus"
                  :items="statusOptions"
                  label="ステータス"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterBusinessCategory"
                  :items="businessCategories"
                  label="業態"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="success"
                  @click="exportCsv"
                  prepend-icon="mdi-download"
                  block
                >
                  CSV出力
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- データテーブル -->
          <v-data-table
            :headers="headers"
            :items="filteredEntries"
            :loading="loading"
            :search="searchQuery"
            :items-per-page="20"
            class="elevation-0"
            @click:row="handleRowClick"
          >
            <!-- ステータス列のカスタマイズ -->
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                small
                dark
              >
                {{ getStatusText(item.status) }}
              </v-chip>
            </template>

            <!-- 作成日列のフォーマット -->
            <template v-slot:item.created_at="{ item }">
              {{ formatDate(item.created_at) }}
            </template>

            <!-- アクション列 -->
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                small
                @click.stop="editEntry(item)"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                @click.stop="viewEntry(item)"
              >
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// 検索・フィルター用
const searchQuery = ref('')
const filterStatus = ref(null)
const filterBusinessCategory = ref(null)
const loading = ref(false)

// テーブルヘッダー定義
const headers = [
  { title: '顧客ID', key: 'customerId', align: 'start' },
  { title: '氏名', key: 'name', align: 'start' },
  { title: '会社名', key: 'companyName', align: 'start' },
  { title: '携帯電話', key: 'mobilePhone', align: 'start' },
  { title: '業態', key: 'businessCategory', align: 'center' },
  { title: 'ステータス', key: 'status', align: 'center' },
  { title: '希望エリア', key: 'desiredPrefectures', align: 'start' },
  { title: '登録日', key: 'created_at', align: 'center' },
  { title: '操作', key: 'actions', align: 'center', sortable: false }
]

// ダミーデータ（Supabase実装までの暫定）
const entries = ref([
  {
    id: 1,
    customerId: 'E12345678',
    name: '山田太郎',
    companyName: '株式会社山田',
    mobilePhone: '090-1234-5678',
    businessCategory: 'restaurant',
    status: 'new',
    desiredPrefectures: ['大阪府', '兵庫県'],
    created_at: '2024-01-15T10:00:00'
  },
  {
    id: 2,
    customerId: 'E23456789',
    name: '佐藤花子',
    companyName: '',
    mobilePhone: '080-2345-6789',
    businessCategory: 'retail',
    status: 'in_progress',
    desiredPrefectures: ['京都府'],
    created_at: '2024-01-14T15:30:00'
  },
  {
    id: 3,
    customerId: 'E34567890',
    name: '鈴木一郎',
    companyName: '鈴木商店',
    mobilePhone: '070-3456-7890',
    businessCategory: 'service',
    status: 'completed',
    desiredPrefectures: ['大阪府', '京都府', '奈良県'],
    created_at: '2024-01-13T09:15:00'
  }
])

// ステータスオプション
const statusOptions = [
  { title: '新規', value: 'new' },
  { title: '対応中', value: 'in_progress' },
  { title: '商談中', value: 'negotiating' },
  { title: '成約', value: 'completed' },
  { title: '保留', value: 'on_hold' },
  { title: 'キャンセル', value: 'cancelled' }
]

// 業態オプション
const businessCategories = [
  { title: '飲食', value: 'restaurant' },
  { title: '物販', value: 'retail' },
  { title: 'サービス', value: 'service' },
  { title: '美容', value: 'beauty' },
  { title: '医療', value: 'medical' },
  { title: '福祉', value: 'welfare' },
  { title: '娯楽', value: 'entertainment' }
]

// フィルター処理
const filteredEntries = computed(() => {
  let result = entries.value

  if (filterStatus.value) {
    result = result.filter(entry => entry.status === filterStatus.value)
  }

  if (filterBusinessCategory.value) {
    result = result.filter(entry => entry.businessCategory === filterBusinessCategory.value)
  }

  return result
})

// メソッド
const performSearch = () => {
  // 検索処理（debounce推奨）
}

const exportCsv = () => {
  // CSV出力処理
  console.log('CSV出力')
}

const handleRowClick = (event: any, { item }: any) => {
  viewEntry(item)
}

const editEntry = (item: any) => {
  navigateTo(`/admin/entries/${item.id}/edit`)
}

const viewEntry = (item: any) => {
  navigateTo(`/admin/entries/${item.id}`)
}

// ヘルパー関数
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    new: 'blue',
    in_progress: 'orange',
    negotiating: 'purple',
    completed: 'green',
    on_hold: 'grey',
    cancelled: 'red'
  }
  return colors[status] || 'grey'
}

const getStatusText = (status: string) => {
  const statusOption = statusOptions.find(opt => opt.value === status)
  return statusOption ? statusOption.title : status
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
  title: '出店希望者一覧 - 管理画面'
})
</script>

<style scoped>
.v-data-table {
  cursor: pointer;
}

.v-data-table >>> tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>