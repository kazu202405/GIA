
import {ref,watch} from 'vue';

export function useEmailValidation(emailRef){
    const isValid = ref(true);
    const errorMessage = ref ('');

    const emailPattern = /@/;

    watch(emailRef, (newEmail) => {
      if (newEmail === "") {
        // 空の場合はバリデーションエラーを無効にする
        isValid.value = true;
        errorMessage.value = "";
      } else {
        if (!emailPattern.test(newEmail)) {
          isValid.value = false;
          errorMessage.value = "無効なメールアドレスです";
        } else {
          isValid.value = true;
          errorMessage.value = "";
        }
      }
    });
    return {isValid, errorMessage};
}