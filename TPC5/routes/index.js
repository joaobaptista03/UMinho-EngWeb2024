var axios = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	var d = new Date().toISOString().substring(0, 16);
	res.render('index', { titulo: 'Gestão de Compositores', data: d });
});

router.get('/compositores', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	axios.get('http://localhost:3000/compositores')
		.then(resposta => {
			res.render('listaCompositores', { titulo: 'Lista de Compositores', lista: resposta.data, data: d });
		})
		.catch(erro => {
			res.render('error', { message: 'Erro ao recuperar os compositores.', data: d })
		})
});


router.get('/compositores/registo', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	res.render('registoCompositor', { titulo: 'Registo de Compositor', data: d });
});

router.get('/compositores/editar/:idCompositor', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	axios.get('http://localhost:3000/compositores/' + req.params.idCompositor)
		.then(resposta => {
			res.render('editarCompositor', { titulo: 'Edição de Compositor', compositor: resposta.data, data: d });
		})
		.catch(erro => {
			res.render('error', { message: 'Erro ao recuperar o compositor.', data: d })
		})
})

router.get('/compositores/:idCompositor', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	axios.get('http://localhost:3000/compositores/' + req.params.idCompositor)
		.then(resposta => {
			res.render('detalhesCompositor', { titulo: 'Detalhes do Compositor', compositor: resposta.data, data: d });
		})
		.catch(erro => {
			res.render('error', { message: 'Erro ao recuperar o compositor.', data: d})
		})
});

router.get('/periodos', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	axios.get('http://localhost:3000/periodos')
		.then(resposta => {
			res.render('listaPeriodos', { titulo: 'Lista de Periodos', lista: resposta.data, data: d });
		})
		.catch(erro => {
			res.render('error', { message: 'Erro ao recuperar os periodos.', data: d })
		})

});

router.get('/periodos/:idPeriodo', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	axios.get('http://localhost:3000/periodos/' + req.params.idPeriodo)
		.then(resposta => {
			res.render('detalhesPeriodo', { titulo: 'Detalhes do Periodo', periodo: resposta.data, data: d });
		})
		.catch(erro => {
			res.render('error', { message: 'Erro ao recuperar o periodo.', data: d })
		})
});

router.get('/compositores/apagar/:idCompositor', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	axios.get('http://localhost:3000/compositores/' + req.params.idCompositor)
		.then(resposta => {
			axios.get('http://localhost:3000/periodos/' + resposta.data.periodo.id)
				.then(resposta2 => {
					resposta2.data.compositores.splice(resposta2.data.compositores.indexOf(resposta.data.id), 1);
					axios.put('http://localhost:3000/periodos/' + resposta2.data.id, resposta2.data)
						.then(resposta3 => {
							axios.delete('http://localhost:3000/compositores/' + req.params.idCompositor)
							.then(resposta => {
								res.redirect('/compositores');
							})
							.catch(erro => {
								res.render('error', { message: 'Erro ao apagar o compositor.', data: d })
							})
						})
				})
				.catch(erro => {
					res.render('error', { message: 'Erro ao recuperar o periodo.', data: d })
				})
		})
		.catch(erro => {
			res.render('error', { message: 'Erro ao recuperar o compositor.', data: d })
		})
})

router.post('/compositores/registo', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	var p_id = '';

	axios.get('http://localhost:3000/periodos')
		.then(resposta => {
			for (var i = 0; i < resposta.data.length; i++)
				if (resposta.data[i].nome === req.body.periodo) {
					p_id = resposta.data[i].id;
				}

			if (p_id == '') {
				console.log('1')
				p_id = 'P' + (resposta.data.length + 1);
				novo_periodo_temp = {
					id: p_id,
					nome: req.body.periodo,
					compositores: [
						{
							"id": req.body.id,
							"nome": req.body.nome
						}
					]
				}
				axios.post('http://localhost:3000/periodos/', novo_periodo_temp)
			} else {
				console.log('2')
				axios.get('http://localhost:3000/periodos/' + p_id)
					.then(resposta => {
						resposta.data.compositores.push({ id: req.body.id, nome: req.body.nome });
						axios.put('http://localhost:3000/periodos/' + p_id, resposta.data)
					})
					.catch(erro => {
						res.render('error', { message: 'Erro ao recuperar o periodo.', data: d })
					})
			}

			req.body.periodo = { id: p_id, nome: req.body.periodo };

			axios.post('http://localhost:3000/compositores', req.body)
			.then(resposta => {
				res.redirect('/compositores');
			})
			.catch(erro => {
				res.render('error', { message: 'Erro ao registar o compositor.', data: d })
			})
		})
		.catch(erro => {
			res.render('error', { message: 'Erro ao recuperar os periodos.', data: d })
		})
});

router.post('/compositores/editar/:idCompositor', function (req, res) {
	var d = new Date().toISOString().substring(0, 16);
	var p_id = '';

	axios.get('http://localhost:3000/periodos')
		.then(resposta => {
			for (var i = 0; i < resposta.data.length; i++)
				if (resposta.data[i].nome === req.body.periodo) {
					p_id = resposta.data[i].id;
				}


			axios.get('http://localhost:3000/compositores/' + req.body.id)
				.then(resposta2 => {
					axios.get('http://localhost:3000/periodos/' + resposta2.data.periodo.id)
						.then(resposta3 => {
							resposta3.data.compositores.splice(resposta3.data.compositores.indexOf(resposta2.data.id), 1);
							axios.put('http://localhost:3000/periodos/' + resposta3.data.id, resposta3.data)
						})
						.catch(erro => {
							res.render('error', { message: 'Erro ao recuperar o periodo.', data: d })
						})
				})
				.catch(erro => {
					res.render('error', { message: 'Erro ao recuperar o compositor.', data: d })
				})


			if (p_id == '') {
				p_id = 'P' + (resposta.data.length + 1);
				novo_periodo_temp = {
					id: p_id,
					nome: req.body.periodo,
					compositores: [
						{
							"id": req.body.id,
							"nome": req.body.nome
						}
					]
				}
				axios.post('http://localhost:3000/periodos/', novo_periodo_temp)
			} else {
				axios.get('http://localhost:3000/periodos/' + p_id)
					.then(resposta => {
						resposta.data.compositores.push({ id: req.body.id, nome: req.body.nome });
						axios.put('http://localhost:3000/periodos/' + p_id, resposta.data)
					})
					.catch(erro => {
						res.render('error', { message: 'Erro ao recuperar o periodo.', data: d })
					})
			}

			req.body.periodo = { id: p_id, nome: req.body.periodo };

			axios.put('http://localhost:3000/compositores/' + req.body.id, req.body)
			.then(resposta => {
				res.redirect('/compositores');
			})
			.catch(erro => {
				res.render('error', { message: 'Erro ao editar o compositor.', data: d })
			})
		})
		.catch(erro => {
			res.render('error', { message: 'Erro ao recuperar os periodos.', data: d })
		})
});

module.exports = router;