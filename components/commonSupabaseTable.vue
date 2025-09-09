<template>
  <v-container>
    <v-dialog v-model="addDialog" class="mx-auto">
      <v-card :width="dialogWidth" class="mx-auto pt-2 px-2">
        <v-card-title class="d-flex">
          {{addItem.id ? "編集" : "新規追加"}}
          <v-spacer></v-spacer>
          <v-btn variant="text" icon="mdi-close-circle-outline" @click="addDialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col :cols="editItem.cols" v-for="editItem in defineEditItems" class="py-1">
              <v-responsive :width="editItem.width ? editItem.width : '100%'" class="py-2">
                <v-text-field :disabled="editItem.disabled" v-if="editItem.type == 'text'" v-model="addItem[editItem.name]" :label="editItem.label"></v-text-field>
                <v-text-field :disabled="editItem.disabled" v-if="editItem.type == 'number'" type="number" v-model="addItem[editItem.name]" :label="editItem.label"></v-text-field>
                <v-textarea :disabled="editItem.disabled" v-else-if="editItem.type == 'textarea'" v-model="addItem[editItem.name]" :label="editItem.label"></v-textarea>
                <v-select :disabled="editItem.disabled" v-else-if="editItem.type == 'select'" v-model="addItem[editItem.name]" :label="editItem.label" :items="editItem.options"></v-select>
                <v-checkbox :disabled="editItem.disabled" v-else-if="editItem.type == 'checkbox'" v-model="addItem[editItem.name]" :label="editItem.label"></v-checkbox>
                <TextfieldDatepicker :disabled="editItem.disabled" v-model="addItem[editItem.name]" v-else-if="editItem.type == 'date'" :label="editItem.label"></TextfieldDatepicker>
                <!-- <DraggableImageInput v-else-if="editItem.type=='image'" v-model="addItem[editItem.name]"></DraggableImageInput> -->
              </v-responsive>
            </v-col>
          </v-row>
          <v-row class="mb-1 mt-8">
            <v-col>
              <v-btn block color="primary" @click="submitItem">保存</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div class="d-flex mt-4">
      <h2 v-if="title">{{ title }}</h2>
      <v-spacer></v-spacer>
      <!-- <v-btn @click="onClickAddItem">新規追加</v-btn> -->
    </div>
    <v-row class="my-4" v-if="countSearchableItems()">
      <v-col cols="12">
        <h3>検索</h3>
      </v-col>
      <template v-for="head in headers">
        <v-col cols="3" v-if="head.search" class="py-1">
          <v-text-field v-if="head.search == 'text'" v-model="search[head.value].value" :label="head.title"></v-text-field>
          <v-select v-else-if="head.search == 'select'" v-model="search[head.value].value" :label="head.title" :items="head.options"></v-select>
          <div v-else-if="head.search == 'datetime-range'" class="d-flex align-center">
            <v-text-field v-model="search[head.value].startValue" :label="`${head.title}開始`"></v-text-field>
            <p class="mx-1">〜</p>
            <v-text-field v-model="search[head.value].endValue" :label="`${head.title}終了`"></v-text-field>
          </div>
        </v-col>
      </template>
    </v-row>
    <v-data-table class="pt-6" v-if="headers && datas" :items-per-page="-1" :headers="headers" :items="datas" :custom-filter="filterItems" :search="combinedSearch()">
      
      <template v-slot:[`item.${header.value}`]="{item}" v-for="header in headers">
        <div v-if="header.value=='actions'">
          <!-- slotがあればslot優先 -->
          <slot name="item.actions" :item="item">
            <!-- slotがなければ従来の操作UI -->
            <v-btn v-if="!selectMode" variant="text" @click="onClickEditItem(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-if="!selectMode" color="error" variant="text" @click="onClickDeleteItem(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn v-if="selectMode" variant="text" @click="props.onSelectItem(item)">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </slot>
        </div>
        <div v-else-if="header.customFilter">
          {{ item ? header.customFilter(item, header.value) : "" }}
        </div>
        <div v-else-if="header.options">
          {{ optionFilter(item[header.value],header.options) }}
        </div>
        <div v-else>
          {{ item[header.value]}}
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { useDayjs } from '#dayjs' // not need if you are using auto import
const dayjs = useDayjs()
const { $supabase } = useNuxtApp();
const props = defineProps({
  tableName: {
    type: String,
    required: true
  },
  headers: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ""
  },
  select: {
    type: String,
    default: "*"
  },
  dialogWidth: {
    type: String,
    default: "800px"
  },
  defineEditItems: {
    type: Array,
    default: () => []
  },
  selectMode: {
    type: Boolean,
    default: false
  },
  onSelectItem: {
    type: Function
  },
  sortBy: {
    type: String,
    default: ''
  },
  sortDesc: {
    type: Boolean,
    default: false
  },
  updateItemsFunction: {
    type: Function,
    default: async (supabase, tableName, select) => {
      const { data } = await supabase
        .from(tableName)
        .select(select)
        .order('updated_at', { ascending: false }); // ここ追加
      return data;
    }
  }
})

