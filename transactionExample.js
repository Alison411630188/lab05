const pool = require('./db');

async function doTransaction() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // 首先檢查學生是否存在
    const checkStudentQuery = 'SELECT Student_ID, Department_ID FROM STUDENT WHERE Student_ID = ?';
    const studentResult = await conn.query(checkStudentQuery, ['S10721001']);
    
    // 檢查結果結構並輸出詳細資訊
    console.log('查詢結果類型:', typeof studentResult);
    console.log('查詢結果結構:', JSON.stringify(studentResult, null, 2));
    
    // 取得正確的學生資料
    let studentRows;
    if (Array.isArray(studentResult)) {
      // 如果結果是陣列 [rows, fields]
      studentRows = studentResult[0];
    } else if (studentResult && typeof studentResult === 'object') {
      // 如果結果是單一對象
      studentRows = studentResult;
    } else {
      throw new Error('無法解析資料庫查詢結果');
    }
    
    // 檢查學生資料是否存在
    if (!studentRows || !Array.isArray(studentRows) || studentRows.length === 0) {
      console.log('學號 S10721001 不存在，交易取消');
      return;
    }
    
    // 安全地獲取系所 ID
    const studentData = studentRows[0];
    if (!studentData || typeof studentData !== 'object') {
      throw new Error('學生資料格式不正確');
    }
    
    console.log('學生資料:', studentData);
    
    // 安全地獲取系所 ID
    if (!('Department_ID' in studentData)) {
      throw new Error('學生資料中缺少 Department_ID 欄位');
    }
    
    const originalDepartment = studentData.Department_ID;
    console.log(`學生原系所: ${originalDepartment}`);
    
    // 開始交易
    await conn.beginTransaction();
    
    // 更新學生系所由 CS001 換成 BA001
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, ['BA001', 'S10721001']);
    
    // 更新學生選課表中的系所標記
    const updateCourses = 'UPDATE ENROLLMENT SET Status = ? WHERE Student_ID = ?';
    await conn.query(updateCourses, ['修課中', 'S10721001']);
    
    // 如果以上操作都成功，則提交交易
    await conn.commit();
    console.log('交易成功，已提交');
    
    // 交易完成後，查詢學生目前的系所
    const updatedResult = await conn.query(checkStudentQuery, ['S10721001']);
    let updatedStudentInfo;
    
    if (Array.isArray(updatedResult)) {
      updatedStudentInfo = updatedResult[0];
    } else if (updatedResult && typeof updatedResult === 'object') {
      updatedStudentInfo = updatedResult;
    }
    
    if (updatedStudentInfo && Array.isArray(updatedStudentInfo) && updatedStudentInfo.length > 0) {
      const updatedData = updatedStudentInfo[0];
      console.log(`學生 S10721001 已更新系所，目前系所: ${updatedData.Department_ID}`);
      console.log(`系所由 ${originalDepartment} 變更為 ${updatedData.Department_ID}`);
    }
    
  } catch (err) {
    // 若有任何錯誤，回滾所有操作
    if (conn) await conn.rollback();
    console.error('交易失敗，已回滾');
    console.error('錯誤詳情:', err.message);
    // 輸出完整的錯誤堆疊以便調試
    console.error('錯誤堆疊:', err.stack);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction().then(() => {
  console.log('程序執行完畢');
}).catch(err => {
  console.error('主程序錯誤:', err);
});