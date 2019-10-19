const Sequelize = require('sequelize');
const sequelize = require('../util/mysql_database');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
  }
});

module.exports = OrderItem;