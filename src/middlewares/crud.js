// ===== MIDDLEWARES CRUD ===== \\

const express = require("express");
const app = express();


// SALVAR NOVA O.S
	const form_save = (req, res, next) => {
		console.log('form_save')
		next();
	} 

// EXCLUIR O.S
	const form_del = (req, res, next) => {
		console.log('form_del')
		next();
	} 

// ATUALIZAR O.S
	const form_udt = (req, res, next) => {
		console.log('form_udt')
		next();
	} 



module.exports = {
	form_save,
	form_del,
	form_udt
}