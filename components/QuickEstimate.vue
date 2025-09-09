<template>
  <v-container class="py-12" style="max-width: 1400px;">
    <!-- セクションヘッダー -->
    <div class="text-center mb-8">
      <h2 class="text-h4 font-weight-bold mb-4">
        <v-icon size="32" color="primary" class="mr-2">mdi-calculator-variant</v-icon>
        60秒で分かる簡易査定
      </h2>
      <p class="text-h6 text-grey-darken-1 mb-2">
        お店の概算譲渡額を今すぐ算出
      </p>
      <p class="text-body-1 text-grey-darken-2">
        設備・内装・立地・営業価値を総合的に評価し、あなたの物件価値を可視化します
      </p>
    </div>

    <!-- 査定結果（右下固定フローティングカード） -->
    <v-card 
      v-if="estimateResult" 
      elevation="12" 
      class="result-floating"
      :class="{ 'result-pulse': estimateResult }"
    >
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="text-overline">簡易査定結果</div>
          <v-btn
            icon
            size="x-small"
            variant="text"
            @click="showDetailedBreakdown = !showDetailedBreakdown"
          >
            <v-icon>{{ showDetailedBreakdown ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </v-btn>
        </div>
        
        <div class="text-h4 font-weight-bold text-primary mb-1">
          ¥{{ formatCurrency(estimateResult.totalValue) }}
        </div>
        <div class="text-caption text-grey-darken-1 mb-3">
          概算譲渡額
        </div>
        
        <!-- 簡易内訳（展開可能） -->
        <v-expand-transition>
          <div v-if="showDetailedBreakdown">
            <v-divider class="mb-3"></v-divider>
            <div class="breakdown-mini">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-caption">設備・内装</span>
                <span class="text-caption font-weight-medium">¥{{ formatCurrency(estimateResult.equipmentInteriorTotal) }}</span>
              </div>
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-caption">立地価値</span>
                <span class="text-caption font-weight-medium">¥{{ formatCurrency(estimateResult.locationValue) }}</span>
              </div>
              <div class="d-flex justify-space-between align-center mb-3">
                <span class="text-caption">営業価値</span>
                <span class="text-caption font-weight-medium">¥{{ formatCurrency(estimateResult.salesValue) }}</span>
              </div>
            </div>
          </div>
        </v-expand-transition>
        
        <div class="d-flex gap-2">
          <v-btn
            color="primary"
            size="small"
            variant="flat"
            @click="goToDetailedAssessment"
            block
          >
            詳細査定へ
          </v-btn>
          <v-btn
            color="grey"
            size="small"
            variant="outlined"
            @click="scrollToDetailedResult"
          >
            <v-icon size="18">mdi-arrow-down</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 入力フォーム -->
    <v-card elevation="3" class="pa-6 mb-8">
      <v-card-title class="text-h5 mb-4 d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-form-select</v-icon>
        物件情報を入力
      </v-card-title>
      
      <v-row>
        <!-- 基本入力項目（常に表示） -->
        <v-col cols="12">
          <v-row>
            <!-- 設備・内装の基本情報 -->
            <v-col cols="12" md="6">
              <div class="section-group mb-6">
                <h3 class="section-title">
                  <v-icon color="orange" class="mr-2">mdi-tools</v-icon>
                  設備・内装費用
                </h3>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="formData.equipCost"
                      label="設備取得額"
                      :rules="[validationRules.nonNegative]"
                      type="number"
                      prefix="¥"
                      variant="outlined"
                      density="comfortable"
                      placeholder="3000000"
                      hint="厨房機器・空調設備等"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="formData.interiorCost"
                      label="内装取得額"
                      :rules="[validationRules.nonNegative]"
                      type="number"
                      prefix="¥"
                      variant="outlined"
                      density="comfortable"
                      placeholder="5000000"
                      hint="内装工事・家具等"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-col>

            <!-- 立地・面積情報 -->
            <v-col cols="12" md="6">
              <div class="section-group mb-6">
                <h3 class="section-title">
                  <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                  立地情報
                </h3>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="formData.unitPrice"
                      label="想定坪単価"
                      :rules="[validationRules.positiveNumber]"
                      type="number"
                      prefix="¥"
                      suffix="/坪"
                      variant="outlined"
                      density="comfortable"
                      placeholder="150000"
                      hint="近隣相場"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="formData.floorArea"
                      label="面積"
                      :rules="[validationRules.positiveNumber]"
                      type="number"
                      suffix="坪"
                      variant="outlined"
                      density="comfortable"
                      placeholder="20"
                      hint="店舗面積"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select
                      v-model="formData.locationRank"
                      :items="LOCATION_RANKS"
                      label="立地ランク"
                      variant="outlined"
                      density="comfortable"
                      hint="立地条件"
                      persistent-hint
                    ></v-select>
                  </v-col>
                </v-row>
              </div>
            </v-col>

            <!-- 売上情報 -->
            <v-col cols="12">
              <div class="section-group mb-6">
                <h3 class="section-title">
                  <v-icon color="blue" class="mr-2">mdi-cash-multiple</v-icon>
                  売上・収益情報
                </h3>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="formData.monthlySales"
                      label="月商"
                      :rules="[validationRules.positiveNumber]"
                      type="number"
                      prefix="¥"
                      variant="outlined"
                      density="comfortable"
                      placeholder="3000000"
                      hint="平均月商"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="formData.costRate"
                      label="原価率"
                      :rules="[validationRules.nonNegative]"
                      type="number"
                      suffix="%"
                      variant="outlined"
                      density="comfortable"
                      placeholder="30"
                      hint="仕入原価率"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="formData.sganda"
                      label="販管費"
                      :rules="[validationRules.nonNegative]"
                      type="number"
                      prefix="¥"
                      variant="outlined"
                      density="comfortable"
                      placeholder="500000"
                      hint="月次販管費"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>

          <!-- 詳細設定（折りたたみ式） -->
          <v-expansion-panels class="mt-6">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="d-flex align-center">
                  <v-icon color="deep-purple" class="mr-2">mdi-tune</v-icon>
                  <span class="text-h6">詳細パラメータ設定</span>
                  <v-chip size="small" color="deep-purple" variant="tonal" class="ml-3">
                    オプション
                  </v-chip>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row class="mt-4">
                  <!-- 設備詳細パラメータ -->
                  <v-col cols="12" lg="6">
                    <div class="section-group mb-6">
                      <h4 class="section-subtitle">
                        <v-icon color="orange" size="20" class="mr-2">mdi-tools</v-icon>
                        設備詳細設定
                      </h4>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">設備使用年数: {{ formData.usedEquipYr }}年</label>
                          </div>
                          <v-slider
                            v-model="formData.usedEquipYr"
                            :max="20"
                            :min="0"
                            step="1"
                            color="orange"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">新品</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">20年</span>
                            </template>
                          </v-slider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">設備償却年数: {{ formData.equipDepreciationYears }}年</label>
                          </div>
                          <v-slider
                            v-model="formData.equipDepreciationYears"
                            :min="5"
                            :max="7"
                            step="1"
                            color="orange"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">5年</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">7年</span>
                            </template>
                          </v-slider>
                        </v-col>
                        <v-col cols="12">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">設備係数: {{ formData.equipCoefficient }}</label>
                          </div>
                          <v-slider
                            v-model="formData.equipCoefficient"
                            :min="0.5"
                            :max="0.8"
                            step="0.05"
                            color="orange"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">0.5</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">0.8</span>
                            </template>
                          </v-slider>
                        </v-col>
                      </v-row>
                    </div>

                    <!-- 内装詳細パラメータ -->
                    <div class="section-group mb-6">
                      <h4 class="section-subtitle">
                        <v-icon color="purple" size="20" class="mr-2">mdi-palette</v-icon>
                        内装詳細設定
                      </h4>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">内装使用年数: {{ formData.usedInteriorYr }}年</label>
                          </div>
                          <v-slider
                            v-model="formData.usedInteriorYr"
                            :max="20"
                            :min="0"
                            step="1"
                            color="purple"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">新品</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">20年</span>
                            </template>
                          </v-slider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">内装償却年数: {{ formData.interiorDepreciationYears }}年</label>
                          </div>
                          <v-slider
                            v-model="formData.interiorDepreciationYears"
                            :min="10"
                            :max="15"
                            step="1"
                            color="purple"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">10年</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">15年</span>
                            </template>
                          </v-slider>
                        </v-col>
                        <v-col cols="12">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">内装係数: {{ formData.interiorCoefficient }}</label>
                          </div>
                          <v-slider
                            v-model="formData.interiorCoefficient"
                            :min="0.2"
                            :max="0.5"
                            step="0.05"
                            color="purple"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">0.2</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">0.5</span>
                            </template>
                          </v-slider>
                        </v-col>
                      </v-row>
                    </div>

                    <!-- 特記事項（加点・減点）を詳細設定内に移動 -->
                    <div class="section-group">
                      <h4 class="section-subtitle">
                        <v-icon color="teal" size="20" class="mr-2">mdi-scale-balance</v-icon>
                        特記事項
                      </h4>
                      <v-row>
                        <!-- 加点項目（左列） -->
                        <v-col cols="12" sm="6">
                          <div class="mb-2">
                            <h5 class="text-body-2 font-weight-medium mb-2 text-primary-darken-2">
                              <v-icon size="18" color="primary" class="mr-1">mdi-plus-circle</v-icon>
                              加点項目 (各+10%)
                            </h5>
                            <v-checkbox
                              v-for="item in BONUS_ITEMS"
                              :key="item.key"
                              v-model="formData.bonusItems"
                              :value="item.key"
                              :label="item.label"
                              :hint="item.description"
                              color="primary"
                              density="compact"
                              hide-details="auto"
                              class="mb-1"
                            ></v-checkbox>
                          </div>
                        </v-col>
                        <!-- 減点項目（右列） -->
                        <v-col cols="12" sm="6">
                          <div class="mb-2">
                            <h5 class="text-body-2 font-weight-medium mb-2 text-red-darken-2">
                              <v-icon size="18" color="red" class="mr-1">mdi-minus-circle</v-icon>
                              減点項目 (各-10%)
                            </h5>
                            <v-checkbox
                              v-for="item in PENALTY_ITEMS"
                              :key="item.key"
                              v-model="formData.penaltyItems"
                              :value="item.key"
                              :label="item.label"
                              :hint="item.description"
                              color="red"
                              density="compact"
                              hide-details="auto"
                              class="mb-1"
                            ></v-checkbox>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>

                  <!-- 売上・重み配分パラメータ -->
                  <v-col cols="12" lg="6">
                    <!-- 売上評価年数 -->
                    <div class="section-group mb-6">
                      <h4 class="section-subtitle">
                        <v-icon color="blue" size="20" class="mr-2">mdi-cash-multiple</v-icon>
                        売上評価設定
                      </h4>
                      <div class="mb-2">
                        <label class="text-body-2 font-weight-medium">売上評価年数: {{ formData.salesEvaluationYears }}年</label>
                      </div>
                      <v-slider
                        v-model="formData.salesEvaluationYears"
                        :min="2"
                        :max="3"
                        step="0.5"
                        color="blue"
                        track-color="grey-lighten-2"
                        thumb-label
                        class="mt-2"
                      >
                        <template v-slot:prepend>
                          <span class="text-caption">2年</span>
                        </template>
                        <template v-slot:append>
                          <span class="text-caption">3年</span>
                        </template>
                      </v-slider>
                    </div>

                    <!-- 重み配分 -->
                    <div class="section-group">
                      <h4 class="section-subtitle">
                        <v-icon color="deep-orange" size="20" class="mr-2">mdi-balance-scale</v-icon>
                        重み配分設定
                      </h4>
                      <v-row>
                        <v-col cols="12">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">設備重み: {{ Math.round(formData.equipmentWeight * 100) }}%</label>
                          </div>
                          <v-slider
                            v-model="formData.equipmentWeight"
                            :min="0.30"
                            :max="0.50"
                            step="0.05"
                            color="deep-orange"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">30%</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">50%</span>
                            </template>
                          </v-slider>
                        </v-col>
                        <v-col cols="12">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">立地重み: {{ Math.round(formData.locationWeight * 100) }}%</label>
                          </div>
                          <v-slider
                            v-model="formData.locationWeight"
                            :min="0.50"
                            :max="0.70"
                            step="0.05"
                            color="deep-orange"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">50%</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">70%</span>
                            </template>
                          </v-slider>
                        </v-col>
                        <v-col cols="12">
                          <div class="mb-2">
                            <label class="text-body-2 font-weight-medium">売上重み: {{ Math.round(formData.salesWeight * 100) }}%</label>
                          </div>
                          <v-slider
                            v-model="formData.salesWeight"
                            :min="0.10"
                            :max="0.20"
                            step="0.05"
                            color="deep-orange"
                            track-color="grey-lighten-2"
                            thumb-label
                            class="mt-2"
                          >
                            <template v-slot:prepend>
                              <span class="text-caption">10%</span>
                            </template>
                            <template v-slot:append>
                              <span class="text-caption">20%</span>
                            </template>
                          </v-slider>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <!-- リセットボタン -->
      <div class="text-center mt-4">
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          @click="resetForm"
        >
          <v-icon start>mdi-restore</v-icon>
          初期値にリセット
        </v-btn>
      </div>
    </v-card>

    <!-- 下段: 詳細結果表示（アコーディオン形式） -->
    <v-expansion-panels id="detailed-result" class="mt-8">
      <v-expansion-panel>
        <v-expansion-panel-title class="result-header">
          <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-chart-pie</v-icon>
              <span class="text-h6">詳細査定内訳</span>
            </div>
            <div v-if="estimateResult" class="text-h4 font-weight-bold">
              ¥{{ formatCurrency(estimateResult.totalValue) }}
            </div>
            <div v-else class="text-body-1 font-weight-medium">
              査定結果が表示されます
            </div>
          </div>
        </v-expansion-panel-title>
        
        <v-expansion-panel-text>
          <div v-if="estimateResult" class="pa-6">
            <v-row>
              <!-- 内訳表示 -->
              <v-col cols="12">
                <div class="breakdown-details">
                  <h3 class="text-h6 font-weight-bold mb-4">
                    <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
                    査定額の詳細内訳
                  </h3>
                  
                  <div class="breakdown">
                    <!-- 個別評価価値 -->
                    <div class="text-body-2 font-weight-medium mb-3 text-grey-darken-2">
                      <v-icon size="16" class="mr-1">mdi-format-list-bulleted</v-icon>
                      個別評価
                    </div>
                    
                    <div class="breakdown-item">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2">
                          <v-icon size="16" color="orange" class="mr-1">mdi-tools</v-icon>
                          設備価値
                        </span>
                        <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.equipmentValue) }}</span>
                      </div>
                      <v-progress-linear 
                        :model-value="(estimateResult.equipmentValue / estimateResult.equipmentInteriorTotal) * 100"
                        color="orange"
                        height="4"
                        rounded
                        class="mb-3"
                      ></v-progress-linear>
                    </div>

                    <div class="breakdown-item">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2">
                          <v-icon size="16" color="purple" class="mr-1">mdi-palette</v-icon>
                          内装価値
                        </span>
                        <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.interiorValue) }}</span>
                      </div>
                      <v-progress-linear 
                        :model-value="(estimateResult.interiorValue / estimateResult.equipmentInteriorTotal) * 100"
                        color="purple"
                        height="4"
                        rounded
                        class="mb-3"
                      ></v-progress-linear>
                    </div>

                    <div class="breakdown-item">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2">
                          <v-icon size="16" color="primary" class="mr-1">mdi-map-marker</v-icon>
                          立地価値
                        </span>
                        <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.locationValue) }}</span>
                      </div>
                    </div>

                    <div class="breakdown-item">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2">
                          <v-icon size="16" color="blue" class="mr-1">mdi-cash-multiple</v-icon>
                          営業価値
                        </span>
                        <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.salesValue) }}</span>
                      </div>
                    </div>

                    <!-- 重み付け後の価値 -->
                    <v-divider class="my-4"></v-divider>
                    <div class="text-body-2 font-weight-medium mb-3 text-grey-darken-2">
                      <v-icon size="16" class="mr-1">mdi-weight</v-icon>
                      重み付け後評価
                    </div>

                    <div class="breakdown-item">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2">
                          <v-icon size="16" color="deep-orange" class="mr-1">mdi-tools</v-icon>
                          設備評価 (重み{{ Math.round(formData.equipmentWeight * 100) }}%)
                        </span>
                        <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.weightedEquipmentValue) }}</span>
                      </div>
                      <v-progress-linear 
                        :model-value="(estimateResult.weightedEquipmentValue / estimateResult.subtotal) * 100"
                        color="deep-orange"
                        height="4"
                        rounded
                        class="mb-3"
                      ></v-progress-linear>
                    </div>

                    <div class="breakdown-item">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2">
                          <v-icon size="16" color="deep-orange" class="mr-1">mdi-map-marker</v-icon>
                          立地評価 (重み{{ Math.round(formData.locationWeight * 100) }}%)
                        </span>
                        <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.weightedLocationValue) }}</span>
                      </div>
                      <v-progress-linear 
                        :model-value="(estimateResult.weightedLocationValue / estimateResult.subtotal) * 100"
                        color="deep-orange"
                        height="4"
                        rounded
                        class="mb-3"
                      ></v-progress-linear>
                    </div>

                    <div class="breakdown-item">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="text-body-2">
                          <v-icon size="16" color="deep-orange" class="mr-1">mdi-cash-multiple</v-icon>
                          売上評価 (重み{{ Math.round(formData.salesWeight * 100) }}%)
                        </span>
                        <span class="font-weight-medium">¥{{ formatCurrency(estimateResult.weightedSalesValue) }}</span>
                      </div>
                      <v-progress-linear 
                        :model-value="(estimateResult.weightedSalesValue / estimateResult.subtotal) * 100"
                        color="deep-orange"
                        height="4"
                        rounded
                        class="mb-3"
                      ></v-progress-linear>
                    </div>

                    <!-- 小計 -->
                    <v-divider class="my-3"></v-divider>
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-1 font-weight-medium">小計</span>
                      <span class="text-body-1 font-weight-bold">¥{{ formatCurrency(estimateResult.subtotal) }}</span>
                    </div>

                    <!-- 加点・減点 -->
                    <div v-if="estimateResult.bonusAmount > 0" class="d-flex justify-space-between align-center mb-1">
                      <span class="text-body-2 text-primary-darken-2">
                        <v-icon size="16" color="primary" class="mr-1">mdi-plus</v-icon>
                        加点 ({{ estimateResult.details.bonusCount }}項目)
                      </span>
                      <span class="text-body-2 text-primary-darken-2 font-weight-medium">
                        +¥{{ formatCurrency(estimateResult.bonusAmount) }}
                      </span>
                    </div>

                    <div v-if="estimateResult.penaltyAmount > 0" class="d-flex justify-space-between align-center mb-3">
                      <span class="text-body-2 text-red-darken-2">
                        <v-icon size="16" color="red" class="mr-1">mdi-minus</v-icon>
                        減点 ({{ estimateResult.details.penaltyCount }}項目)
                      </span>
                      <span class="text-body-2 text-red-darken-2 font-weight-medium">
                        -¥{{ formatCurrency(estimateResult.penaltyAmount) }}
                      </span>
                    </div>

                    <!-- 最終査定額 -->
                    <v-divider class="my-3"></v-divider>
                    <div class="d-flex justify-space-between align-center">
                      <span class="text-h6 font-weight-bold">最終査定額</span>
                      <span class="text-h5 font-weight-bold text-primary">¥{{ formatCurrency(estimateResult.totalValue) }}</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
          <div v-else class="pa-8 text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chart-line</v-icon>
            <p class="text-body-1 text-grey-darken-1">
              必須項目を入力すると、<br>
              詳細な査定内訳をこちらで確認できます。
            </p>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuickEstimate } from '@/composables/useQuickEstimate'

