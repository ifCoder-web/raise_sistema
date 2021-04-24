// ======== SISTEMA O.S ======== \\

const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const hb = handlebars.create();
const bodyParser = require('body-parser');
const pdf = require('html-pdf-node');
const session = require('express-session');
const flash = require('connect-flash');
// const request = require('request-promise');
// const cheerio = require('cheerio');
// const fetch = require('node-fetch');


// CONFIG
	// Session
		app.use(session({
			secret: "igorfraga",
			resave: true,
			saveUninitialized: true
		}))
		app.use(flash())
	// Middlewares
		// app.use((req, res, next) => {
		// 	res.locals.success_msg = req.flash("success_msg");
		// 	res.locals.error_msg = req.flash("error_msg");
		// })
		const _crud = require('./middlewares/crud.js')
		const _auth = require('./middlewares/auth.js')

	// View Engine
		app.set("views", path.join(__dirname, "views/"));
		app.engine('handlebars', handlebars({defaltLayout: 'main'}))
		app.set('view engine', 'handlebars')
	// Arquivos estáticos
		app.use(express.static(path.join(__dirname, '/public')));
	// body
		app.use(bodyParser.json( ))
		var urlencodedParser = bodyParser.urlencoded({ extended: false })
	// FUNCTIONS/CONFIG
		let conteudo = 'No content';
	// PUBLIC
		app.use(express.static(path.join(__dirname,"/public")))


// BANCO DE DADOS
const db = require('./db/db.js')


// ROTAS

	// const dashboard = require('./routers/dashboard.js')
	// app.use('/dashboard', rota)

	app.get('/', (req, res) => {
		res.render('home.handlebars')
	})

	app.get('/dashboard', (req, res) => {
		// CONSULTANDO BANCO DE DADOS
			db.find().sort({_id: -1}).then((lista) => {
				res.render('dashboard.handlebars', {
					lista: lista.map(lista => lista.toJSON()),
				})
			}).catch((err) => {
				console.log("Erro ao gerar a lista de O.S: "+err)
			})	
	})

	// GERA A ORDEM DE SERVIÇO
	app.get('/new_os', (req, res) => {

		var num_new_os = 0

		// CONSULTANDO BANCO DE DADOS PARA ADICIONAR VALORES PADÕES NA NOVA O.S
			db.findOne().sort({_id: -1}).then(async (data_number_os) => { // CONSULTA A ULTIMA O.S 

				// PEGA O VALOR DO NUMERO DE ORDEM DA ULTIMA O.S E ADICIONA +1
				if(data_number_os){
					num_new_os = data_number_os.number_order + 1
					res.render('new_os.handlebars', { 					
					data: {
							number_order: num_new_os, // ATRIBUI AO CAMPO number_order O NUMERO GERADO
						}
					})
				}else{
					res.render('new_os.handlebars', { 					
					data: {
							number_order: num_new_os + 1, // ATRIBUI AO CAMPO number_order O NUMERO GERADO
						}
					})
				}

			}).catch((err) => {
				console.log("Erro ao gerar o numero de O.S: "+err)
			})

	})

	// LISTA DE O.S SALVAS NO BD
	app.get('/my_list', (req, res) => {
		// CONSULTANDO BANCO DE DADOS
			db.find().then((lista) => {
				res.render('my_list.handlebars', {
					lista: lista.map(lista => lista.toJSON()),
				})
			}).catch((err) => {
				console.log("Erro ao gerar a lista de O.S: "+err)
			})	
	})	

	// CONFIG
	app.get('/adm/config', (req, res) => {
		res.render('config.handlebars')
	})	


const _validate = require('./functions/_form_validate.js')

