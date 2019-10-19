const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/mysql_database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    User.findByPk(1)
        .then(function(user) {
            req.user = user;
            next();
        })
        .catch(function(err) {
            console.log(err)
        });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product, {onDelete: 'CASCADE'});
User.hasOne(Cart, {onDelete: 'CASCADE'});
Cart.belongsToMany(Product, {through: CartItem, onDelete: 'CASCADE'});
Cart.belongsToMany(Product, {through: CartItem, onDelete: 'CASCADE'});
User.hasMany(Order, {onDelete: 'CASCADE'});
Order.belongsToMany(Product, {through: OrderItem, onDelete: 'CASCADE'});

sequelize.sync()
    .then(function(result) {
        return User.findByPk(1);
    })
    .then(function(user) {
        if(!user) {
            return User.create({name: 'krish', email: 'krish@gmail.com'});
        }
        return user;
    })
    .then(function(user) {
        return user.createCart();
    })
    .then(function() {
        app.listen(3000);
    })
    .catch(function(err) { 
        console.log(err);
    });