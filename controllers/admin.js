const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
  .then(function(result) {
    res.redirect('/admin/products');
  })
  .catch(function(err) {
    console.log(err);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId}})
    .then(function(product) {
      if (!product[0]) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product[0]
      });
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then(function(product) {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;

      return product.save();
    })
    .then(function(result) {
      console.log('product updated');
      res.redirect('/admin/products');
    })
    .catch(function(err) {
      console.log(err);
    })
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(function(products) {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(function(err) {
    console.log(err);
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({
    where: {id: prodId}
  })
  .then(function(result) {
    console.log(result.title);
    res.redirect('/admin/products');
  })
  .catch(function(err) {
    console.log(err);
  });
};
