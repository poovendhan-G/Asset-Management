const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AssetLog = sequelize.define(
    'AssetLog',
    {
        assetId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'asset_id',
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'employee_id',
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isIn: [['issued', 'returned']] },
        },
    },
    { tableName: 'asset_logs', underscored: true, timestamps: false }
);

module.exports = AssetLog;
