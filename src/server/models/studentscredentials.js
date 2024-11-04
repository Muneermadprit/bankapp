const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance

const StudentCredential = sequelize.define('studentscredentials', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15], // Adjust based on expected phone number length
        },
    },
    parentid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    fathername: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    devision: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    standard: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    classteacher: {
        type: DataTypes.STRING,
        allowNull: true, // Assuming this could be optional
    },
}, {
    tableName: 'studentscredentials',
    timestamps: false, // Disable createdAt and updatedAt fields
});

module.exports = StudentCredential;
