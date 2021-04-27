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
const bcrypt = require('bcryptjs')
const passport = require("passport")
require("./config/auth.js")(passport)
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
		app.use(passport.initialize())
		app.use(passport.session())
		app.use(flash())
	// Middlewares
		app.use((req, res, next) => {
			res.locals.success_msg = req.flash("success_msg");
			res.locals.error_msg = req.flash("error_msg");
			res.locals.error = req.flash("error")
			res.locals.user = req.user || null
			next()
		})

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
	// USER
		const User = require("./db/models/user.js")
	// HELPERS
		const {checkAuth} = require("./helpers/checkAuth.js")

// BANCO DE DADOS
const db = require('./db/db.js')


// ROTAS

	// const dashboard = require('./routers/dashboard.js')
	// app.use('/dashboard', rota)

	// CRIA USUARIO

	app.get('/creauser', (req, res) => {
		const novouser = new User({
			name: 'Igor Fraga',
			email: 'igor_ir6@hotmail.com',
			password: 'laranja92'
		})

		// BCRYPT
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(novouser.password, salt, (err, hash) => {
					if(err){
						console.log("erro ao gerar o hash"+err)
						req.flash("error_msg", "erro ao gerar o hash")
						res.redirect('/')
					}else{
						novouser.password = hash

						// SAVE DOCUMENT
							novouser.save(async (err, dados) => {
								if(err){
									req.flash("error_msg", "Houve um erro ao salvar o usuario!")
									res.redirect('/')
									return console.error(err)
								} 
								
								console.log('Salvo! id: ')
								req.flash("success_msg", "Usuario cadastrado com sucesso!")
								// REDIRECT
								res.redirect('/')
							})	

					}
				})
			})

	})



	// AUTHENTICATION
	app.post('/login', urlencodedParser, (req, res, next) => {
		passport.authenticate("local", {
			successRedirect: "/dashboard",
			failureRedirect: "/",
			failureFlash: true
		})(req, res, next)
	})

	app.use('/logout', checkAuth, (req, res) => {
		req.logout()
		req.flash("success_msg", "Deslogado com sucesso!")
		res.redirect("/")
	})

	app.get('/', (req, res) => {
		res.render('login.handlebars')
	})

	app.get('/dashboard', checkAuth, (req, res) => {
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
	app.get('/new_os', checkAuth, (req, res) => {

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
				req.flash("error_msg", "Erro ao se conectar com o banco de dados!")
				console.log("Erro ao gerar o numero de O.S: "+err)
				res.redirect('/dashboard')
			})

	})

	// CONFIG
	app.get('/adm/config', checkAuth, (req, res) => {
		res.render('config.handlebars')
	})	


//const _validate = require('./functions/_form_validate.js')

