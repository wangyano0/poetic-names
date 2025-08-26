import Database from 'better-sqlite3';

// 使用根目录 SQLite 数据库
const DB_PATH = '/Users/wangyan/工作/Code/guchiName/data.db';

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
  }
  return db;
}

export type WorkRow = {
  id: number;
  title: string;
  author?: string;
  dynasty?: string;
  genre?: string;
  source: string;
  excerpt: string;
};

export function searchWorks(query: string, limit = 20, sources?: string[]): WorkRow[] {
  const conn = getDb();
  const sourceFilter = Array.isArray(sources) && sources.length > 0 ? ` AND w.source IN (${sources.map(()=>'?').join(',')})` : '';
  
  // 优先使用LIKE搜索，因为FTS5可能有问题
  const like = `%${query}%`;
  const stmtLike = conn.prepare(`
    SELECT id, title, author, dynasty, genre, source,
           substr(content, max(1, instr(content, ?) - 12), 50) AS excerpt
    FROM works
    WHERE (content LIKE ? OR title LIKE ? OR author LIKE ?)
    ${sourceFilter.replace('w.source','source')}
    LIMIT ?;
  `);
  const likeResults = stmtLike.all(query, like, like, like, ...(Array.isArray(sources)&&sources.length? sources: []), limit) as WorkRow[];
  if (likeResults.length > 0) return likeResults;
  
  // 如果LIKE搜索没有结果，尝试FTS5搜索
  try {
    const stmtFts = conn.prepare(`
      SELECT w.id, w.title, w.author, w.dynasty, w.genre, w.source,
             snippet(works_fts, 2, '[', ']', '…', 20) AS excerpt
      FROM works_fts
      JOIN works w ON w.id = works_fts.rowid
      WHERE works_fts MATCH ?${sourceFilter}
      LIMIT ?;
    `);
    const rows = stmtFts.all(query, ...(Array.isArray(sources)&&sources.length? sources: []), limit) as WorkRow[];
    if (rows.length > 0) return rows;
  } catch (error) {
    console.warn('FTS5搜索失败:', error);
  }

  return [];
}

export function getWorksBySources(limit = 50, sources?: string[]): WorkRow[] {
  const conn = getDb();
  const sourceFilter = Array.isArray(sources) && sources.length > 0 ? ` WHERE source IN (${sources.map(()=>'?').join(',')})` : '';
  const stmt = conn.prepare(`
    SELECT id, title, author, dynasty, genre, source,
           substr(content, 1, 60) AS excerpt
    FROM works
    ${sourceFilter}
    ORDER BY random()
    LIMIT ?;
  `);
  const rows = stmt.all(...(Array.isArray(sources)&&sources.length? sources: []), limit) as WorkRow[];
  return rows;
}


