const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define(
    'Category',
    {
        name: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: 'categories', underscored: true, timestamps: false }
);

module.exports = Category;
