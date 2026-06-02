// センシティブ記事の判定ロジック
// タイトル・説明・本文のいずれかに「R18」という文字が含まれていたら
// センシティブ扱いとし、閲覧前に確認画面を挟む。

const SENSITIVE_PATTERN = /R18/i;

/** 渡されたテキストのいずれかにセンシティブな語が含まれるか判定する */
export function isSensitive(...texts: Array<string | null | undefined>): boolean {
  return texts.some((t) => !!t && SENSITIVE_PATTERN.test(t));
}
