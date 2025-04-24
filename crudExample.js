const pool = require('./db');

// 檢查學號格式是否正確
function isValidStudentID(studentID) {
  return /^S\d{8}$/.test(studentID);
}

async function basicCrud() {
  let conn;
  try {
    conn = await pool.getConnection();

    const studentID = 'S10810001';

    // 檢查學號
    if (!isValidStudentID(studentID)) {
      throw new Error('學號格式錯誤！應為 S 開頭後接 8 碼數字，例如 S10810001');
    }

    // 1. INSERT 新增
    let sql = 'INSERT INTO STUDENT (Student_ID, Name, Gender, Email, Department_ID) VALUES (?, ?, ?, ?, ?)';
    await conn.query(sql, [studentID, '王曉明', 'M', 'wang@example.com', 'CS001']);
    console.log('已新增一筆學生資料');

    // 2. SELECT 查詢
    sql = 'SELECT * FROM STUDENT WHERE Department_ID = ?';
    const rows = await conn.query(sql, ['CS001']);
    console.log('查詢結果：', rows);

    // 3. UPDATE 更新
    sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
    await conn.query(sql, ['王小明', studentID]);
    console.log('已更新學生名稱');

    // 4. DELETE 刪除
    sql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
    await conn.query(sql, [studentID]);
    console.log('已刪除該學生');

  } catch (err) {
    console.error('操作失敗：', err.message);
  } finally {
    if (conn) conn.release();
  }
}

basicCrud();
