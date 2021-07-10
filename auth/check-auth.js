const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		// console.log("token: ", token);
		const outcome = jwt.verify(token, process.env.JWT_KEY);
		// console.log("outcome: ", outcome);
		req.userData = outcome;
		next();
	} catch {
		return res.status(401).json({
			message: "Authorization Failed",
		});
	}
};
