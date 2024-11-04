const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance

const Parentscredentials = sequelize.define('parentcredential', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // Automatically incrementing value
        primaryKey: true,    // Set as primary key
        allowNull: false,    // Cannot be null
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parentid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15] // Assuming phone numbers are between 10 to 15 characters long
        },
    },
}, {
    tableName: 'parentcredential',
    timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = Parentscredentials;

