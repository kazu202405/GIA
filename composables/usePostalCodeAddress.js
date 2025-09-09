import { ref, watch } from "vue";
import axios from "axios";

export const usePostalCodeAddress = () => {
  return {
    fetchAddressFromPostalCode : async (postalCode) => {
      console.log("呼び出し成功",postalCode)
      let prefecture = ""
      let city = ""
      let town = ""
      let errorMessage = ""
      
      if (postalCode.length !== 7) {
        errorMessage = "桁数が不正です。"
        // 7桁以外なら空を返す
        return {
          prefecture,
          city,
          town,
          errorMessage,
        }
      }

      try {
        const response = await axios.get(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
        );

        if (response.data.results) {
          const result = response.data.results[0];
          prefecture = result.address1;
          city = result.address2
          town = result.address3
          errorMessage = "";
        } else {
          errorMessage = "該当する住所が見つかりませんでした。";
        }
      } catch (error) {
        errorMessage = "住所の取得に失敗しました。";
      }
      return{
        prefecture,
        city,
        town,
        errorMessage,
      }
      
    }
  }
}


// {
// 	"message": null,
// 	"results": [
// 		{
// 			"addess1": "大阪府",
// 			"address2": "大阪市東淀川区",
// 			"address3": "東中島",
// 			"kana1": "ｵｵｻｶﾌ",
// 			"kana2": "ｵｵｻｶｼﾋｶﾞｼﾖﾄﾞｶﾞﾜｸ",
// 			"kana3": "ﾋｶﾞｼﾅｶｼﾞﾏ",
// 			"prefcode": "27",
// 			"zipcode": "5330033"
// 		}
// 	],
// 	"status": 200
// }