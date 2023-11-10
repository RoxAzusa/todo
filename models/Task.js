const DataTypes = require('sequelize');
const sequelizeInstance = require('../utils/sequelize');

const Task = sequelizeInstance.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
        allowNull: true,
    },
    done: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

Task.sync({alter:true});

module.exports = {Task};
