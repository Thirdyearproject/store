const express=require('express');
const router=express.Router();

const {getProducts,getAdminProducts,newProduct, getSingleProduct,updateProduct,deleteProduct}=require('../controllers/productController');

const{isAuthenticatedUser,authorizedRoles}=require('../middlewares/user');

router.route(`/products`).get(getProducts);

router.route('/product/:id').get(getSingleProduct);
router.route('/admin/products').get(getAdminProducts);

router.route('/admin/product/new').post(isAuthenticatedUser,authorizedRoles('admin'),newProduct);

router.route('/admin/product/:id').put(isAuthenticatedUser,authorizedRoles('admin'),updateProduct)
                                .delete(isAuthenticatedUser,authorizedRoles('admin'),deleteProduct);

module.exports = router;
