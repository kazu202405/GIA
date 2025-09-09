<!-- pages/form/[id].vue -->
<template>
  <v-container fluid class="fill-height clean-background">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="7">
        <v-card class="pa-8 pa-md-10 form-card-modern" elevation="6" rounded="lg">
          <v-card-title class="text-h4 text-md-h3 text-center mb-6 font-weight-bold text-grey-darken-3">
            <v-icon size="40" class="mr-3 text-blue-grey-darken-1">mdi-domain</v-icon>
            {{ formId ? '会社情報表示' : '会社情報登録' }}
          </v-card-title>

          <!-- タブヘッダー -->
          <v-tabs
            v-model="step"
            grow
            color="primary"
            background-color="blue-grey-lighten-5"
            class="mb-4"
          >
            <v-tab :value="1">会社情報</v-tab>
            <v-tab :value="2">従業員数</v-tab>
            <v-tab :value="3">補助金実績</v-tab>
            <v-tab :value="4">事業計画</v-tab>
            <v-tab :value="5">書類提出</v-tab>
          </v-tabs>

          <!-- タブの内容 -->
          <v-window v-model="step" class="mb-6">
            <v-window-item :value="1">
              <div id="section-basic">
                <FormStep1 :form-id="formId" v-model:formState="formState" />
              </div>
            </v-window-item>

            <v-window-item :value="2">
              <div id="section-employee">
                <FormStep2 :form-id="formId" v-model="formState.regular_employees" />
              </div>
            </v-window-item>

            <v-window-item :value="3">
              <div id="section-subsidy">
                <FormStep3 v-model="formState.past_subsidies" />
              </div>
            </v-window-item>

            <v-window-item :value="4">
              <div id="section-plan">
                <FormStep4 :form-id="formId" v-model="formState.plan" />
              </div>
            </v-window-item>

            <v-window-item :value="5">
              <div id="section-docs">
                <FormStep5 :form-id="formId" />
              </div>
            </v-window-item>
          </v-window>

          <!-- 次へ・戻る -->
          <v-card-actions class="pt-6 px-2">
            <v-btn
              @click="prevStep"
              :disabled="step === 1"
              color="grey"
              variant="elevated"
              class="ml-2 mb-2"
            >
              戻る
            </v-btn>
            <v-spacer />
            <v-btn
              @click="nextStep"
              :disabled="step === 5"
              color="grey"
              variant="elevated"
              class="mr-2 mb-2 text-white"
            >
              次へ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- スナックバー -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>


<script setup>
import { ref, watch , onMounted, reactive} from 'vue'
import { useRoute } from 'vue-router'
import debounce from 'lodash/debounce'
import FormStep1 from '~/components/form/FormStep1.vue'
import FormStep2 from '~/components/form/FormStep2.vue'
import FormStep3 from '~/components/form/FormStep3.vue'
import FormStep4 from '~/components/form/FormStep4.vue'
import FormStep5 from '~/components/form/FormStep5.vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useNuxtApp } from '#app'

const supabase = useNuxtApp().$supabase
const { snackbar, showSnackBar } = useSnackbar()


definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const step = ref(1)

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
watch(step, async (newVal) => {
  await nextTick()
  const map = {
    1: 'section-basic',
    2: 'section-employee',
    3: 'section-subsidy',
    4: 'section-plan',
    5: 'section-docs'
  }
  const id = map[newVal]
  if (id) scrollTo(id)
})




const formId = ref(route.params.id || route.query.id || null)

// setupスクリプト内の formState に追加
const formState = reactive({
  regular_employees: {
    employee_count: null,
    employment_status_note: '',
  },
  past_subsidies: [],
  plan: {
    plan_title: '',
    plan_summary: '',
    is_equipment_purchase: false,
    is_equipment_dev: false,
    is_system_purchase: false,
    is_system_dev: false,
    equipment_names: '',
    business_area_type: '',
    plan_background: '',
    plan_company_strategy: '',
    plan_actions: '',
    plan_expenses: '',
    plan_innovation: '',
    plan_market_effect: '',
    plan_wage_increase: '',
    plan_local_contribution: '',
  }
})




// 自動保存関数
const saveForm = async () => {
  try {
    console.log('保存処理：', formState)

    const {
      regular_employees,
      ...basicInfoData
    } = formState

    const { error } = await supabase
      .from('basic_info')
      .upsert(basicInfoData, { onConflict: ['id'] }) // 念のため主キー指定（安全）

    if (error) throw error

    showSnackBar('情報を保存しました')
  } catch (err) {
    console.error('保存エラー：', err)
    showSnackBar('保存に失敗しました')
  }
}

