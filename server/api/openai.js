export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiUrl = config.openaiApiUrl;
  const apiKey = config.openaiApiKey;

  if (!apiUrl || !apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API URLまたはAPIキーが設定されていません。環境変数を確認してください。',
    });
  }

  const body = await readBody(event); // フロントエンドからのリクエストデータを取得

  // バリデーション1: メッセージが配列かつ空でないことを確認
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'メッセージが無効です。正しい形式でリクエストを送信してください。',
    });
  }

  // バリデーション2: max_tokensが数値であり正の値であることを確認
  if (body.max_tokens && (typeof body.max_tokens !== 'number' || body.max_tokens <= 0)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'max_tokensは正の数値で指定してください。',
    });
  }

  // バリデーション3: メッセージサイズ制限（例: 10KB以下）を超えないことを確認
  if (JSON.stringify(body.messages).length > 10000) {
    throw createError({
      statusCode: 413,
      statusMessage: 'リクエストが大きすぎます。メッセージを減らしてください。',
    });
    
  }

  try {
    const response = await $fetch(apiUrl, { // 環境変数からURLを取得
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`, // 環境変数からAPIキーを取得
        'Content-Type': 'application/json',
      },
      body: {
        model: 'gpt-4o-mini', // 使用するモデル
        messages: body.messages, // フロントエンドから渡されたメッセージ
        max_tokens: body.max_tokens || 3500, // フロントエンドから渡されたトークン数
      },
    });
    // レスポンスの形式を検証: 正しい形式でデータが返されているか確認
    if (!response || !response.choices || !Array.isArray(response.choices)) {
      throw createError({
        statusCode: 500,
        statusMessage: '外部APIのレスポンスが不正です。',
      });
    }

    return response; // 正常なレスポンスをそのまま返す
  } catch (error) {
    // エラーログを詳細に記録: スタックトレースやレスポンスデータを含む
    console.error('バックエンドエラー:', {
      message: error.message,
      stack: error.stack,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
    });

    // ユーザー向けエラー: 詳細を含まない簡潔なエラーメッセージを返す
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'サーバーでエラーが発生しました。時間を置いて再度お試しください。',
    });
  }
});