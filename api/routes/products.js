const bodyParser = require("body-parser");
const express = require("express");
// const { Mongoose } = require("mongoose");

const router = express.Router();
// const jsonParser = bodyParser.json();
const Product = require("../models/product");
const multer = require("multer");
const autho = require("../../auth/check-auth");
const ProductControllers = require("../controllers/products_controller");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		const now = new Date().toISOString().replace(/:/g, "_");
		cb(null, now + file.originalname);
	},
});

const filter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		// reject a file
		cb(null, false);
	}
};

const upload = multer({ storage: storage, fileFilter: filter });

router.get("/", ProductControllers.products_get_all_products);

router.post(
	"/",
	autho,
	upload.single("productImage"),
	ProductControllers.products_make_a_product
);

router.get("/:productid", autho, ProductControllers.products_get_one_product);

router.patch(
	"/:productid",
	autho,
	ProductControllers.products_update_one_product
);

router.delete(
	"/:productid",
	autho,
	ProductControllers.products_delete_one_product
);

module.exports = router;
