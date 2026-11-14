export const MSG_ERR = {
  SERVER_ERROR: 'サーバーでエラーが発生しました。',
  NETWORK_ERROR: 'ネットワークエラーが発生しました。',
  APP_ERROR: 'アプリケーションに問題が発生しました。画面を再度読み込んでください。',
  REQ_NOT_VALID: 'failed validations',
  REQUIRED_VALUE: '値を入力してください。',
  EXCESSIVE_NUMBER_OF_DIGITS: '桁数が上限値（{0}桁）を超えています。',
  NO_CTRL_CHAR: '値に制御文字が含まれています。',
} as const;

export const MSG_SUC = {
  CR_DONE: 'データを追加しました。{0} = {1}',
} as const;