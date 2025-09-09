<template>
  <v-container fluid class="fill-height clean-background">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="7">
        <v-card class="pa-8 pa-md-10 form-card-modern" elevation="6" rounded="lg">
          <v-card-title class="text-h4 text-md-h3 text-center mb-6 font-weight-bold text-grey-darken-3">
            <v-icon size="40" class="mr-3 text-blue-grey-darken-1">mdi-domain</v-icon>
            {{ formId ? '会社情報表示' : '会社情報登録' }}
          </v-card-title>
          <v-card-subtitle class="text-center mb-8 text-subtitle-1 text-md-h6 text-grey-darken-1">
            {{ formId ? '登録済みの会社情報を表示します。' : '会社情報を入力してください。' }}
          </v-card-subtitle>

          <!-- IDがある場合（表示モード） -->
          <div v-if="formId">
            <div v-if="formData">
              <v-text-field
                label="商号 (会社名)"
                :model-value="formData.company_name"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-office-building"
                readonly
                class="mb-5"
              />
              <v-text-field
                label="会社法人等番号"
                :model-value="formData.corporate_number"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-numeric"
                readonly
                class="mb-5"
              />
              <v-text-field
                label="本店所在地"
                :model-value="formData.address"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-map-marker"
                readonly
                class="mb-5"
              />
              <v-text-field
                label="代表者名"
                :model-value="formData.representative_name"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-account-tie"
                readonly
                class="mb-5"
              />
              <v-text-field
                label="資本金の額"
                :model-value="formData.capital"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-currency-usd"
                readonly
                class="mb-5"
              />
              <v-text-field
                label="会社設立の年月日"
                :model-value="formData.establishment_date"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
                readonly
                class="mb-5"
              />
              <!-- <v-text-field
                label="公告をする方法"
                :model-value="formData.public_notice_method"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-bullhorn-outline"
                readonly
                class="mb-5"
              />
              <v-text-field
                label="事業年度末月"
                :model-value="formData.fiscal_year_end_month"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-calendar-month-outline"
                readonly
                class="mb-5"
              />
              <v-textarea
                label="事業目的"
                :model-value="formData.business_purpose"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-text-box-multiple-outline"
                readonly
                class="mb-5"
                rows="4"
              /> -->
              <v-text-field
                label="担当者名 (連絡先)"
                :model-value="formData.contact_person_name"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-account"
                readonly
                class="mb-5"
              />
              <v-text-field
                label="電話番号 (連絡先)"
                :model-value="formData.contact_person_phone"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-phone"
                readonly
                class="mb-5"
              />
              <v-text-field
                label="メールアドレス (連絡先)"
                :model-value="formData.contact_person_email"
                variant="filled"
                density="comfortable"
                prepend-inner-icon="mdi-email"
                readonly
                class="mb-8"
                type="email"
              />
            </div>

            <div v-else-if="loading">
              データを読み込み中です...
            </div>
            <div v-else-if="error">
              エラーが発生しました: {{ error.message || '不明なエラー' }}
            </div>
            <div v-else>
              該当する会社情報が見つかりませんでした。
            </div>
          </div>


          <!-- IDがない場合（登録モード） -->
          <v-form @submit.prevent="submitForm" v-else>
            <v-text-field
              v-model="companyName"
              label="商号 (会社名)"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-office-building"
              clearable
              required
              :rules="[v => !!v || '商号は必須です']"
              class="mb-5"
            ></v-text-field>

            <v-text-field
              v-model="companyRegistrationNumber"
              label="会社法人等番号 (12桁)"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-numeric"
              clearable
              required
              :rules="[v => !!v || '会社法人等番号は必須です', v => /^[0-9]{12}$/.test(v) || '12桁の半角数字で入力してください']"
              class="mb-5"
            ></v-text-field>

            <v-text-field
              v-model="address"
              label="本店所在地"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-map-marker"
              clearable
              required
              :rules="[v => !!v || '本店所在地は必須です']"
              class="mb-5"
            ></v-text-field>

            <v-text-field
              v-model="representativeName"
              label="代表者名 (代表取締役)"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-account-tie"
              clearable
              required
              :rules="[v => !!v || '代表者名は必須です']"
              class="mb-5"
            ></v-text-field>

            <v-text-field
              v-model="capital"
              label="資本金の額 (例: 10,000,000)"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-currency-usd"
              clearable
              required
              :rules="[v => !!v || '資本金の額は必須です', v => /^[0-9,]+$/.test(v) || '有効な数値を入力してください']"
              class="mb-5"
            ></v-text-field>

            <v-text-field
              v-model="establishmentDate"
              label="会社設立の年月日 (例: 2023-01-01)"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-calendar"
              clearable
              required
              :rules="[v => !!v || '会社設立の年月日は必須です', v => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'YYYY-MM-DD形式で入力してください']"
              class="mb-5"
            ></v-text-field>

            <v-select
              v-model="publicNoticeMethod"
              label="公告をする方法"
              :items="['電子公告', '官報', '日刊新聞紙']"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-bullhorn-outline"
              clearable
              required
              :rules="[v => !!v || '公告をする方法は必須です']"
              class="mb-5"
            ></v-select>

            <v-select
              v-model="fiscalYearEndMonth"
              label="事業年度末月"
              :items="['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-month-outline"
              clearable
              required
              :rules="[v => !!v || '事業年度末月は必須です']"
              class="mb-5"
            ></v-select>

            <v-textarea
              v-model="businessPurpose"
              label="事業目的"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-text-box-multiple-outline"
              clearable
              rows="4"
              class="mb-5"
            ></v-textarea>

            <v-text-field
              v-model="contactPerson"
              label="担当者名 (連絡先)"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-account"
              clearable
              required
              :rules="[v => !!v || '担当者名は必須です']"
              class="mb-5"
            ></v-text-field>

            <v-text-field
              v-model="phoneNumber"
              label="電話番号 (連絡先)"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-phone"
              clearable
              required
              :rules="[v => !!v || '電話番号は必須です', v => /^[0-9-]+$/.test(v) || '有効な電話番号を入力してください']"
              class="mb-5"
            ></v-text-field>

            <v-text-field
              v-model="email"
              label="メールアドレス (連絡先)"
              variant="filled"
              density="comfortable"
              prepend-inner-icon="mdi-email"
              clearable
              required
              type="email"
              :rules="[v => !!v || 'メールアドレスは必須です', v => /.+@.+\..+/.test(v) || '有効なメールアドレスを入力してください']"
              class="mb-8"
            ></v-text-field>

            <v-btn
              type="submit"
              color="blue-grey-darken-2"
              size="large"
              block
              class="mt-4 font-weight-medium submit-button-modern"
              elevation="2"
              rounded="md"
            >
              <v-icon left class="mr-2">mdi-check-circle-outline</v-icon>
              登録情報を送信
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid'

