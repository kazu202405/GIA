<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          <v-icon left>mdi-view-dashboard</v-icon>
          管理ダッシュボード
        </h1>
      </v-col>
    </v-row>

    <!-- サマリーカード -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon size="48" color="blue">mdi-account-plus</v-icon>
            <div class="text-h3 mt-2">{{ summaryData.newEntries }}</div>
            <div class="text-subtitle-1">今月の新規登録</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon size="48" color="orange">mdi-account-clock</v-icon>
            <div class="text-h3 mt-2">{{ summaryData.inProgress }}</div>
            <div class="text-subtitle-1">対応中</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon size="48" color="purple">mdi-handshake</v-icon>
            <div class="text-h3 mt-2">{{ summaryData.negotiating }}</div>
            <div class="text-subtitle-1">商談中</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="text-center">
            <v-icon size="48" color="green">mdi-check-circle</v-icon>
            <div class="text-h3 mt-2">{{ summaryData.completed }}</div>
            <div class="text-subtitle-1">今月の成約</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- グラフエリア -->
    <v-row class="mt-4">
      <!-- 月別推移 -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-chart-line</v-icon>
            月別登録推移
          </v-card-title>
          <v-card-text>
            <div class="chart-placeholder">
              <!-- Chart.js等で実装予定 -->
              <v-sheet
                color="grey-lighten-3"
                height="300"
                class="d-flex align-center justify-center"
              >
                <span class="text-grey">グラフエリア（実装予定）</span>
              </v-sheet>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 業態別内訳 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-chart-pie</v-icon>
            業態別内訳
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item
                v-for="item in businessBreakdown"
                :key="item.category"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.label }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip small>{{ item.count }}件</v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- エリア別・営業担当別 -->
    <v-row class="mt-4">
      <!-- エリア別 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-map-marker</v-icon>
            エリア別登録状況
          </v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>エリア</th>
                  <th class="text-center">新規</th>
                  <th class="text-center">対応中</th>
                  <th class="text-center">成約</th>
                  <th class="text-center">合計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="area in areaStats" :key="area.name">
                  <td>{{ area.name }}</td>
                  <td class="text-center">{{ area.new }}</td>
                  <td class="text-center">{{ area.inProgress }}</td>
                  <td class="text-center">{{ area.completed }}</td>
                  <td class="text-center font-weight-bold">{{ area.total }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 営業担当別 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-account-tie</v-icon>
            営業担当別実績（今月）
          </v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>担当者</th>
                  <th class="text-center">登録数</th>
                  <th class="text-center">商談数</th>
                  <th class="text-center">成約数</th>
                  <th class="text-center">成約率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="staff in staffStats" :key="staff.name">
                  <td>{{ staff.name }}</td>
                  <td class="text-center">{{ staff.entries }}</td>
                  <td class="text-center">{{ staff.negotiations }}</td>
                  <td class="text-center">{{ staff.completed }}</td>
                  <td class="text-center">{{ staff.rate }}%</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 最新の活動 -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-history</v-icon>
            最新の活動
            <v-spacer></v-spacer>
            <v-btn
              text
              small
              @click="$router.push('/admin/entries')"
            >
              すべて見る
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="activity in recentActivities"
                :key="activity.id"
              >
                <v-list-item-avatar>
                  <v-icon :color="activity.color">{{ activity.icon }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ activity.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ activity.time }} - {{ activity.staff }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// サマリーデータ
const summaryData = ref({
  newEntries: 24,
  inProgress: 18,
  negotiating: 7,
  completed: 5
})

// 業態別内訳
const businessBreakdown = ref([
  { category: 'restaurant', label: '飲食', count: 35 },
  { category: 'retail', label: '物販', count: 12 },
  { category: 'service', label: 'サービス', count: 8 },
  { category: 'beauty', label: '美容', count: 6 },
  { category: 'medical', label: '医療', count: 3 }
])

// エリア別統計
const areaStats = ref([
  { name: '大阪府', new: 8, inProgress: 6, completed: 2, total: 16 },
  { name: '京都府', new: 5, inProgress: 4, completed: 1, total: 10 },
  { name: '兵庫県', new: 6, inProgress: 5, completed: 1, total: 12 },
  { name: '奈良県', new: 3, inProgress: 2, completed: 1, total: 6 },
  { name: '滋賀県', new: 1, inProgress: 1, completed: 0, total: 2 },
  { name: '和歌山県', new: 1, inProgress: 0, completed: 0, total: 1 }
])

// 営業担当別統計
const staffStats = ref([
  { name: '田中太郎', entries: 12, negotiations: 5, completed: 3, rate: 60 },
  { name: '佐藤花子', entries: 8, negotiations: 3, completed: 1, rate: 33 },
  { name: '鈴木一郎', entries: 4, negotiations: 2, completed: 1, rate: 50 }
])

// 最新の活動
const recentActivities = ref([
  {
    id: 1,
    icon: 'mdi-account-plus',
    color: 'blue',
    title: '新規登録: 山田太郎様（飲食・大阪市）',
    time: '10分前',
    staff: '田中太郎'
  },
  {
    id: 2,
    icon: 'mdi-phone',
    color: 'green',
    title: '電話対応: 佐藤花子様へ物件情報提供',
    time: '1時間前',
    staff: '佐藤花子'
  },
  {
    id: 3,
    icon: 'mdi-handshake',
    color: 'purple',
    title: 'ステータス更新: 鈴木一郎様が商談中へ',
    time: '3時間前',
    staff: '鈴木一郎'
  },
  {
    id: 4,
    icon: 'mdi-check-circle',
    color: 'green',
    title: '成約: 田中次郎様（物販・京都市）',
    time: '昨日',
    staff: '田中太郎'
  }
])

// ページタイトル
useHead({
  title: 'ダッシュボード - 管理画面'
})
</script>

<style scoped>
.v-card {
  transition: all 0.3s;
}

.v-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.chart-placeholder {
  min-height: 300px;
}
</style>