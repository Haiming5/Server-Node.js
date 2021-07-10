const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all_products = (req, res, next) => {
	Product.find()
		.select("name price _id productImage")
		.exec()
		.then((docs) => {
			const result = {
				count: docs.length,
				products: docs.map((doc) => {
					return {
						name: doc.name,
						price: doc.price,
						_id: doc._id,
						productImage: doc.productImage,
						request: {
							type: "GET",
							url: "http://localhost:3000/products/" + doc._id,
						},
					};
				}),
			};
			res.status(200).send(result);
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};

exports.products_make_a_product = (req, res, next) => {
	// use the model we defined in Product.js which is consist of a scehma
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path,
	});
	product
		.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: "Created a new object to the existing products",
				createdProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					productImage: result.productImage,
					request: {
						type: "GET",
						url: "http://localhost:3000/products/" + result._id,
					},
				},
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
};

exports.products_get_one_product = (req, res, next) => {
	const id = req.params.productid;
	Product.findById(id)
		.exec()
		.then((doc) => {
			console.log(doc);
			if (doc) {
				const result = {
					name: doc.name,
					_id: doc._id,
					price: doc.price,
					productImage: doc.productImage,
					request: {
						type: "GET",
						description: "Get all products",
						url: "http://localhost:3000/products/",
					},
				};
				// console.log("doc", doc);
				res.status(200).json(result);
			} else {
				res.status(404).json({
					message: "No valid entry found for provided ID",
				});
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: error });
		});
};

exports.products_update_one_product = (req, res, next) => {
	const id = req.params.productid;
	Product.updateOne({ _id: id }, { name: req.body.name, price: req.body.price })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: `product id ${id} updated`,
				request: {
					type: "GET",
					url: "http://localhost:3000/products/" + id,
				},
			});
		})
		.catch((err) => {
			res.status(500).send("Cannot find the provided id");
		});
};

exports.products_delete_one_product = (req, res, next) => {
	const id = req.params.productid;
	Product.deleteOne({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: `Product id ${id} deleted`,
				request: {
					type: "POST",
					description: "Add a new product to the productions",
					url: "http://localhost:3000/products/",
					bodu: { name: "String", price: "Number" },
				},
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
};
