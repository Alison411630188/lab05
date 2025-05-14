const { sequelize, DataTypes } = require('../orm');

const Enrollment = sequelize.define('Enrollment', {
  Student_ID: {
    type: DataTypes.STRING(9),
    primaryKey: true,
    allowNull: false
  },
  Course_ID: {
    type: DataTypes.STRING(8),
    primaryKey: true,
    allowNull: false
  },
  Semester_ID: { // Changed from Semester
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false
  },
  Enrollment_Date: { // Added Enrollment_Date
    type: DataTypes.DATE,
    allowNull: true
  },
  Grade: {
    type: DataTypes.DECIMAL(5,2), // 更改為適當的十進制類型
    allowNull: true
  },
  Status: {
    type: DataTypes.STRING(20),
    defaultValue: '修課中',
    allowNull: true
  }
}, {
  tableName: 'ENROLLMENT',
  timestamps: false
});

module.exports = Enrollment;
