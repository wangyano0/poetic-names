const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = '/Users/wangyan/工作/Code/guchiName';
const BLACKLIST_FILE = path.join(PROJECT_ROOT, 'config', 'blacklist.json');

function loadBlacklist() {
  const raw = fs.readFileSync(BLACKLIST_FILE, 'utf8');
  const list = JSON.parse(raw);
  if (!Array.isArray(list)) throw new Error('blacklist.json must be an array');
  return list;
}

const words = loadBlacklist();
const badRe = new RegExp(words.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'u');

function isCleanText(s) {
  if (!s) return true;
  return !badRe.test(String(s));
}

function filterNames(candidates) {
  return (candidates || []).filter((n) => isCleanText(n));
}

module.exports = { isCleanText, filterNames };