const saveEmployees = async () => {
  try {
    const data = {
      ...formState.regular_employees,
      basic_info_id: formId.value,
    }

    if (!data.id) {
      data.id = uuidv4()
    }

    const { error } = await supabase.from('regular_employees').upsert(data, {
      onConflict: ['id']
    })

    if (error) throw error

    showSnackBar('情報を保存しました')
  } catch (err) {
    console.error('保存エラー：', err)
    showSnackBar('保存に失敗しました')
  }
}

const saveSubsidies = async () => {
  try {
    const currentIds = formState.past_subsidies.map(s => s.id).filter(Boolean)

    const { data: existing, error: fetchError } = await supabase
      .from('past_subsidies')
      .select('id')
      .eq('basic_info_id', formId.value)

    if (fetchError) throw fetchError

    const existingIds = existing.map(s => s.id)
    const idsToDelete = existingIds.filter(id => !currentIds.includes(id))

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('past_subsidies')
        .delete()
        .in('id', idsToDelete)

      if (deleteError) throw deleteError
    }

    const dataToSave = formState.past_subsidies.map((s) => ({
      ...s,
      id: s.id || uuidv4(),
      basic_info_id: formId.value
    }))

    const { error } = await supabase
      .from('past_subsidies')
      .upsert(dataToSave, { onConflict: ['id'] })

    if (error) throw error

    showSnackBar('補助金情報を保存しました')
  } catch (err) {
    console.error('補助金保存エラー：', err)
    showSnackBar('保存に失敗しました')
  }
}

const savePlan = async () => {
  try {
    const data = {
      ...formState.plan,
      basic_info_id: formId.value,
    }

    if (!data.id) data.id = uuidv4()

    const { error } = await supabase
      .from('business_plan')
      .upsert(data, { onConflict: ['id'] })

    if (error) throw error

    showSnackBar('事業計画を保存しました')
  } catch (err) {
    console.error('事業計画保存エラー：', err)
    showSnackBar('保存に失敗しました')
  }
}


const saveFunctions = {
  basic_info: saveForm,
  regular_employees: saveEmployees,
  past_subsidies: saveSubsidies,
  plan: savePlan,
}

Object.entries(saveFunctions).forEach(([key, fn]) => {
  watch(() => formState[key], () => debounce(fn, 2000)(), { deep: true })
})


// ステップ遷移時の保存
const nextStep = async () => {
  await saveForm()
  if (step.value < 5) step.value++
}
const prevStep = async () => {
  await saveForm()
  if (step.value > 1) step.value--
}

// Supabaseからデータが来たら上書き
onMounted(async () => {
  if (formId.value) {
    // 従業員データの読み込み
    const { data: employeeData } = await supabase
      .from('regular_employees')
      .select('*')
      .eq('basic_info_id', formId.value)
      .maybeSingle()

    if (employeeData) {
      formState.regular_employees = employeeData
    }

    // 補助金データの読み込み
    const { data: subsidyData } = await supabase
      .from('past_subsidies')
      .select('*')
      .eq('basic_info_id', formId.value)

    if (subsidyData) {
      formState.past_subsidies = subsidyData
    }

    // 事業計画データの読み込み
    const { data: planData } = await supabase
      .from('business_plan')
      .select('*')
      .eq('basic_info_id', formId.value)
      .maybeSingle()

    if (planData) {
      formState.plan = planData
    }
  }
})



</script>

<style scoped>
.clean-background {
  background-color: #f5f7fa; /* Very light, clean background */
  /* background: linear-gradient(135deg, #f5f7fa 0%, #e0e6ed 100%); */ /* Subtle gradient */
}

.form-card-modern {
  background-color: #ffffff; /* Pure white card */
  border: 1px solid #e0e0e0; /* Light border */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Softer shadow */
  transition: all 0.3s ease-in-out;
}

.form-card-modern:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12); /* Slightly more pronounced hover shadow */
}

.text-grey-darken-3 {
  color: #424242 !important; /* Darker grey for titles */
}

.text-blue-grey-darken-1 {
  color: #546e7a !important; /* Muted blue-grey for icons */
}

.submit-button-modern {
  letter-spacing: 0.5px;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
}

.submit-button-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.8rem !important;
  }
  .text-subtitle-1 {
    font-size: 0.85rem !important;
  }
}
</style>