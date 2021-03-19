// // ========= SCRAP PHUB ==========

const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const pdf = require('html-pdf-node');
// const request = require('request-promise');
// const cheerio = require('cheerio');
// const fetch = require('node-fetch');


// CONFIG
	
	// View Engine
		app.set("views", path.join(__dirname, "views/"));
		app.engine('handlebars', handlebars({defaltLayout: 'main'}))
		app.set('view engine', 'handlebars')
	// Arquivos estáticos
		app.use(express.static(path.join(__dirname, '/public')));
	// body
		app.use(bodyParser.json( ))
		var urlencodedParser = bodyParser.urlencoded({ extended: false })
// ROTAS

	app.get('/', (req, res) => {
		res.render('form.handlebars')
	})

	app.post('/pdfcreate',urlencodedParser, (req, res) => {


		let options = { format: 'A4', path: "./meupdf.pdf" };

		let file = { content: `

			<h1>${req.body.nome}</h1>
				<h2>${req.body.sobrenome}</h2>

		`};

		pdf.generatePdf(file, options).then(pdfBuffer => {
		  console.log("PDF Buffer:-", pdfBuffer);
		  res.redirect('/')
		});

	})



// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(err){
	console.log('Server ON PORT: '+PORT)
})
