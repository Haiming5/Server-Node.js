const Order = require("../models/order");

exports.orders_get_all = (req, res, next) => {
	Order.find()
		// Use "productId" because in order.js, productId has a ref refer to Product in product.js
		// The second argument is to set what property does populated data should have, in this case only "name" and
		// "price" field
		.populate("productId", "name price")
		.exec()
		.then((results) => {
			if (results) {
				const temp = {
					count: results.length,
					info: results.map((resu) => {
						return {
							_id: resu._id,
							quantity: resu.quantity,
							productId: resu.productId,
							request: {
								type: "GET",
								description: "Get a specific order based on _id",
								url: "http://localhost:3000/orders/" + resu._id,
							},
						};
					}),
				};
				res.status(200).json(temp);
			} else {
				res.status(200).json({
					message: "There are no orders ",
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};

exports.orders_delete_order = (req, res, next) => {
	const id = req.params.orderId;
	Order.deleteOne({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: `Order id ${id} deleted`,
				request: {
					type: "POST",
					description: "Creat a new order",
					url: "http://localhost:3000/orders/",
					body: {
						productId: "ID",
						quantity: "Number",
					},
				},
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};