// CRUD

	// SALVANDO DADOS
	app.post('/save', checkAuth, urlencodedParser, async (req, res) => {
		var erros = []

		// VALIDAÇÃO
			// ORDEM

			if(!req.body.number_order || typeof req.body.number_order == undefined || req.body.number_order == null){
				erros.push({ text: "Erro no número da O.S" })
			}
			if(!req.body.abertura_data || typeof req.body.abertura_data == undefined || req.body.abertura_data == null){
				erros.push({ text: "Erro em: abertura_data" })
			}
			if(!req.body.abertura_data_hora || typeof req.body.abertura_data_hora == undefined || req.body.abertura_data_hora == null){
				erros.push({ text: "Erro em: abertura_data_hora" })
			}
			// EQUIPAMENTO
			if(!req.body.equip_name || typeof req.body.equip_name == undefined || req.body.equip_name == null){
				erros.push({ text: "Erro em: equip_name" })
			}
			// OCORRENCIA

			if(!req.body.ocor_requis || typeof req.body.ocor_requis == undefined || req.body.ocor_requis == null){
				erros.push({ text: "Erro em: ocor_requis" })
			}
			if(!req.body.ocor_data || typeof req.body.ocor_data == undefined || req.body.ocor_data == null){
				erros.push({ text: "Erro em: ocor_data" })
			}
			if(!req.body.ocor_time || typeof req.body.ocor_time == undefined || req.body.ocor_time == null){
				erros.push({ text: "Erro em: ocor_time" })
			}
			// MAO DE OBRA
			if(!req.body.serv_tec || typeof req.body.serv_tec == undefined|| req.body.serv_tec == null){
				erros.push({ text: "Erro em: serv_tec" })
			}
			if(!req.body.serv_tipo || typeof req.body.serv_tipo == undefined || req.body.serv_tipo == null){
				erros.push({ text: "Erro em: serv_tipo" })
			}
			if(!req.body.serv_complex || typeof req.body.serv_complex == undefined || req.body.serv_complex == null){
				erros.push({ text: "Erro em: serv_complex" })
			}
			if(!req.body.serv_tempo_init || typeof req.body.serv_tempo_init == undefined || req.body.serv_tempo_init == null){
				erros.push({ text: "Erro em: serv_tempo_init" })
			}
			if(!req.body.serv_tempo_init_time || typeof req.body.serv_tempo_init_time == undefined || req.body.serv_tempo_init_time == null){
				erros.push({ text: "Erro em: serv_tempo_init_time" })
			}
			if(!req.body.serv_tempo_fim || typeof req.body.serv_tempo_fim == undefined || req.body.serv_tempo_fim == null){
				erros.push({ text: "Erro em: serv_tempo_fim" })
			}
			if(!req.body.serv_tempo_fim_time || typeof req.body.serv_tempo_fim_time == undefined || req.body.serv_tempo_fim_time == null){
				erros.push({ text: "Erro em: serv_tempo_fim_time" })
			}
			if(!req.body.serv_tempo_horas || typeof req.body.serv_tempo_horas == undefined || req.body.serv_tempo_horas == null){
				erros.push({ text: "Erro em: serv_tempo_horas" })
			}


			if(erros.length > 0){
				console.log(erros)
				req.flash("error_msg", "Houve um erro ao salvar a O.S!"+erros)
				res.redirect("/new_os")
			}else{
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
						req.flash("error_msg", "Houve um erro!")
						res.redirect('/new_os/')
						return console.error(err)
					} 
					const id = dados._id
					console.log('Salvo! id: ' + id)
					req.flash("success_msg", "Ordem de serviço cadastrada com sucesso!")
					// REDIRECT
					res.redirect('/view_os/'+ id)
				})	

			}

		
	})

	// UPDATE O.D
	app.post('/update/:id', checkAuth, urlencodedParser, async (req, res) => {

		var erros = []

		// VALIDAÇÃO
			// ORDEM

			if(!req.body.number_order || typeof req.body.number_order == undefined || req.body.number_order == null){
				erros.push({ text: "Erro no número da O.S" })
			}
			if(!req.body.abertura_data || typeof req.body.abertura_data == undefined || req.body.abertura_data == null){
				erros.push({ text: "Erro em: abertura_data" })
			}
			if(!req.body.abertura_data_hora || typeof req.body.abertura_data_hora == undefined || req.body.abertura_data_hora == null){
				erros.push({ text: "Erro em: abertura_data_hora" })
			}
			// EQUIPAMENTO
			if(!req.body.equip_name || typeof req.body.equip_name == undefined || req.body.equip_name == null){
				erros.push({ text: "Erro em: equip_name" })
			}
			// OCORRENCIA
			if(!req.body.ocor_requis || typeof req.body.ocor_requis == undefined || req.body.ocor_requis == null){
				erros.push({ text: "Erro em: ocor_requis" })
			}
			if(!req.body.ocor_data || typeof req.body.ocor_data == undefined || req.body.ocor_data == null){
				erros.push({ text: "Erro em: ocor_data" })
			}
			if(!req.body.ocor_time || typeof req.body.ocor_time == undefined || req.body.ocor_time == null){
				erros.push({ text: "Erro em: ocor_time" })
			}
			// MAO DE OBRA
			if(!req.body.serv_tec || typeof req.body.serv_tec == undefined|| req.body.serv_tec == null){
				erros.push({ text: "Erro em: serv_tec" })
			}
			if(!req.body.serv_tipo || typeof req.body.serv_tipo == undefined || req.body.serv_tipo == null){
				erros.push({ text: "Erro em: serv_tipo" })
			}
			if(!req.body.serv_complex || typeof req.body.serv_complex == undefined || req.body.serv_complex == null){
				erros.push({ text: "Erro em: serv_complex" })
			}
			if(!req.body.serv_tempo_init || typeof req.body.serv_tempo_init == undefined || req.body.serv_tempo_init == null){
				erros.push({ text: "Erro em: serv_tempo_init" })
			}
			if(!req.body.serv_tempo_init_time || typeof req.body.serv_tempo_init_time == undefined || req.body.serv_tempo_init_time == null){
				erros.push({ text: "Erro em: serv_tempo_init_time" })
			}
			if(!req.body.serv_tempo_fim || typeof req.body.serv_tempo_fim == undefined || req.body.serv_tempo_fim == null){
				erros.push({ text: "Erro em: serv_tempo_fim" })
			}
			if(!req.body.serv_tempo_fim_time || typeof req.body.serv_tempo_fim_time == undefined || req.body.serv_tempo_fim_time == null){
				erros.push({ text: "Erro em: serv_tempo_fim_time" })
			}
			if(!req.body.serv_tempo_horas || typeof req.body.serv_tempo_horas == undefined || req.body.serv_tempo_horas == null){
				erros.push({ text: "Erro em: serv_tempo_horas" })
			}

			if(erros.length > 0){
				console.log(erros)
				req.flash("error_msg", "Houve um erro ao salvar a O.S!")
				res.redirect('/view_os/'+req.params.id)
			}else{

				//CONSULTA BANCO DE DADOS
				await db.updateOne({_id: req.params.id},{
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
				}).then(() => {
					req.flash("success_msg", "Ordem de serviço modificada com sucesso!")
					console.log("Modificado!")
					res.redirect('/view_os/'+req.params.id)
				}).catch((err) => {
					req.flash("error_msg", "Erro ao moificar a Ordem de Serviço!")
					console.error("Erro ao modificar o registro! "+err)
					res.redirect('/view_os/'+req.params.id)
				})
			}
	
	})

	// DELETE O.S
	app.post('/delete', checkAuth, urlencodedParser, (req, res) => {
	//CONSULTA BANCO DE DADOS
		db.deleteOne({_id: req.body.id_os}).then(async (data)=> {
			req.flash("success_msg", "Ordem de Serviço deletada com sucesso!")
			res.redirect("/dashboard")
		}).catch((err) => {
			req.flash("error_msg", "Houve um erro ao deletar a Ordem de Serviço!")
			console.log("Houve um erro ao deletar o registro! "+err)
			res.redirect("/dashboard")
		})		
	})



