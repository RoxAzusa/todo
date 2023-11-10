const DataTypes = require('sequelize');
const { sequelize } = require('../sql.js');

const User = sequelize.define('User', {
    email: {
        type : DataTypes.TEXT,
    },
    password: {
        type: DataTypes.TEXT,
    },
    display_name: {
        type: DataTypes.TEXT,
    }
});

User.sync();

module.exports = {User};