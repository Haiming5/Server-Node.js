const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.users_get_all_users = (req, res, next) => {
	User.find()
		.select("_id email password")
		.exec()
		.then((users) => {
			const temp = {
				count: users.length,
				users: users.map((usr) => {
					return {
						_id: usr._id,
						email: usr.email,
						password: usr.password,
					};
				}),
			};
			res.status(200).json(temp);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

exports.users_login = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then((users) => {
			if (users.length < 1) {
				return res.status(401).json({
					message: "Authorization Failed",
				});
			}
			bcrypt.compare(req.body.password, users[0].password, (err, result) => {
				if (err) {
					return res.status(500).json({
						error: err,
					});
				}
				if (result) {
					const token = jwt.sign(
						{ email: users[0].email, userId: users[0]._id },
						process.env.JWT_KEY,
						{ expiresIn: "1h" }
					);
					return res.status(200).json({
						message: "Auth succeed",
						token: token,
					});
				} else {
					return res.status(401).json({
						message: "Authorization Failed",
					});
				}
			});
		})
		.catch((err) => {
			return res.status(500).json({
				message: "Something is wrong on our end",
				error: err,
			});
		});
};

exports.users_signup = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length >= 1) {
				console.log("user: ", user);
				return res.status(409).json({
					message: "Email already existed",
				});
			} else {
				bcrypt.hash(req.body.password, saltRound, (err, hash) => {
					if (err) {
						res.status(500).json({
							error: err,
						});
					} else {
						// console.log("user password: ", hash);
						const user = new User({
							_id: mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
						});
						user
							.save()
							.then((result) => {
								console.log(result);
								res.status(201).json({
									message: "User created",
								});
							})
							.catch((err) => {
								res.status(500).json({
									error: err,
								});
							});
					}
				});
			}
		});
};

exports.users_delete_one_user = (req, res, next) => {
	User.deleteOne({ email: req.params.userEmail })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: `Deleted email ${req.params.userEmail}`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
};
