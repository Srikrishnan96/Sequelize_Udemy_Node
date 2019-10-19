const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(function(products) {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(function(err) {
    console.log(err);
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(function(products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    })
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(function(cart) {
      return cart.getProducts()
    })
    .then(function(products) {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(function(err) {
      console.log(err);
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  var fetchedCart, newQuantity=1;
  req.user.getCart()
    .then(function(cart) {
      fetchedCart = cart;
      return cart.getProducts({ where: {id: prodId}})
    })
    .then(function(products) {
      let product;
      if(products.length > 0) {
        product = products[0]
      }
      if(product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity+1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(function(product) {
      return fetchedCart.addProduct(product, {through:{quantity: newQuantity}});
    })
    .then(function() {
      res.redirect('/cart');
    })
    .catch(function(err) {
      console.log(err);
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(function(cart) {
      return cart.getProducts({where: {id: prodId}});
    })
    .then(function(products) {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(function(result) {
      res.redirect('/cart');
    })
    .catch(function(err) {
      console.log(err);
    })
};

exports.postOrder = (req, res, next) => {
  let fetchedProducts, fetchedCart;
  req.user.getCart()
    .then(function(cart) {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(function(products) {
      fetchedProducts = products;
      return req.user.createOrder();
    })
    .then(function(order) {
      return order.addProducts(fetchedProducts.map(function(product) {
        product.orderItem = {quantity: product.cartItem.quantity};
        return product;
      }));
    })
    .then(function(result) {
      return fetchedCart.setProducts(null);
    })
    .then(function(result) {
      res.redirect('/orders');
    })
    .catch(function(err) {
      console.log(err);
    })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then(function(orders) {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(function(err) {
      console.log(err);
    })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
