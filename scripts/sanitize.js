const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = '/Users/wangyan/工作/Code/guchiName';
const INPUT_DIR = path.join(PROJECT_ROOT, 'json');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'json_sanitized');
const BLACKLIST_FILE = path.join(PROJECT_ROOT, 'config', 'blacklist.json');

// 标点符号和数字
const PUNCTUATION_REGEX = /[，。！？、；（）""''·\d\s]/g;

// 异体字/通假字映射
const VARIANT_CHARS = {
  '徠': '来', '徕': '来', '徕': '来', '徕': '来',
  '徕': '来', '徕': '来', '徕': '来', '徕': '来',
  '徕': '来', '徕': '来', '徕': '来', '徕': '来'
};

function buildRegex(words) {
  const escaped = words.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(escaped.join('|'), 'u');
}

function loadBlacklist() {
  const raw = fs.readFileSync(BLACKLIST_FILE, 'utf8');
  const list = JSON.parse(raw);
  if (!Array.isArray(list)) throw new Error('blacklist.json must be an array');
  return list;
}

let badRe;
function hasBadStr(val) {
  if (typeof val !== 'string') return false;
  return badRe.test(val);
}

// 基础文本清洗
function cleanText(text) {
  if (typeof text !== 'string') return text;
  
  // 去除标点符号和数字
  let cleaned = text.replace(PUNCTUATION_REGEX, '');
  
  // 替换异体字/通假字
  Object.entries(VARIANT_CHARS).forEach(([old, new]) => {
    cleaned = cleaned.replace(new RegExp(old, 'g'), new);
  });
  
  return cleaned;
}

// 分句处理
function splitSentences(text) {
  if (typeof text !== 'string') return [];
  
  // 以逗号、句号、分号、问号、感叹号拆分
  const sentences = text.split(/[，。！？、；]/).filter(s => s.trim().length > 0);
  return sentences.map(s => s.trim());
}

// 检查是否包含脏词
function nodeHasBad(node) {
  if (node == null) return false;
  const t = typeof node;
  if (t === 'string') return hasBadStr(node);
  if (t === 'number' || t === 'boolean') return false;
  if (Array.isArray(node)) return node.some((el) => nodeHasBad(el));
  if (t === 'object') return Object.values(node).some((v) => nodeHasBad(v));
  return false;
}

function sanitize(node) {
  if (node == null) return node;
  const t = typeof node;
  
  if (t === 'string') {
    // 清洗文本
    const cleaned = cleanText(node);
    // 分句处理
    const sentences = splitSentences(node);
    
    return {
      original_text: node,
      cleaned_text: cleaned,
      sentences: sentences,
      has_bad_word: hasBadStr(node)
    };
  }
  
  if (t === 'number' || t === 'boolean') return node;
  
  if (Array.isArray(node)) {
    const out = [];
    for (const el of node) {
      const cleaned = sanitize(el);
      if (cleaned !== null && cleaned !== undefined) out.push(cleaned);
    }
    return out;
  }
  
  if (t === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      const cleaned = sanitize(v);
      if (cleaned !== null && cleaned !== undefined) out[k] = cleaned;
    }
    return out;
  }
  
  return node;
}

function processFile(inFile, outFile) {
  const raw = fs.readFileSync(inFile, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`JSON 解析失败: ${inFile}`, e.message);
    return { removed: 0, kept: 0, error: true };
  }

  let removed = 0, kept = 0;
  if (Array.isArray(data)) {
    const outArr = [];
    for (const item of data) {
      const cleaned = sanitize(item);
      if (cleaned && !cleaned.has_bad_word) {
        outArr.push(cleaned); 
        kept++;
      } else {
        removed++;
      }
    }
    fs.writeFileSync(outFile, JSON.stringify(outArr, null, 2), 'utf8');
  } else {
    const cleaned = sanitize(data);
    if (cleaned && !cleaned.has_bad_word) {
      fs.writeFileSync(outFile, JSON.stringify(cleaned, null, 2), 'utf8');
      kept = 1;
    } else {
      removed = 1;
    }
  }
  return { removed, kept, error: false };
}

function main() {
  const list = loadBlacklist();
  badRe = buildRegex(list);
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  const files = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith('.json'));
  let totalRemoved = 0, totalKept = 0;
  
  for (const f of files) {
    const inFile = path.join(INPUT_DIR, f);
    const outFile = path.join(OUTPUT_DIR, f);
    const { removed, kept } = processFile(inFile, outFile);
    totalRemoved += removed; 
    totalKept += kept;
    console.log(`处理完成: ${f}  移除记录: ${removed}  保留记录: ${kept}`);
  }
  
  console.log(`全部完成。总移除: ${totalRemoved}  总保留: ${totalKept}  输出目录: ${OUTPUT_DIR}`);
}

main();
