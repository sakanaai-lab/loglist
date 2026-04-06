export function checkPassword(password: string | undefined): boolean {
  // プライベートモードでは入口で認証済みなので内部パスワード不要
  if (process.env.PRIVATE_MODE === 'true') return true;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}