const newId = uuidv4()



// For dynamic route (display mode)
const route = useRoute();
console.log('params:', route.params); // これが空なら [id].vue じゃない
console.log('query:', route.query);   // ?id=... の形式ならこちらに入る

const formId = ref(route.params.id || route.query.id); // ← 両方見る
console.log('formId in setup:', formId.value);
const supabase = useNuxtApp().$supabase
const formData = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  console.log('formId.value:', formId.value)

  if (!formId.value || typeof formId.value !== 'string') {
    console.warn('Invalid formId:', formId.value)
    error.value = new Error('IDが無効です');
    loading.value = false;
    return;
  }

  try {
    const { data, error: fetchError } = await supabase
      .from('basic_info')
      .select('*')
      .eq('id', formId.value)
      .maybeSingle();

    console.log('Supabase fetch result:', data)

    if (fetchError) throw fetchError;

    if (!data) {
      error.value = new Error('データが見つかりませんでした');
    } else {
      formData.value = data;
    }
  } catch (e) {
    error.value = e;
    console.error('Error fetching form data:', e);
  } finally {
    loading.value = false;
  }
});




// For registration form (if no ID)
definePageMeta({
  layout: 'blank',
});

const companyName = ref('');
const companyRegistrationNumber = ref('');
const address = ref('');
const representativeName = ref('');
const capital = ref('');
const establishmentDate = ref('');
const publicNoticeMethod = ref('');
const fiscalYearEndMonth = ref('');
const businessPurpose = ref('');
const contactPerson = ref('');
const phoneNumber = ref('');
const email = ref('');

const submitForm = () => {
  // 簡易的なバリデーション
  if (
    !companyName.value ||
    !companyRegistrationNumber.value ||
    !address.value ||
    !representativeName.value ||
    !capital.value ||
    !establishmentDate.value ||
    !publicNoticeMethod.value ||
    !fiscalYearEndMonth.value ||
    !contactPerson.value ||
    !phoneNumber.value ||
    !email.value
  ) {
    alert('すべての必須項目を入力してください。');
    return;
  }
  if (!/^[0-9]{12}$/.test(companyRegistrationNumber.value)) {
    alert('会社法人等番号は12桁の半角数字で入力してください。');
    return;
  }
  if (!/.+@.+\..+/.test(email.value)) {
    alert('有効なメールアドレスを入力してください。');
    return;
  }
  if (!/^[0-9-]+$/.test(phoneNumber.value)) {
    alert('有効な電話番号を入力してください。');
    return;
  }
  if (!/^[0-9,]+$/.test(capital.value)) {
    alert('資本金は有効な数値を入力してください。');
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(establishmentDate.value)) {
    alert('会社設立の年月日はYYYY-MM-DD形式で入力してください。');
    return;
  }

  alert(
    `フォームが送信されました！\n` +
    `商号: ${companyName.value}\n` +
    `会社法人等番号: ${companyRegistrationNumber.value}\n` +
    `本店所在地: ${address.value}\n` +
    `代表者名: ${representativeName.value}\n` +
    `資本金の額: ${capital.value}\n` +
    `会社設立の年月日: ${establishmentDate.value}\n` +
    `公告をする方法: ${publicNoticeMethod.value}\n` +
    `事業年度末月: ${fiscalYearEndMonth.value}\n` +
    `事業目的: ${businessPurpose.value || '未入力'}\n` +
    `担当者名(連絡先): ${contactPerson.value}\n` +
    `電話番号(連絡先): ${phoneNumber.value}\n` +
    `メールアドレス(連絡先): ${email.value}`
  );
  // ここで実際のフォーム送信処理（API連携など）を行います
};
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