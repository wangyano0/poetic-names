const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join('/Users/wangyan/工作/Code/guchiName', 'data.db');

function search(query, limit = 10) {
  const db = new Database(DB_PATH, {});
  let rows = [];
  try {
    const stmtFts = db.prepare(`
      SELECT w.id, w.title, w.author, w.dynasty, w.genre, w.source,
             snippet(works_fts, 2, '[', ']', '…', 20) AS excerpt
      FROM works_fts
      JOIN works w ON w.id = works_fts.rowid
      WHERE works_fts MATCH ?
      LIMIT ?;
    `);
    rows = stmtFts.all(query, limit);
  } catch (_) {
    // ignore and fallback
  }
  if (!rows || rows.length === 0) {
    const like = `%${query}%`;
    const stmtLike = db.prepare(`
      SELECT id, title, author, dynasty, genre, source,
             substr(content, max(1, instr(content, ?) - 12), 50) AS excerpt
      FROM works
      WHERE content LIKE ? OR title LIKE ? OR author LIKE ?
      LIMIT ?;
    `);
    rows = stmtLike.all(query, like, like, like, limit);
  }
  db.close();
  return rows;
}

if (require.main === module) {
  const q = process.argv.slice(2).join(' ');
  console.log(search(q, 5));
}

module.exports = { search };


