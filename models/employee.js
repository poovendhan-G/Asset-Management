const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Employee = sequelize.define(
    'Employee',
    {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: 'employees', underscored: true, timestamps: false }
);

module.exports = Employee;
