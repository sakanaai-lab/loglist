// センシティブ記事の判定ロジック
// タイトル・説明・本文のいずれかに「R18」「センシティブ」「センシ」などの
// 語が含まれていたらセンシティブ扱いとし、閲覧前に確認画面を挟む。
// （「センシ」は「センシティブ」も部分一致でカバーする）

const SENSITIVE_PATTERN = /R18|センシ/i;

/** 渡されたテキストのいずれかにセンシティブな語が含まれるか判定する */
export function isSensitive(...texts: Array<string | null | undefined>): boolean {
  return texts.some((t) => !!t && SENSITIVE_PATTERN.test(t));
}
