import { ref, computed, reactive } from 'vue'

// 🔧 定数テーブル - 係数変更時はここを修正
const CONSTANTS = {
  // 【設備評価法】減価償却年数・係数
  EQUIPMENT: {
    DEPRECIATION_YEARS_MIN: 5,
    DEPRECIATION_YEARS_MAX: 7,
    COEFFICIENT_MIN: 0.5,
    COEFFICIENT_MAX: 0.8
  },
  INTERIOR: {
    DEPRECIATION_YEARS_MIN: 10,
    DEPRECIATION_YEARS_MAX: 15,
    COEFFICIENT_MIN: 0.2,
    COEFFICIENT_MAX: 0.5
  },
  
  // 【立地評価法】立地基礎点
  LOCATION_BASE_POINTS: {
    '1A': 6, // 1等地A
    '1B': 5, // 1等地B
    '2A': 4, // 2等地A
    '2B': 3, // 2等地B
    '3A': 2, // 3等地A
    '3B': 1  // 3等地B
  } as const,
  
  // 面積補正係数
  AREA_MULTIPLIERS: {
    SMALL: { max: 20, multiplier: 2.0 },    // 1-20坪
    MEDIUM: { max: 50, multiplier: 1.5 },   // 20-50坪
    LARGE: { multiplier: 1.2 }              // 50坪以上
  },
  
  // 【重み配分】範囲
  WEIGHT_RANGES: {
    EQUIPMENT: { min: 0.30, max: 0.50 },
    LOCATION: { min: 0.50, max: 0.70 },
    SALES: { min: 0.10, max: 0.20 }
  },
  
  // 【売上評価法】評価年数
  SALES_EVALUATION_YEARS: { min: 2, max: 3 },
  
  // 加点・減点の影響率（各項目あたり）
  BONUS_PENALTY_RATE: 0.10
} as const

// 立地ランクの選択肢（正式版）
export const LOCATION_RANKS = [
  { value: '1A', title: '1等地A - 最高立地（駅前・繁華街中心）', basePoint: 6 },
  { value: '1B', title: '1等地B - 最高立地（やや条件良）', basePoint: 5 },
  { value: '2A', title: '2等地A - 優良立地（駅近・メイン通り）', basePoint: 4 },
  { value: '2B', title: '2等地B - 優良立地（やや条件良）', basePoint: 3 },
  { value: '3A', title: '3等地A - 普通立地（住宅地・郊外）', basePoint: 2 },
  { value: '3B', title: '3等地B - 普通立地（条件限定的）', basePoint: 1 }
] as const

// 加点項目（正式版）
export const BONUS_ITEMS = [
  { key: 'heavyDining', label: '重飲食可', description: '焼肉・ラーメン等の調理可能' },
  { key: 'highRating', label: '食べログ3.5以上', description: '高評価の実績店舗' },
  { key: 'greaseTrap', label: 'グリストラップあり', description: '排水処理設備完備' },
  { key: 'rooftopDuct', label: 'ダクト屋上まで設置', description: '本格的な排気設備' },
  { key: 'specialEquipment', label: '専門設備・内装あり', description: '焼肉・ラーメン等専用設備' }
] as const

// 減点項目（正式版）
export const PENALTY_ITEMS = [
  { key: 'lightDiningOnly', label: '軽飲食のみ', description: '調理に制限あり' },
  { key: 'businessRestriction', label: '業種制限あり', description: '営業可能業種に制限' },
  { key: 'timeRestriction', label: '営業時間制限あり', description: '営業時間に制限' },
  { key: 'equipmentFailure', label: '故障している設備あり', description: '修理・交換が必要' }
] as const

// 入力データの型定義
export interface QuickEstimateData {
  // 【設備関連】
  equipCost: number                    // 設備取得額
  usedEquipYr: number                 // 設備使用年数
  equipDepreciationYears: number      // 設備償却年数（5-7年）
  equipCoefficient: number            // 設備係数（0.5-0.8）
  
  // 【内装関連】
  interiorCost: number                // 内装取得額
  usedInteriorYr: number             // 内装使用年数
  interiorDepreciationYears: number   // 内装償却年数（10-15年）
  interiorCoefficient: number         // 内装係数（0.2-0.5）
  
  // 【立地関連】
  unitPrice: number                   // 想定坪単価
  floorArea: number                   // 面積（坪）
  locationRank: keyof typeof CONSTANTS.LOCATION_BASE_POINTS  // 立地ランク
  
