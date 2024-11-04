const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Assuming this is the initialized Sequelize instance

const Acadamics = sequelize.define('Acadamics', {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Math: {
        type: DataTypes.FLOAT,
        allowNull: true // Assuming grades can be null if not available
    },
    Science: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    English: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    History: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Geography: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Physics: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Chemistry: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Computer_Science: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Physical_Education: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Arts: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    tableName: 'students', // Specify table name if different from model name
    timestamps: false // Assuming you don’t need createdAt and updatedAt fields
});

module.exports = Acadamics;
