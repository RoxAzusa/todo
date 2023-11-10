const { sequelize } = require('../sql.js');
const User = require('./User');
const Task = require('./Task');

// Déclaration des relations
User.hasMany(Task);
Task.belongsTo(User);

sequelize.sync({alter: true});

module.exports = {
    User, 
    Task
}