var express = require('express');
var router = express.Router();
var Pessoa = require('../controllers/pessoa');

router.get('/', function (req, res, next) {
	var modalidades = [];
	Pessoa.list()
		.then(dados => {
			for (let i = 0; i < dados.length; i++) {
				for (let modalidade of dados[i].desportos) {
					if (modalidades.indexOf(modalidade) == -1) modalidades.push(modalidade);
				}
			}
			res.jsonp(modalidades.sort());
		})
		.catch(erro => res.jsonp(erro));
});

router.get('/:modalidade', function (req, res, next) {
	var pessoas = [];
	Pessoa.list()
		.then(dados => {
			for (let i = 0; i < dados.length; i++) {
				if (dados[i].desportos.indexOf(req.params.modalidade) != -1) pessoas.push(dados[i]);
			}
			res.jsonp(pessoas.sort());
		})
		.catch(erro => res.jsonp(erro));
});

module.exports = router;