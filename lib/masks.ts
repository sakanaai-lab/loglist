export interface MaskRule {
  id: number;
  from_text: string;
  to_text: string;
  position: number;
}

export function applyMasks(text: string, rules: MaskRule[]): string {
  let result = text;
  for (const rule of rules) {
    if (!rule.from_text.trim()) continue;
    result = result.split(rule.from_text).join(rule.to_text);
  }
  return result;
}
