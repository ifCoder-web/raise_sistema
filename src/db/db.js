const mongoose = require('mongoose')
const { Schema } = mongoose;

// CONNECT
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/sistema1", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
	console.log("Banco Connected!")
}).catch((err) => {
	console.error(`houve um erro ${err}`)
})



// SCHEMA 
	
	const ordemSchema = new Schema({

		// Ordem
			number_order: {
				type: Number,
				required: true,
				default: 0
			},
			abertura_data: {
				type: String,
				required: true
			},
			abertura_data_hora: {
				type: String,
				required: true
			},
		// Equipamento
			equip_name: {
				type: String,
				required: true,
				default: "--"
			},
			equip_situa: {
				type: String,
				required: true
			},
			equip_marca: {
				type: String,
				default: "--"
			},
			equip_modelo: {
				type: String,
				default: "--"
			},
			equip_number: {
				type: String,
				default: "--"
			},
			equip_prop_valor_aquis: {
				type: String,
				default: "--"
			},
			equip_prop_valor_venda: {
				type: String,
				default: "--"
			},
			nome_cliente: {
				type: String,
				default: "--"
			},
			tel_cliente: {
				type: String,
				default: "--"
			},
			email_cliente: {
				type: String,
				default: "--"
			},
			end_cliente: {
				type: String,
				default: "--"
			},
		// Ocorrencia
			ocor_requis: {
				type: String,
				required: true,
				default: "--"
			},
			ocor_data: {
				type: String,
				required: true
			},
			ocor_time: {
				type: String,
				required: true
			},
			ocor_descript: {
				type: String,
				default: "--"
			},
		// Mão de obra
			serv_tec: {
				type: String,
				required: true,
				default: "--"
			},
			serv_tipo: {
				type: String,
				required: true,
				default: "--"
			},
			serv_complex: {
				type: String,
				required: true,
				default: "--"
			},
			serv_descript: {
				type: String,
				default: "--"
			},
			serv_tempo_init: {
				type: String,
				required: true
			},
			serv_tempo_init_time: {
				type: String,
				required: true
			},
			serv_tempo_fim: {
				type: String,
				required: true
			},
			serv_tempo_fim_time: {
				type: String,
				required: true
			},
			serv_tempo_horas: {
				type: String,
				required: true,
				default: "--"
			},
			serv_valor_p_hora: {
				type: String,
				default: "--"
			},
			serv_valor_total: {
				type: String,
				default: "--"
			},
			serv_garantia: {
				type: String,
				default: "--"
			},
			serv_destino: {
				type: String,
				default: "--"
			}

	})

// MODEL mongoose.model(modelName, schema):

	const Ordem = mongoose.model('Ordem', ordemSchema);

// DOCUMENT const doc = new Model({dfsf: dsfsf})

	

// SAVE DOCUMENT 
	
	// ordem2.save((err) => {
	// 	if (err) return console.error(err)
	// 	console.log('Salvo!')
	// })

// FIND

	// Ordem.find({}, (err, response) => {
	// 	// ERROR
	// 	if (err) return console.error('err')
	// 	// CONTINUE
	// 	console.log(response)
	// })
	
// DELET

	// Ordem.deleteMany({nome: "IGOR"}, (err, response) => {
	// 	// ERROR
	// 	if (err) return console.error('err')
	// 	// CONTINUE
	// 	console.log(response)
	// })

// UPDATE

	// Ordem.updateOne({nome: "IGOR"}, {sobrenome: "FRAGUINHA"}, (err, response) => {
	// 	// ERROR
	// 	if (err) return console.error('err')
	// 	// CONTINUE
	// 	console.log(response)
	// })


module.exports = Ordem;