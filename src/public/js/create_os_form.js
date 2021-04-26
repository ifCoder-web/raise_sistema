let form = document.querySelector("#princ_form")
let equip_prop_valor_aquis = document.querySelector("#equip_prop_valor_aquis")

// FUNCTIONS
	//FIX MOEDA
	var fix_moeda = (valor, id, element) => {
		// VALIDAÇÃO
			let valor_replace = valor.replace(/\./g, "").replace(",", ".").replace(/ /g, "").trim()
		if(Number(valor_replace)){
			let valor_fixed = Number(valor_replace).toLocaleString("pt-BR")
			element.value = valor_fixed
			//console.log(valor_fixed)
		}else{
			element.value = ""
			//console.log("Insira um valor válido")
		}
	}

	// TELEFONE MASK
	var mask_tel = (valor, id, element) => {
		// VALIDAÇÃO
			let valor_replace = valor.replace(/\(/g, "").replace(/\)/g,"").replace(/ /g, "").replace(/-/g,"").trim()
		if(Number(valor_replace)){
			if(valor_replace.length == 11){
				// CEL
				var ddd = valor_replace.slice(0,2)
				var ind = valor_replace.slice(2,3)
				var first = valor_replace.slice(3,7)
				var last = valor_replace.slice(7,11)

				element.value = `(${ddd}) ${ind} ${first}-${last}`
			}else if(valor_replace.length == 10){
				// FIX
				var ddd = valor_replace.slice(0,2)
				var first = valor_replace.slice(2,6)
				var last = valor_replace.slice(6,10)

				element.value = `(${ddd}) ${first}-${last}`
			}else{
				element.value = ""
				console.log('Digite um número válido')
			}
		}else{
			element.value = ""
			console.log('Digite um número válido')
		}
	}

	// QUANTIDADE DE HORAS TRABALHADAS
	var qtd_horas_serv = (valor, id, element) => {
		serv_tempo_init_time = document.querySelector("#serv_tempo_init_time").value
		serv_tempo_fim_time = document.querySelector("#serv_tempo_fim_time").value
		serv_tempo_horas = document.querySelector("#serv_tempo_horas")

		// TRANSFORMANDO EM SEGUNDOS
			var houToSec = (h,m) => {
				var horas = h*3600
				var min = m*60
				return horas + min
			}

			if(serv_tempo_init_time != "" && serv_tempo_fim_time != ""){
				init_sec = serv_tempo_init_time.split(':')
				end_sec = serv_tempo_fim_time.split(':')

				serv_tempo_horas.value = ((houToSec(Number(end_sec[0]),Number(end_sec[1])) - houToSec(Number(init_sec[0]),Number(init_sec[1])))/3600).toFixed(1)
			}else{
				serv_tempo_horas.value = ""
			}
	}

	// VALOR TOTAL DO SERVIÇO
	var valor_serv = (valor, id, element) => {
		var serv_valor_total = document.querySelector("#serv_valor_total")
		var valor_hora = document.querySelector("#serv_valor_p_hora").value
		var serv_tempo_horas = document.querySelector("#serv_tempo_horas").value

		// VALIDAÇÃO MOEDA
		if(valor_hora && serv_tempo_horas){			
			var val_hora_rep = valor_hora.replace(/\./g,"").replace(/,/g,".")
			var val_unformated = val_hora_rep*serv_tempo_horas
			serv_valor_total.value = Number(val_unformated).toLocaleString("pt-BR")
		}
	
	}

	// SELECT PROPRIO/CLIENTE
	var select_pro_cli = (valor, id, element) => {
		let situacao = document.querySelector("#equip_situa")
		let equip_proprio = document.querySelector("#equip-proprio")
		let equip_cliente = document.querySelector("#equip-cliente")

		if(situacao.value == "Próprio"){
			equip_cliente.setAttribute("hidden", "")
			equip_proprio.removeAttribute("hidden")
		}else if(situacao.value == "Cliente"){
			equip_proprio.setAttribute("hidden", "")
			equip_cliente.removeAttribute("hidden")
		}
	}



// EVENTS
	// BLUR
	form.addEventListener('blur', (e) => {
		let element = e.target
		let element_value = element.value
		let element_id = null
		if(element.getAttribute("id")) { element_id = element.getAttribute("id") }

		// EVENTS
		//console.log("blur "+element_id)
		if(element.classList.contains("input_moeda")) fix_moeda(element_value, element_id, element)
		if(element.classList.contains("input_tel")) mask_tel(element_value, element_id, element)
		if(element.classList.contains("hora_serv")) qtd_horas_serv(element_value, element_id, element)		
		if(element.classList.contains("output_valor")) valor_serv(element_value, element_id, element)
		
	}, true)

	// form.addEventListener('blur', (e) => {
	// 	let element = e.target
	// 	let element_value = element.value
	// 	let element_id = null
	// 	if(element.getAttribute("id")) { element_id = element.getAttribute("id") }
			
	// 	// EVENTS
	// 	if(element.classList.contains("input_moeda")) fix_moeda(element_value, element_id, element)
	// })

	form.addEventListener('change', (e) => {
		let element = e.target
		let element_value = element.value
		let element_id = null
		if(element.getAttribute("id")) { element_id = element.getAttribute("id") }

		// EVENTS
		if(element.classList.contains("situa_select")) select_pro_cli(element_value, element_id, element)
	})

	// LOAD
	window.addEventListener("load", (e) => {
		select_pro_cli()
		qtd_horas_serv()
		valor_serv()
	})