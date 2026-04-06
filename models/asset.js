const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Asset = sequelize.define(
    'Asset',
    {
        name: { type: DataTypes.STRING, allowNull: false },
        serialNumber: { type: DataTypes.STRING, allowNull: true },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'available',
            validate: { isIn: [['available', 'issued']] },
        },
    },
    { tableName: 'assets', underscored: true, timestamps: false }
);

module.exports = Asset;
