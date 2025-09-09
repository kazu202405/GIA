import { ref } from 'vue';
import axios from 'axios';

export function useGpt() {
  const isProcessing = ref(false);

  const processWithGpt = async (inputText) => {
    isProcessing.value = true;
    console.log("processWithGptの処理");
    try {
        const response = await axios.post(
            '/api/openai', // NUXTのサーバーサイドAPIエンドポイント
         //`${import.meta.env.VITE_OPENAI_API_URL}`, // 環境変数からエンドポイントを取得
        {
          model: 'gpt-4o-mini', // 使用するモデルを指定
          messages: [
      {
        role: 'user',
        content: `整形してください: ${inputText}`, // OCRから取得したテキスト
      }
    ],
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
        }
      );
      console.log('ここまでＯＫ');
      console.log('処理はここまでＯＫで処理後の中身はこれ',response.data.choices[0].message.content.trim());
      
      return response.data.choices[0].message.content.trim(); // GPTの結果を返す
    } catch (error) {
        console.log('GPTエラー詳細:', JSON.stringify(error.response?.data, null, 2));


      console.error('GPTエラー内容:', error, error.response?.data || error.message);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    isProcessing,
    processWithGpt,
  };
}
