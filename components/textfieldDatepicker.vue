<template>
    <v-menu :close-on-content-click="false" v-model="showDatePickerMenu">
        <template v-slot:activator="{ props }">
            <v-text-field readonly v-model="model" :append-inner-icon="appendInnerIcon" :prepend-inner-icon="prependInnerIcon" max-width="100px" :placeholder="placeholder" :label="label" v-bind="props" :value="formatDate(model)"></v-text-field>
        </template>
        <v-card>
            <v-date-picker v-model="model" @change="onDateSelected"></v-date-picker>
        </v-card>
    </v-menu>
</template>
<script setup>
import { useDayjs } from '#dayjs' // not need if you are using auto import
const dayjs = useDayjs()
const model = defineModel()
const showDatePickerMenu = ref(false)

if(model.value) {
    if(typeof model.value === 'string'){
        model.value = dayjs(model.value).toDate()
    }
}

const props = defineProps({
    label: {
        type: String,
        required: false
    },
    placeholder: {
        type: String,
        required: false
    },
    appendInnerIcon: {
        type: String,
        required: false,
        default: undefined
    },
    prependInnerIcon: {
        type: String,
        required: false,
        default: undefined
    }
})

function formatDate(date) {
    // console.log("formatDate", date) 
    if(!date) return ''
    return dayjs(date).format('YYYY-MM-DD')
}

function onDateSelected() {
    showDatePickerMenu.value = false
}
</script>