// headersにactionsがなければ追加する
if(!props.headers.find(header => header.value == 'actions')){
  if(props.selectMode) {
    props.headers.push({title: '選択', value: 'actions', sortable: false, align: 'center'});
  } else {
    props.headers.push({title: '操作', value: 'actions', sortable: false, align: 'center'});
  }
}

const addDialog = ref(false);
const datas = ref([]);
const addItem = ref({});
const search = ref({});

for(const item of props.defineEditItems) {
  if(item.type == "blank") continue;
  addItem.value[item.name] = item.default;
}
for(const head of props.headers) {
  if(head.search){
    search.value[head.value] = {};
    search.value[head.value].type = head.search;
    if(head.search == "datetime_range"){
      search.value[head.value].startValue = null;
      search.value[head.value].endValue = null;
    }else{
      search.value[head.value].value = null;
    }
  }
}

async function updateItems() {
  const data = await props.updateItemsFunction($supabase, props.tableName, props.select);
  // console.log("update",data)
  for(const item of props.defineEditItems) {
    if(item.type == "date"){
      for(const index in data) {
        if(!data[index][item.name]){
          data[index][item.name] = null;
        }else{
          data[index][item.name] = new Date(data[index][item.name])
        }
      }
    }
  }

  // console.log(data)
  if(!data) return;
  datas.value = data;
}

onMounted(() => {
  updateItems()
});

async function submitItem() {
  for(const key of Object.keys(addItem.value)){
    // defineEditItemsでsubmitTransformが設定されている場合は実行する
    const defineEditItem = props.defineEditItems.find(defineEditItem => defineEditItem.name == key);
    if(defineEditItem){
      if(defineEditItem.submitTransform){
        addItem.value[key] = defineEditItem.submitTransform(addItem.value, key);
      }
      if(defineEditItem.type == "date"){
        if(addItem.value[key] === ""){
          addItem.value[key] = null;
        }
      }
    }
  }

  let tmpItems = {}
  for(const key of Object.keys(addItem.value)){
    if(key == "id" || props.defineEditItems.find(defineEditItem => defineEditItem.name && defineEditItem.name == key)) {
      tmpItems[key] = addItem.value[key];
    };
  }

  const { data, error } = await $supabase.from(props.tableName).upsert(tmpItems);

  if(error) {
    console.error(error);
    alert("エラーが発生しました");
    addDialog.value = false;
  }else{
    updateItems();
    addDialog.value = false;
  }
}

function formatToDateString(date) {
  if(!date) return "";
  return dayjs(date).format('YYYY-MM-DD')
}

function onClickAddItem() {
  addItem.value = {};
  for(const item of props.defineEditItems) {
    if(item.type == "blank") continue;
    addItem.value[item.name] = item.default;
  }
  addDialog.value = true;
}

function onClickEditItem(item) {
  addItem.value = {...item};
  addDialog.value = true;
}

async function onClickDeleteItem(item) {
  if(confirm("削除しますか？")){
    await $supabase.from(props.tableName).delete().eq('id', item.id);
    updateItems();
  }
}

function optionFilter(item, options){
  const option = options.find(option => option.value == item);
  return option ? option.title : "";
}

function countSearchableItems() {
  return Object.keys(search.value).length;
}

function combinedSearch(){
  return Object.keys(search.value).map(key =>{    
    if(search.value[key] && search.value[key].type == "datetime_range"){
      return search.value[key].startValue + search.value[key].endValue
    }
    if(search.value[key] && search.value[key].value){
      return String(search.value[key].value)
    }
    return ""
  }).join("");
}

function filterItems(value, query, item) {
  for(const key in search.value) {
    let target = item.raw[key];
    // keyを元にheaderを取得
    const header = props.headers.find(header => header.value == key);
    if(header && header.customFilter){
      target = header.customFilter(item.raw, key);
    }

    if(search.value[key].type == "text"){
      if(search.value[key].value && (!String(target).length || String(target).indexOf(search.value[key].value)) == -1){
        return false;
      }
    }
    if(search.value[key].type == "select"){
      if(search.value[key].value && target != search.value[key].value){
        return false;
      }
    }
    if(search.value[key].type == "datetime"){
      if(search.value[key].value && target != search.value[key].value){
        return false;
      }
    }
    if(search.value[key].type == "datetime_range"){
      if(search.value[key].startValue){
        if(!target.length){
          return false;
        }
        if(dayjs(target).isBefore(dayjs(search.value[key].startValue))){
          return false;
        }
      }
      if(search.value[key].endValue){
        if(!target.length){
          return false;
        }
        if(dayjs(target).isAfter(dayjs(search.value[key].endValue))){
          return false;
        }
      }
    }
  }
  return true;
}
</script>
