const express = require('express');
const { Login, getProducts, getAdminOrders, getAdminUsers, getOrderdetails, getAdminSeller,  DeleteProduct, adminBuyer, LOaduser, ProductDetails } = require('./Controller/UserController');
const router = express.Router();
const { authenticateToken }  = require('./AuthMiddleware');

//user autthetication  --Route
router.route('/login').post(Login);
router.route('/me').get(LOaduser);


//Product Admins --Route get
router.route('/admin/products').get(authenticateToken,getProducts);
router.route('/admin/product/:id').get(authenticateToken,ProductDetails);
router.route('/admin/Orders').get(authenticateToken,getAdminOrders);;
router.route('/admin/users').get(authenticateToken,getAdminUsers);;
router.route('/admin/Orders/Details').get(authenticateToken,getOrderdetails);;
router.route('/admin/seller').get(authenticateToken,getAdminSeller);;
router.route('/admin/buyer').get(authenticateToken,adminBuyer);;

//Product Admins --Route delete
router.route('/admin/product/:id').delete(DeleteProduct);


module.exports = router;