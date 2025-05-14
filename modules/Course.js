const { sequelize, DataTypes } = require('../orm');

const Course = sequelize.define('Course', {
  Course_ID: {
    type: DataTypes.STRING(8),
    primaryKey: true,
    allowNull: false
  },
  Title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Description: { // Added Description
    type: DataTypes.TEXT,
    allowNull: true
  },
  Credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Level: { // Added Level
    type: DataTypes.STRING(20),
    allowNull: true
  },
  Hours_Per_Week: { // Added Hours_Per_Week
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Department_ID: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  Course_Type: { // Changed from Is_Required to Course_Type
    type: DataTypes.STRING(20), // 使用字串類型來表示 "必修" 或 "選修"
    allowNull: true
  }
}, {
  tableName: 'COURSE',
  timestamps: false
});

module.exports = Course;