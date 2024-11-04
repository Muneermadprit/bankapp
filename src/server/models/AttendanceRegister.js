const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance

const AttendanceRegister = sequelize.define('AttendanceRegister', {
    StudentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Grade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Section: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Mon: {
        type: DataTypes.BOOLEAN, // true for present, false for absent
        defaultValue: false
    },
    Tue: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Wed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Thu: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Fri: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    TotalPresent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    TotalAbsent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    TotalLate: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    Remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'AttendanceRegister', // Name of the table in the database
    timestamps: false // Disable createdAt and updatedAt fields if not needed
});

module.exports = AttendanceRegister;
