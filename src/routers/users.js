const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require('../db/models/users.js')
const User = mongoose.model("user");


router.get('usuario', (req, res) => {
	
})




module.exports = router