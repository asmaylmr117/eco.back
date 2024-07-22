const express = require('express');
const {
    createSubCategory,
    getSubCategory,
    getSubCategories,
    updateSubCategory,
    deleteSubCategory,
} = require('../services/subCategorySarvice');
const {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const authService = require('../services/authService');

const router = express.Router({ mergeParams: true });

router.route("/")
    .post(authService.protect, createSubCategoryValidator, createSubCategory)
    .get(getSubCategories);

router.route("/:id")
    .get(authService.protect, getSubCategoryValidator, getSubCategory)  
    .put(authService.protect, updateSubCategoryValidator, updateSubCategory)  
    .delete(authService.protect, deleteSubCategoryValidator, deleteSubCategory);  

module.exports = router;
