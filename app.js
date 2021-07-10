const express = require("express");
// morgan is a logger library which logs out information
// const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(
	"mongodb+srv://Haiming:" +
		process.env.MONGO_ATLAS_PW +
		"@cluster0.uqjsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

// app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.all("*", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "PUT, GET, DELETE, POST, PATCH");
	res.header("Access-Control-Allow-Headers", "*");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

// handle /products URL
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

// Creating errors handling
// When there is no such url we go to error code 404

app.use((req, res, next) => {
	const error = new Error("Page not found. You idiot, type carefully!");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
			errorCode: error.status,
		},
	});
});

module.exports = app;
