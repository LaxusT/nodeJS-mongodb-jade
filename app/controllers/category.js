var Category = require("../models/category");

// admin category page
exports.adminCategoryPage = function(req, res){
	res.render("categoryAdmin", { 
		title: "imooc 后台分页录入页",
		category: {}
	});
};

// save category
exports.saveCategory = function(req, res){
	var id = null;
	if("id" in req.body){
		id = req.body.id;
	}
	var categoryObj = req.body;

	var category = new Category({
		name: categoryObj.name,
	});

	category.save(function(err, category){
		if(err) console.log(err);
		res.redirect("/admin/category/list");
	});
};

// category list page
exports.categoryListPage = function(req, res){
	Category.fetch(function(err, categories){
		if(err) console.log(err);
		res.render("categorList", { 
			title: "imooc 分类列表页",
			categories: categories
		});
	});
};