// CRUD

	// SALVANDO DADOS
	app.post('/save', urlencodedParser, async (req, res) => {
		console.log(req.body.abertura_data)
		// GUARDANDO NO BANCO DE DADOS
		const ordem = new db({
			// Ordem
				number_order: req.body.number_order,
				abertura_data: req.body.abertura_data,
				abertura_data_hora: req.body.abertura_data_hora,
			// Equipamento
				equip_name: req.body.equip_name,
				equip_situa: req.body.equip_situa,
				equip_marca: req.body.equip_marca,
				equip_modelo: req.body.equip_modelo,
				equip_number: req.body.equip_number,
				equip_prop_valor_aquis: req.body.equip_prop_valor_aquis,
				equip_prop_valor_venda: req.body.equip_prop_valor_venda,
				nome_cliente: req.body.nome_cliente,
				tel_cliente: req.body.tel_cliente,
				email_cliente: req.body.email_cliente,
				end_cliente: req.body.end_cliente,
			// Ocorrencia
				ocor_requis: req.body.ocor_requis,
				ocor_data: req.body.ocor_data,
				ocor_time: req.body.ocor_time,
				ocor_descript: req.body.ocor_descript,
			// Mão de obra
				serv_tec: req.body.serv_tec,
				serv_tipo: req.body.serv_tipo,
				serv_complex: req.body.serv_complex,
				serv_descript: req.body.serv_descript,
				serv_tempo_init: req.body.serv_tempo_init,
				serv_tempo_init_time: req.body.serv_tempo_init_time,
				serv_tempo_fim: req.body.serv_tempo_fim,
				serv_tempo_fim_time: req.body.serv_tempo_fim_time,
				serv_tempo_horas: req.body.serv_tempo_horas,
				serv_valor_p_hora: req.body.serv_valor_p_hora,
				serv_valor_total: req.body.serv_valor_total,
				serv_garantia: req.body.serv_garantia,
				serv_destino: req.body.serv_destino
		})
		// SAVE DOCUMENT
		ordem.save(async (err, dados) => {
			if(err){
				res.redirect('/new_os/')
				return console.error(err)
			} 
			const id = dados._id
			console.log('Salvo! id: ' + id)
			// REDIRECT
			res.redirect('/view_os/'+ id)
		})	
	})

	// UPDATE O.D
	app.post('/update', urlencodedParser, async (req, res) => {
	//CONSULTA BANCO DE DADOS
		await db.updateOne({_id: req.body.id_os},{
			nome: req.body.nome,
			sobrenome: req.body.sobrenome
		}).then(() => {
			console.log("Modificado!")
			res.redirect('/view_os/'+req.body.id_os);
		}).catch((err) => {
			console.error("Erro ao modificar o registro! "+err)
		})
	})

	// DELETE O.S
	app.post('/delete', urlencodedParser, (req, res) => {
	//CONSULTA BANCO DE DADOS
		db.deleteOne({_id: req.body.id_os}).then(async (data)=> {
			console.log('Registro deletado com sucesso!')
			res.redirect("/dashboard")
		}).catch((err) => {
			console.log("Houve um erro ao deletar o registro! "+err)
			// res.redirect('/view_os/'+req.body.id_os);
			res.redirect("/dashboard")
		})		
	})



// VIEW O.S
	app.get('/view_os/:id', (req, res) => {
	//CONSULTA BANCO DE DADOS
		db.find({_id: req.params.id}).then(async (data)=> {
			res.render('view_os',{
				data: data.map(data => data.toJSON()),
			})
		}).catch((err) => {
			console.log(err)
		})		
	})


	// BAIXA O ARQUIVO FORMATADO
	app.post('/download', urlencodedParser, (req, res) => {
		// pesquisa a o.s no banco de dados a partir do _id
		db.find({_id: req.body.id_os}).then(async (data)=> {
			// Renderiza a pagina com o handlebars e armazena a renderização na variavel "conteudo"
			await hb.render(path.join(__dirname, "views/view_os.handlebars"),{
				data: data.map(data => data.toJSON()),
			}).then((renderedHtml) => {
				conteudo = renderedHtml;
   			}).catch((err) => {
   				console.error('Erro ao salvar o modelo na variavel \'contetuo\': '+ err)
   			});
			// GERA O PDF
				let options = { format: 'A4', path: "./meupdf.pdf" };
				let file = {content: conteudo};
				pdf.generatePdf(file, options).then(pdfBuffer => {
				  console.log("PDF Buffer:-", pdfBuffer);
				});
			// Redireciona para a pagina anterior		
			res.redirect('/view_os/'+req.body.id_os);
		}).catch((err) => {
			console.error('Erro ao realizar o download '+ err)
			res.redirect('/view_os/'+req.body.id_os);
		})
	})

	app.post('/modificar', urlencodedParser, (req, res) =>{
		db.find({_id: req.body.id_os}).then(async (data)=> {
			res.render("update_os", {data: data.map(data => data.toJSON())})
		}).catch((err) => {
			console.log("Erro ao modificar: "+err)
		})
	})







//SERVIDOR	
	const PORT = process.env.PORT || 8081;
	app.listen(PORT, function(){
		console.log('Servidor rodando PORT: ' + PORT);
	})
