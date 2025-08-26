const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const PROJECT_ROOT = '/Users/wangyan/工作/Code/guchiName';
const INPUT_DIR = path.join(PROJECT_ROOT, 'json_sanitized');
const DB_PATH = path.join(PROJECT_ROOT, 'data.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

function ensureSchema() {
  db.exec(`
CREATE TABLE IF NOT EXISTS works (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  dynasty TEXT,
  genre TEXT,
  source TEXT,
  content TEXT
);
`);
}

function rebuildFts() {
  db.exec(`DROP TABLE IF EXISTS works_fts;`);
  db.exec(`CREATE VIRTUAL TABLE works_fts USING fts5(
    title, author, content, content='works', content_rowid='id'
  );`);
  const stmt = db.prepare(`INSERT INTO works_fts(rowid, title, author, content)
                           SELECT id, title, author, content FROM works;`);
  stmt.run();
}

function normalizeRecord(item, sourceSet) {
  // 尽量从常见字段推断，兼容不同数据结构
  const title = item.title || item.name || '';
  const author = item.author || item.poet || item.writer || '';
  const dynasty = item.dynasty || item.era || '';
  const genre = item.genre || item.form || '';
  const content = Array.isArray(item.content)
    ? item.content.join('\n')
    : (item.content || item.text || item.paragraphs || '');
  return { title, author, dynasty, genre, source: sourceSet, content };
}

function importFile(file) {
  const filePath = path.join(INPUT_DIR, file);
  const src = path.basename(file, '.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  let data = [];
  try {
    const parsed = JSON.parse(raw);
    data = Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    console.error('JSON 解析失败:', file, e.message);
    return { count: 0 };
  }

  const insert = db.prepare(`INSERT INTO works (title, author, dynasty, genre, source, content)
                             VALUES (@title, @author, @dynasty, @genre, @source, @content)`);
  const trx = db.transaction((rows) => {
    for (const r of rows) insert.run(r);
  });

  const rows = data.map((item) => normalizeRecord(item, src));
  trx(rows);
  return { count: rows.length };
}

function main() {
  ensureSchema();
  const files = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith('.json'));
  let total = 0;
  for (const f of files) {
    const { count } = importFile(f);
    console.log(`导入 ${f}: ${count}`);
    total += count;
  }
  rebuildFts();
  console.log(`导入完成，总计 ${total} 条，数据库路径: ${DB_PATH}`);
}

main();


