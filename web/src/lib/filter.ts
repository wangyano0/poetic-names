import fs from 'node:fs';

const BLACKLIST_PATH = '/Users/wangyan/工作/Code/guchiName/config/blacklist.json';

let badRe: RegExp | null = null;

function compileRe() {
  const words = JSON.parse(fs.readFileSync(BLACKLIST_PATH, 'utf8')) as string[];
  const escaped = words.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  badRe = new RegExp(escaped.join('|'), 'u');
}

export function isCleanText(s: string) {
  if (!badRe) compileRe();
  return !badRe!.test(s || '');
}

export function filterNames(candidates: string[]) {
  if (!Array.isArray(candidates)) return [];
  return candidates.filter((n) => isCleanText(n));
}


