const express = require('express');
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validators/categoryValidator')



const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../services/categoryServices');
const subcategoriesRoute = require('./subCategoryRoute')
// mergeParents: allowed us to access parmeters on 
const router = express.Router({mergeParams:true});

router.use('/:categorId/subcategories',subcategoriesRoute);
router
.route('/')
.get(getCategories)
 router.post(createCategoryValidator,createCategory);
router
.route('/:id')
.get(getCategoryValidator, getCategory)
.put(updateCategoryValidator,updateCategory)
.delete(deleteCategoryValidator,deleteCategory)

module.exports = router;
