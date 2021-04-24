// ===== MIDDLEWARES AUTHENTICATE ===== \\

const express = require("express");
const app = express();


// AUTHENTICATE
	const auth = (req, res, next) => {
		console.log('AUTH')
		next();
	} 




module.exports = {
	auth
}