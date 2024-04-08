var express = require('express');
var router = express.Router();
var Pessoa = require('../controllers/pessoa');

router.get('/', function (req, res, next) {
	Pessoa.list()
		.then(dados => res.jsonp(dados))
		.catch(erro => res.jsonp(erro));
});

router.get('/:id', function (req, res, next) {
	Pessoa.findById(req.params.id)
		.then(dados => res.jsonp(dados))
		.catch(erro => res.jsonp(erro));
});

router.post('/', function (req, res, next) {
	Pessoa.insert(req.body)
		.then(dados => res.status(201).jsonp(dados))
		.catch(erro => res.status(523).jsonp(erro));
});

router.put('/:id', function (req, res, next) {
	Pessoa.update(req.body)
		.then(dados => res.status(202).jsonp(dados))
		.catch(erro => res.status(524).jsonp(erro));
});

router.delete('/:id', function (req, res, next) {
	Pessoa.remove(req.params.id)
		.then(dados => res.status(203).jsonp(dados))
		.catch(erro => res.status(525).jsonp(erro));
});

module.exports = router;