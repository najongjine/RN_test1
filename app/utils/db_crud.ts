import * as SQLite from 'expo-sqlite';

export interface Memo {
  id: number;
  title: string;
  content: string | null;
  created_dt: string;
  updated_dt: string;
}

/**
 * 데이터베이스 연결을 가져옵니다.
 * 'testmemo.db'라는 이름의 데이터베이스 파일이 생성됩니다.
 */
export const getDbConnection = async () => {
  return await SQLite.openDatabaseAsync('testmemo.db');
};

/**
 * 테이블 초기화 함수
 * 앱이 시작될 때 또는 데이터베이스가 처음 열릴 때 호출하여 테이블을 생성합니다.
 */
export const initDatabase = async () => {
  const db = await getDbConnection();
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS t_testmemo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK (length(title) <= 500),
        content TEXT,
        created_dt TEXT DEFAULT (datetime('now', 'localtime')),
        updated_dt TEXT DEFAULT (datetime('now', 'localtime'))
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

/**
 * 메모 데이터를 INSERT 하는 샘플 함수 (쌩쿼리 + 매개변수 방식)
 * 
 * @param title - 메모 제목 (최대 500자)
 * @param content - 메모 내용
 * @returns - 삽입된 행의 ID (lastInsertRowId)
 */
export const insertMemo = async (title: string, content: string) => {
  const db = await getDbConnection();

  try {
    // 쌩쿼리(Raw SQL)와 매개변수(Parameters)를 사용하는 runAsync 메서드
    // ? 자리에 매개변수가 순서대로 안전하게 바인딩됩니다.
    const result = await db.runAsync(
      'INSERT INTO t_testmemo (title, content) VALUES (?, ?);',
      [title, content]
    );

    console.log('Data inserted successfully. ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Insert Memo error:', error);
    throw error;
  }
};

/**
 * (참고용) 전체 데이터를 조회하는 샘플 함수
 */
export const getAllMemos = async () => {
  const db = await getDbConnection();
  try {
    const allRows = await db.getAllAsync<Memo>('SELECT * FROM t_testmemo ORDER BY created_dt DESC;');
    return allRows;
  } catch (error) {
    console.error('Get All Memos error:', error);
    return [];
  }
};

/**
 * ID로 특정 메모 조회
 */
export const getMemoById = async (id: number) => {
  const db = await getDbConnection();
  try {
    const memo = await db.getFirstAsync<Memo>('SELECT * FROM t_testmemo WHERE id = ?;', [id]);
    return memo;
  } catch (error) {
    console.error('Get Memo By ID error:', error);
    throw error;
  }
};

/**
 * ID로 메모 수정
 */
export const updateMemoById = async (id: number, title: string, content: string) => {
  const db = await getDbConnection();
  try {
    const result = await db.runAsync(
      'UPDATE t_testmemo SET title = ?, content = ?, updated_dt = datetime(\'now\', \'localtime\') WHERE id = ?;',
      [title, content, id]
    );
    return result.changes > 0;
  } catch (error) {
    console.error('Update Memo By ID error:', error);
    throw error;
  }
};

/**
 * ID로 메모 삭제
 */
export const deleteMemoById = async (id: number) => {
  const db = await getDbConnection();
  try {
    const result = await db.runAsync('DELETE FROM t_testmemo WHERE id = ?;', [id]);
    return result.changes > 0;
  } catch (error) {
    console.error('Delete Memo By ID error:', error);
    throw error;
  }
};
