const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const loginContoller = require("../controllers/loginController");

router.post("/login", loginContoller.login);

module.exports = router;