const router = useRouter()

// 内訳表示の展開状態
const showDetailedBreakdown = ref(false)

// コンポーザブルから機能を取得
const {
  formData,
  validationRules,
  isValid,
  estimateResult,
  resetForm: resetFormData,
  generateAssessmentQuery,
  LOCATION_RANKS,
  BONUS_ITEMS,
  PENALTY_ITEMS
} = useQuickEstimate()

// 数値フォーマット関数
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ja-JP').format(value)
}

// フォームリセット
const resetForm = () => {
  resetFormData()
}

// 詳細査定ページへの遷移
const goToDetailedAssessment = async () => {
  const query = generateAssessmentQuery()
  await router.push({
    path: '/assessment',
    query
  })
}

// 詳細結果へのスクロール
const scrollToDetailedResult = () => {
  const element = document.getElementById('detailed-result')
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style scoped>
/* 査定結果の右下固定フローティングカード */
.result-floating {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  width: 320px;
  max-width: calc(100vw - 48px);
  background: white;
  border-radius: 16px !important;
  border: 2px solid #1e50a2;
}

/* パルスアニメーション（新規結果時） */
.result-pulse {
  animation: pulse-shadow 2s ease-in-out;
}

@keyframes pulse-shadow {
  0% {
    box-shadow: 0 8px 40px rgba(30, 80, 162, 0.6);
  }
  50% {
    box-shadow: 0 8px 60px rgba(30, 80, 162, 0.8);
  }
  100% {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  }
}

.breakdown-mini {
  font-size: 0.875rem;
}

.section-group {
  border-left: 4px solid #e0e0e0;
  padding-left: 16px;
  margin-left: 8px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  color: #424242;
}

.section-subtitle {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  color: #616161;
}

.result-header {
  background: linear-gradient(135deg, #1e50a2 0%, #4d7dc8 100%);
  color: white;
  padding: 16px 24px;
}

.breakdown-item {
  margin-bottom: 16px;
}

.breakdown-item:last-child {
  margin-bottom: 0;
}

.breakdown-details {
  max-width: 800px;
  margin: 0 auto;
}

/* アコーディオンパネルのスタイル */
:deep(.v-expansion-panel) {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-expansion-panel-title) {
  padding: 20px 24px !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}

/* モバイル対応 */
@media (max-width: 600px) {
  .result-floating {
    width: calc(100vw - 32px);
    bottom: 16px;
    right: 16px;
    left: 16px;
  }
}

/* レスポンシブ調整 */
@media (max-width: 960px) {
  .section-group {
    margin-left: 0;
    border-left: none;
    border-top: 4px solid #e0e0e0;
    padding-left: 0;
    padding-top: 16px;
  }
}

/* プログレスバーのカスタマイズ */
:deep(.v-progress-linear__determinate) {
  transition: width 0.5s ease;
}
</style>