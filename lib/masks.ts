export interface MaskRule {
  id: string;
  from: string;
  to: string;
}

const STORAGE_KEY = 'loglist_masks';

export function loadMasks(): MaskRule[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMasks(rules: MaskRule[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
}

export function applyMasks(text: string, rules: MaskRule[]): string {
  let result = text;
  for (const rule of rules) {
    if (!rule.from.trim()) continue;
    result = result.split(rule.from).join(rule.to);
  }
  return result;
}
