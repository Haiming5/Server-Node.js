const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	price: { type: Number, required: true },
	productImage: { type: String, required: true },
});

// mongoose.model() takes 2 args, first the name of schema, the second is schema you want to use for the model
module.exports = mongoose.model("Product", productSchema);
