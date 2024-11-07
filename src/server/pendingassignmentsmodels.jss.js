const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Import your Sequelize instance

const PendingAssignments = sequelize.define('pending_assignments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-increment for the primary key
        allowNull: false
    },
    studentId: {
        type: DataTypes.BIGINT,
        allowNull: false, // Required field for student ID
    },
    assignmentId: {
        type: DataTypes.BIGINT,
        allowNull: false, // Required field for assignment ID
    },
    assignmentTitle: {
        type: DataTypes.STRING(255),
        allowNull: false, // Required field for the assignment title
    },
    dueDate: {
        type: DataTypes.DATEONLY, // Use DATEONLY for storing date without time
        allowNull: false, // Required field for due date
    },
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending', // Default status is 'pending'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Automatically sets the timestamp when the record is created
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Automatically updates the timestamp when the record is updated
        onUpdate: DataTypes.NOW, // Updates automatically on every update
    }
}, {
    tableName: 'pending_assignments', // Table name in the database
    timestamps: true, // Enable automatic management of createdAt and updatedAt fields
    underscored: true, // Use snake_case for the database column names (optional, based on preference)
    indexes: [
        {
            unique: true, 
            fields: ['studentId', 'assignmentId'] // Ensure that each student can have only one unique assignment
        }
    ]
});

module.exports = PendingAssignments;
