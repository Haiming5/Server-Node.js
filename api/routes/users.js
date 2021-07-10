const express = require("express");
const router = express.Router();
const User = require("../models/user");
// A library encrpts user's input
const bcrypt = require("bcrypt");
// A json webtoken generator
const jwt = require("jsonwebtoken");
const UsersControllers = require("../controllers/users_controller");
/*
What sault does here is to add some random string to your original password before hashing it, 
so that no when people type your hashed string, the dictionary returned from the hashed string 
will not be your original password. 

*/
const saltRound = 10;

router.get("/", UsersControllers.users_get_all_users);

router.post("/login", UsersControllers.users_login);

router.post("/signup", UsersControllers.users_signup);

router.delete("/:userEmail", UsersControllers.users_delete_one_user);

module.exports = router;