  // 【売上関連】
  monthlySales: number               // 月商
  costRate: number                   // 原価率（%）
  sganda: number                     // 販管費
  salesEvaluationYears: number       // 売上評価年数（2-3年）
  
  // 【重み配分】
  equipmentWeight: number            // 設備評価の重み（30-50%）
  locationWeight: number             // 立地評価の重み（50-70%）
  salesWeight: number                // 売上評価の重み（10-20%）
  
  // 【加点・減点】
  bonusItems: string[]
  penaltyItems: string[]
}

// 査定結果の型定義
export interface EstimateResult {
  // 【個別評価】
  equipmentValue: number      // 設備価値
  interiorValue: number       // 内装価値
  equipmentInteriorTotal: number  // 設備+内装合計
  locationValue: number       // 立地価値
  salesValue: number          // 営業価値（売上価値）
  
  // 【重み付け後の価値】
  weightedEquipmentValue: number
  weightedLocationValue: number
  weightedSalesValue: number
  
  // 【小計】
  subtotal: number
  
  // 【調整】
  bonusAmount: number
  penaltyAmount: number
  
  // 【最終金額】
  totalValue: number
  
  // 【詳細情報】
  details: {
    // 設備計算詳細
    equipmentDepreciationRate: number    // 設備減価償却率
    interiorDepreciationRate: number     // 内装減価償却率
    
    // 立地計算詳細
    locationBasePoint: number            // 立地基礎点
    areaMultiplier: number              // 面積補正係数
    finalLocationCoefficient: number     // 最終立地係数
    
    // 売上計算詳細
    monthlyProfit: number               // 月次営業利益
    
    // 重み配分
    equipmentWeight: number
    locationWeight: number
    salesWeight: number
    
    // 加点・減点
    bonusCount: number
    penaltyCount: number
  }
}

