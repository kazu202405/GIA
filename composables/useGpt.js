import { ref } from 'vue';
import axios from 'axios';

export function useGpt() {
  const isProcessing = ref(false);

  const processWithGpt = async (inputText, prompt) => {
    isProcessing.value = true;
    //console.log('processWithGptに渡されたprompt:', prompt);
    //console.log('processWithGptに渡されたinputText:', inputText);

    try {
      if (!inputText || typeof inputText !== 'string') {
        throw new Error('入力テキストが無効です。文字列を入力してください。'); // エラーハンドリング1
      }
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('プロンプトが無効です。文字列を入力してください。'); // エラーハンドリング2
      }

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // 環境変数からAPIキーを取得
      if (!apiKey) {
        throw new Error('OpenAI APIキーが設定されていません。環境変数を確認してください。'); // エラーハンドリング3
      }
      const response = await axios.post(
        '/api/openai', // NUXTのサーバーサイドAPIエンドポイント
        {
          model: 'gpt-4o', // 使用するモデルを指定
          messages: [
            {
              role: 'user',
              content: prompt.replace('${inputText}', inputText), // 動的プロンプト

            }
          ],
          max_tokens: 3500,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
        }
      );
      const result = response.data.choices[0].message.content.trim();
      console.log('GPTによるJSON化の内容', result);
      return result; // GPTの結果を返す

    } catch (error) {
      console.error('GPTエラー内容:', error.response?.data || error.message);

      if (error.response) {
        console.error('サーバーからのエラー詳細:', JSON.stringify(error.response.data, null, 2)); // サーバーからのエラー詳細
      }

      // ユーザーにエラーメッセージを表示
      if (error.response?.status === 401) {
        alert('認証エラー: APIキーが正しく設定されていないか、有効期限が切れている可能性があります。');
      } else if (error.response?.status === 429) {
        alert('リクエスト制限エラー: APIのリクエスト上限を超えています。しばらく待って再試行してください。');
      } else if (error.response?.status >= 500) {
        alert('サーバーエラー: OpenAIサーバーに問題が発生しています。しばらく待って再試行してください。');
      } else {
        alert('不明なエラーが発生しました。詳細を確認して、再試行してください。');
      }

      throw error; // エラーを再スローして呼び出し元で処理
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    isProcessing,
    processWithGpt,
  };
}