// VIEW O.S
	app.get('/view_os/:id', checkAuth, (req, res) => {
	//CONSULTA BANCO DE DADOS
		db.find({_id: req.params.id}).then(async (data)=> {
			res.render('view_os',{
				data: data.map(data => data.toJSON()),
			})
		}).catch((err) => {
			req.flash("error_msg", "Houve um erro ao tentar visualizar a Ordem de Serviço!")
			console.log("Houve um erro ao tentar visualizar a Ordem de Serviço!"+err)
			res.redirect("/dashboard")
		})		
	})


	// BAIXA O ARQUIVO FORMATADO
	app.post('/download', checkAuth, urlencodedParser, (req, res) => {
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
				await pdf.generatePdf(file, options).then(pdfBuffer => {
				  	console.log("PDF Buffer:-", pdfBuffer);
				  	req.flash("success_msg", "PDF gerado com sucesso!")
				}).catch((err) => {
					req.flash("error_msg", "Houve um erro ao gerar o arquivo!")
					console.error('Houve um erro ao gerar o arquivo! '+ err)
				});
			// Redireciona para a pagina anterior	
			res.redirect('/view_os/'+req.body.id_os);
		}).catch((err) => {
			req.flash("error_msg", "Erro ao se comunicar com o banco de dados!")
			console.error('Erro ao realizar o download '+ err)
			res.redirect('/view_os/'+req.body.id_os);
		})
	})

	app.post('/modificar', checkAuth, urlencodedParser, (req, res) =>{
		db.find({_id: req.body.id_os}).then(async (data)=> {
			res.render("update_os", {
				data: data.map(data => data.toJSON()),
				id: req.body.id_os
			})
		}).catch((err) => {
			req.flash("error_msg", "Erro ao acessar a guia /modificar!")
			console.log("Erro ao modificar: "+err)
			res.redirect("/dashboard")
		})
	})







//SERVIDOR	
	const PORT = process.env.PORT || 8081;
	app.listen(PORT, function(){
		console.log('Servidor rodando PORT: ' + PORT);
	})
