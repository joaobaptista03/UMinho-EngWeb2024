var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js') 
var static = require('./static.js')

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

var compositoresServer = http.createServer((req, res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }

    else {
        switch(req.method){
            case "GET": 
                if(req.url == "/compositores"){
                    axios.get('http://localhost:3000/compositores')
                        .then(response => {
                            var compositores = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end(templates.composersListPage(compositores, d))
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end(templates.errorPage('Lista de compositores indisponível. Tenta novamente mais tarde!', d))
                        })
                }

                else if(/^\/compositores\/C\d+$/.test(req.url)){
                    var idCompositor = req.url.split("/")[2]
                    axios.get('http://localhost:3000/compositores/' + idCompositor)
                        .then(response => {
                            var compositor = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.composerPage(compositor, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.errorPage('Compositor não encontrado.', d))
                            res.end()
                        })
                }

                else if (req.url.startsWith("/compositores?periodo=")) {
                    var periodo = req.url.split("=")[1]
                    axios.get('http://localhost:3000/compositores')
                        .then(response => {
                            var compositores = response.data
                            for (var i = 0; i < compositores.length; i++) {
                                if (compositores[i].periodo.nome != periodo) {
                                    compositores.splice(i, 1)
                                    i--
                                }
                            }
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end(templates.composersListPage(compositores, d))
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end(templates.errorPage('Lista de compositores indisponível. Tenta novamente mais tarde!', d))
                        })
                }

                else if(req.url == "/compositores/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.end(templates.composerFormPage(d))
                }

                else if(/^\/compositores\/edit\/C\d+$/.test(req.url)){
                    var idCompositor = req.url.split("/")[3]
                    axios.get('http://localhost:3000/compositores/' + idCompositor)
                        .then(response => {
                            var compositor = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.composerFormEditPage(compositor, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.errorPage('Formulário de edição indisponível. Tenta novamente mais tarde!', d))
                            res.end()
                        })
                }

                else if (/^\/compositores\/delete\/C\d+$/.test(req.url)){
                    var idCompositor = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/compositores/' + idCompositor)
                        .then(response => {
                            res.writeHead(302, {'Location': '/compositores'})
                            axios.get('http://localhost:3000/periodos')
                                .then(response => {
                                    var periodos = response.data
                                    for (var i = 0; i < periodos.length; i++) {
                                        var comps = periodos[i].compositores
                                        for (var j = 0; j < comps.length; j++) {
                                            if (comps[j].id === idCompositor) {
                                                var index = periodos[i].compositores.indexOf(comps[j])
                                                periodos[i].compositores.splice(index, 1)
                                                axios.put('http://localhost:3000/periodos/' + periodos[i].id, periodos[i])
                                            }
                                        }
                                    }
                                })
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.errorPage('Erro ao apagar compositor. Tenta novamente mais tarde!', d))
                            res.end()
                        })
                }

                else if (req.url == "/periodos") {
                    axios.get('http://localhost:3000/periodos')
                        .then(response => {
                            var periodos = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end(templates.periodsListPage(periodos, d))
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end(templates.errorPage('Lista de periodos indisponível. Tenta novamente mais tarde!', d))
                        })
                }
                
                else if(/^\/periodos\/P\d+$/.test(req.url)) {
                    var idPeriodo = req.url.split("/")[2]
                    axios.get('http://localhost:3000/periodos/' + idPeriodo)
                        .then(response => {
                            var periodo = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.periodPage(periodo, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.errorPage('Periodo não encontrado.', d))
                            res.end()
                        })
                }

                else if(req.url == "/periodos/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.end(templates.periodFormPage(d))
                }

                else if (req.url == "/") {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.end(templates.mainPage(d))
                }

                else {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(templates.errorPage("ERRO: " + req.method + " " + req.url + " nao suportado", d))
                    res.end()
                }

                break

            case "POST":
                if(req.url == "/compositores/registo"){
                    collectRequestBodyData(req, result => {
                        axios.get('http://localhost:3000/periodos?nome=' + result.periodo)
                            .then(response => {
                                if (response.data == "") {
                                    axios.get('http://localhost:3000/periodos')
                                        .then(response => {
                                            var id = response.data.length + 1
                                            axios.post('http://localhost:3000/periodos', {id: 'P' + id, nome: result.periodo, compositores: [{'id': result.id, 'nome': result.nome}]})
                                                .then(response => {
                                                    axios.post('http://localhost:3000/compositores', {id: result.id, nome: result.nome, bio: result.bio, periodo: {id: 'P' + id, nome: result.periodo}, dataNasc: result.dataNasc, dataObito: result.dataObito})
                                                    .then(response => {
                                                        res.writeHead(302, {'Location': '/compositores'})
                                                        res.end()
                                                    })
                                                    .catch(erro => {
                                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                                        res.write(templates.errorPage(erro, d))
                                                        res.end()
                                                    })
                                                })
                                                .catch(erro => {
                                                    console.log("Erro ao criar periodo!")
                                                })
                                        })
                                        .catch(erro => {
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write(templates.errorPage(erro, d))
                                            res.end()
                                        })
                                } else {
                                    axios.get('http://localhost:3000/periodos?nome=' + result.periodo)
                                        .then(response => {
                                            var id = response.data[0].id
                                            axios.post('http://localhost:3000/compositores', {id: result.id, nome: result.nome, bio: result.bio, periodo: {id: id, nome: result.periodo}, dataNasc: result.dataNasc, dataObito: result.dataObito})
                                                .then(resp => {
                                                    res.writeHead(302, {'Location': '/compositores'})
                                                    response.data[0].compositores.push({'id': result.id, 'nome': result.nome})
                                                    axios.put('http://localhost:3000/periodos/' + id, response.data[0])
                                                    res.end()
                                                })
                                                .catch(erro => {
                                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                                    res.write(templates.errorPage(erro, d))
                                                    res.end()
                                                })
                                        })
                                        .catch(erro => {
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write(templates.errorPage(erro, d))
                                            res.end()
                                        })
                                }
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(templates.errorPage(erro, d))
                                res.end()
                            })
                    })
                }

                else if(/^\/compositores\/edit\/C\d+$/.test(req.url)){
                    collectRequestBodyData(req, result => {
                        axios.get('http://localhost:3000/compositores/' + result.id)
                            .then(response => {
                                var compositor = response.data
                                axios.get('http://localhost:3000/periodos')
                                    .then(response => {
                                        var periodos = response.data
                                        for (var i = 0; i < periodos.length; i++) {
                                            var comps = periodos[i].compositores
                                            for (var j = 0; j < comps.length; j++) {
                                                if (comps[j].id === result.id) {
                                                    var index = periodos[i].compositores.indexOf(comps[j])
                                                    periodos[i].compositores.splice(index, 1)
                                                    axios.put('http://localhost:3000/periodos/' + periodos[i].id, periodos[i])
                                                }
                                            }
                                        }
                                    })
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(templates.errorPage(erro, d))
                                res.end()
                            })
                        axios.get('http://localhost:3000/periodos?nome=' + result.periodo)
                            .then(response => {
                                if (response.data == "") {
                                    axios.get('http://localhost:3000/periodos')
                                        .then(response => {
                                            var id = response.data.length + 1
                                            axios.post('http://localhost:3000/periodos', {id: 'P' + id, nome: result.periodo, compositores: [{'id': result.id, 'nome': result.nome}]})
                                                .then(response => {
                                                    axios.put('http://localhost:3000/compositores/' + result.id, {id: result.id, nome: result.nome, bio: result.bio, periodo: {id: 'P' + id, nome: result.periodo}, dataNasc: result.dataNasc, dataObito: result.dataObito})
                                                    .then(response => {
                                                        res.writeHead(302, {'Location': '/compositores'})
                                                        res.end()
                                                    })
                                                    .catch(erro => {
                                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                                        res.write(templates.errorPage(erro, d))
                                                        res.end()
                                                    })
                                                })
                                                .catch(erro => {
                                                    console.log("Erro ao criar periodo!")
                                                })
                                        })
                                        .catch(erro => {
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write(templates.errorPage(erro, d))
                                            res.end()
                                        })
                                } else {
                                    axios.get('http://localhost:3000/periodos?nome=' + result.periodo)
                                        .then(response => {
                                            var id = response.data[0].id
                                            axios.put('http://localhost:3000/compositores/' + result.id, {id: result.id, nome: result.nome, bio: result.bio, periodo: {id: id, nome: result.periodo}, dataNasc: result.dataNasc, dataObito: result.dataObito})
                                                .then(resp => {
                                                    res.writeHead(302, {'Location': '/compositores'})
                                                    response.data[0].compositores.push({'id': result.id, 'nome': result.nome})
                                                    axios.put('http://localhost:3000/periodos/' + id, response.data[0])
                                                    res.end()
                                                }
                                                )
                                                .catch(erro => {
                                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                                    res.write(templates.errorPage(erro, d))
                                                    res.end()
                                                })
                                        }
                                        )
                                        .catch(erro => {
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write(templates.errorPage(erro, d))
                                            res.end()
                                        })
                                }
                            }
                            )
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(templates.errorPage(erro, d))
                                res.end()
                            })
                    }
                    )
                }

                else {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(templates.errorPage("ERRO: " + req.method + " " + req.url + " nao suportado", d))
                    res.end()
                }
        }
    }
})

compositoresServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})


