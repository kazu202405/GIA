import {ref, watch} from 'vue';

export function usePhoneValidation (phoneRef) {
    const isValid = ref(true);
    const errorMessage = ref('');
    const phonePattern = /^[0-9]{10,11}$/;

    watch(phoneRef, (newPhone) => {
        if (newPhone === ""){
            isValid.value = true;
            errorMessage.value = "";
        }else if (!phonePattern.test(newPhone)){
            isValid.value = false;
            errorMessage.value = "無効な電話番号です。10桁または11桁の数字を入力してください。";
        }else {
            isValid.value = true;
            errorMessage.value = "";
        }
    });
    return {isValid, errorMessage};
}