export const useQuickEstimate = () => {
  // 入力データの初期化
  const formData = reactive<QuickEstimateData>({
    // 設備関連
    equipCost: 3000000,        // デフォルト300万円
    usedEquipYr: 3,            // デフォルト3年使用
    equipDepreciationYears: 6, // デフォルト値（5-7年の中間）
    equipCoefficient: 0.65,    // デフォルト値（0.5-0.8の中間）
    
    // 内装関連
    interiorCost: 5000000,     // デフォルト500万円
    usedInteriorYr: 3,         // デフォルト3年使用
    interiorDepreciationYears: 12, // デフォルト値（10-15年の中間）
    interiorCoefficient: 0.35,     // デフォルト値（0.2-0.5の中間）
    
    // 立地関連
    unitPrice: 150000,         // デフォルト15万円/坪
    floorArea: 20,             // デフォルト20坪
    locationRank: '2B',        // デフォルト2等地B
    
    // 売上関連
    monthlySales: 3000000,     // デフォルト300万円
    costRate: 30,              // デフォルト30%
    sganda: 500000,            // デフォルト50万円
    salesEvaluationYears: 2.5, // デフォルト値（2-3年の中間）
    
    // 重み配分
    equipmentWeight: 0.40,  // デフォルト値（30-50%の中間）
    locationWeight: 0.60,   // デフォルト値（50-70%の中間）
    salesWeight: 0.15,      // デフォルト値（10-20%の中間）
    
    // 加点・減点
    bonusItems: [],
    penaltyItems: []
  })

  // バリデーションルール
  const validationRules = {
    required: (v: any) => !!v || 'この項目は必須です',
    nonNegative: (v: number) => v >= 0 || '0以上の値を入力してください',
    positiveNumber: (v: number) => v > 0 || '0より大きい値を入力してください'
  }

  // 入力値の妥当性チェック
  const isValid = computed(() => {
    return formData.equipCost >= 0 &&
           formData.interiorCost >= 0 &&
           formData.unitPrice > 0 &&
           formData.floorArea > 0 &&
           formData.monthlySales > 0 &&
           formData.sganda >= 0 &&
           formData.locationRank &&
           formData.equipDepreciationYears >= CONSTANTS.EQUIPMENT.DEPRECIATION_YEARS_MIN &&
           formData.equipDepreciationYears <= CONSTANTS.EQUIPMENT.DEPRECIATION_YEARS_MAX &&
           formData.interiorDepreciationYears >= CONSTANTS.INTERIOR.DEPRECIATION_YEARS_MIN &&
           formData.interiorDepreciationYears <= CONSTANTS.INTERIOR.DEPRECIATION_YEARS_MAX &&
           formData.equipCoefficient >= CONSTANTS.EQUIPMENT.COEFFICIENT_MIN &&
           formData.equipCoefficient <= CONSTANTS.EQUIPMENT.COEFFICIENT_MAX &&
           formData.interiorCoefficient >= CONSTANTS.INTERIOR.COEFFICIENT_MIN &&
           formData.interiorCoefficient <= CONSTANTS.INTERIOR.COEFFICIENT_MAX &&
           formData.salesEvaluationYears >= CONSTANTS.SALES_EVALUATION_YEARS.min &&
           formData.salesEvaluationYears <= CONSTANTS.SALES_EVALUATION_YEARS.max &&
           formData.equipmentWeight >= CONSTANTS.WEIGHT_RANGES.EQUIPMENT.min &&
           formData.equipmentWeight <= CONSTANTS.WEIGHT_RANGES.EQUIPMENT.max &&
           formData.locationWeight >= CONSTANTS.WEIGHT_RANGES.LOCATION.min &&
           formData.locationWeight <= CONSTANTS.WEIGHT_RANGES.LOCATION.max &&
           formData.salesWeight >= CONSTANTS.WEIGHT_RANGES.SALES.min &&
           formData.salesWeight <= CONSTANTS.WEIGHT_RANGES.SALES.max
  })

  /**
   * 簡易査定の計算を実行（正式版）
   * @param data 入力データ
   * @returns 査定結果
   */
  const calculateQuickEstimate = (data: QuickEstimateData): EstimateResult => {
    // 🔧 【設備価値の計算】残存価値方式（使用年数多い=価値低下）
    // 残存価値率 = (償却年数 - 使用年数) ÷ 償却年数
    const equipmentRemainRate = Math.max(0, (data.equipDepreciationYears - data.usedEquipYr) / data.equipDepreciationYears)
    // 設備価値 = 設備費用 × 残存価値率 × 係数
    const equipmentValue = data.equipCost * equipmentRemainRate * data.equipCoefficient

    // 🔧 【内装価値の計算】残存価値方式（使用年数多い=価値低下）
    // 残存価値率 = (償却年数 - 使用年数) ÷ 償却年数  
    const interiorRemainRate = Math.max(0, (data.interiorDepreciationYears - data.usedInteriorYr) / data.interiorDepreciationYears)
    // 内装価値 = 内装費用 × 残存価値率 × 係数
    const interiorValue = data.interiorCost * interiorRemainRate * data.interiorCoefficient

    // 設備+内装合計
    const equipmentInteriorTotal = equipmentValue + interiorValue

    // 🔧 【立地価値の計算】正式公式
    // 立地基礎点を取得
    const locationBasePoint = CONSTANTS.LOCATION_BASE_POINTS[data.locationRank]
    
    // 面積補正係数の決定
    let areaMultiplier: number
    if (data.floorArea <= CONSTANTS.AREA_MULTIPLIERS.SMALL.max) {
      areaMultiplier = CONSTANTS.AREA_MULTIPLIERS.SMALL.multiplier
    } else if (data.floorArea <= CONSTANTS.AREA_MULTIPLIERS.MEDIUM.max) {
      areaMultiplier = CONSTANTS.AREA_MULTIPLIERS.MEDIUM.multiplier
    } else {
      areaMultiplier = CONSTANTS.AREA_MULTIPLIERS.LARGE.multiplier
    }
    
    // 最終立地係数 = 立地基礎点 × 面積補正係数
    const finalLocationCoefficient = locationBasePoint * areaMultiplier
    
    // 立地価値 = 想定坪単価 × 坪数 × 最終立地係数
    const locationValue = data.unitPrice * data.floorArea * finalLocationCoefficient

    // 🔧 【営業価値の計算】正式公式
    // 月次営業利益 = 月商 - (月商 × 原価率) - 販管費
    const monthlyProfit = Math.max(0, 
      data.monthlySales - (data.monthlySales * data.costRate / 100) - data.sganda
    )
    // 営業価値 = 月次営業利益 × 12ヶ月 × 評価年数
    const salesValue = monthlyProfit * 12 * data.salesEvaluationYears
    
    // デバッグ用ログ
    console.log('営業価値計算デバッグ:', {
      monthlySales: data.monthlySales,
      costRate: data.costRate,
      sganda: data.sganda,
      salesEvaluationYears: data.salesEvaluationYears,
      monthlyProfit,
      salesValue
    })

    // 🔧 【重み付け後の価値計算】
    const weightedEquipmentValue = equipmentInteriorTotal * data.equipmentWeight
    const weightedLocationValue = locationValue * data.locationWeight  
    const weightedSalesValue = salesValue * data.salesWeight

    // 🔧 小計（重み付け合計）
    const subtotal = weightedEquipmentValue + weightedLocationValue + weightedSalesValue

    // 🔧 【加点・減点の計算】
    const bonusCount = data.bonusItems.length
    const penaltyCount = data.penaltyItems.length
    
    const bonusAmount = subtotal * bonusCount * CONSTANTS.BONUS_PENALTY_RATE
    const penaltyAmount = subtotal * penaltyCount * CONSTANTS.BONUS_PENALTY_RATE

    // 🔧 【最終査定額の算出】
    const totalValue = Math.max(0, subtotal + bonusAmount - penaltyAmount)

    return {
      // 個別評価
      equipmentValue: Math.round(equipmentValue),
      interiorValue: Math.round(interiorValue),
      equipmentInteriorTotal: Math.round(equipmentInteriorTotal),
      locationValue: Math.round(locationValue),
      salesValue: Math.round(salesValue),
      
      // 重み付け後の価値
      weightedEquipmentValue: Math.round(weightedEquipmentValue),
      weightedLocationValue: Math.round(weightedLocationValue),
      weightedSalesValue: Math.round(weightedSalesValue),
      
      // 小計・調整・最終金額
      subtotal: Math.round(subtotal),
      bonusAmount: Math.round(bonusAmount),
      penaltyAmount: Math.round(penaltyAmount),
      totalValue: Math.round(totalValue),
      
      // 詳細情報
      details: {
        equipmentDepreciationRate: Math.round(equipmentRemainRate * 100) / 100,
        interiorDepreciationRate: Math.round(interiorRemainRate * 100) / 100,
        locationBasePoint,
        areaMultiplier,
        finalLocationCoefficient,
        monthlyProfit: Math.round(monthlyProfit),
        equipmentWeight: data.equipmentWeight,
        locationWeight: data.locationWeight,
        salesWeight: data.salesWeight,
        bonusCount,
        penaltyCount
      }
    }
  }

  // リアルタイム計算結果
  const estimateResult = computed(() => {
    if (!isValid.value) return null
    return calculateQuickEstimate(formData)
  })

  // フォームリセット（初期値に戻す）
  const resetForm = () => {
    Object.assign(formData, {
      // 設備関連
      equipCost: 3000000,
      usedEquipYr: 3,
      equipDepreciationYears: 6,
      equipCoefficient: 0.65,
      
      // 内装関連
      interiorCost: 5000000,
      usedInteriorYr: 3,
      interiorDepreciationYears: 12,
      interiorCoefficient: 0.35,
      
      // 立地関連
      unitPrice: 150000,
      floorArea: 20,
      locationRank: '2B',
      
      // 売上関連
      monthlySales: 3000000,
      costRate: 30,
      sganda: 500000,
      salesEvaluationYears: 2.5,
      
      // 重み配分
      equipmentWeight: 0.40,
      locationWeight: 0.60,
      salesWeight: 0.15,
      
      // 加点・減点
      bonusItems: [],
      penaltyItems: []
    })
  }

  // 詳細査定ページへの遷移用クエリ生成
  const generateAssessmentQuery = () => {
    return {
      // 設備関連
      equipCost: formData.equipCost,
      usedEquipYr: formData.usedEquipYr,
      equipDepreciationYears: formData.equipDepreciationYears,
      equipCoefficient: formData.equipCoefficient,
      
      // 内装関連
      interiorCost: formData.interiorCost,
      usedInteriorYr: formData.usedInteriorYr,
      interiorDepreciationYears: formData.interiorDepreciationYears,
      interiorCoefficient: formData.interiorCoefficient,
      
      // 立地関連
      unitPrice: formData.unitPrice,
      floorArea: formData.floorArea,
      locationRank: formData.locationRank,
      
      // 売上関連
      monthlySales: formData.monthlySales,
      costRate: formData.costRate,
      sganda: formData.sganda,
      salesEvaluationYears: formData.salesEvaluationYears,
      
      // 重み配分
      equipmentWeight: formData.equipmentWeight,
      locationWeight: formData.locationWeight,
      salesWeight: formData.salesWeight,
      
      // 加点・減点
      bonusItems: formData.bonusItems.join(','),
      penaltyItems: formData.penaltyItems.join(',')
    }
  }

  return {
    formData,
    validationRules,
    isValid,
    estimateResult,
    calculateQuickEstimate,
    resetForm,
    generateAssessmentQuery,
    // 定数をエクスポート
    LOCATION_RANKS,
    BONUS_ITEMS,
    PENALTY_ITEMS
  }
}