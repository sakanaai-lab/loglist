export function checkPassword(password: string | undefined): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    // 環境変数未設定の場合は拒否（安全側に倒す）
    return false;
  }
  return password === adminPassword;
}
