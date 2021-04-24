// VALIDAÇÃO DE FORMULARIO \\
const express = require('express')

const _validate = (form_data) => {

	if (form_data.nome == undefined || form_data.nome != String || form_data.nome == null){
		block.push('')
	}

	return console.log(form_data.nome)
}

module.exports = _validate