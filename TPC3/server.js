var http = require('http');
var url = require('url');
var fs = require('fs');
var axios = require('axios');

function getFilmes(filmes) {
    pagHTML = `
<!DOCTYPE html>
<html>
    <head>
        <title>Lista de Filmes</title>
        <link rel="stylesheet" type="text/css" href="../w3.css">
    </head>

    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-purple">
                <h1>Lista de Filmes</h1>
                <a href="/">Página Inicial</a>
            </header>

            <div class="w3-container">
                <table class="w3-table w3-stripped">
                    <tr>
                        <th>Identificador</th>
                        <th>Nome</th>
                        <th>Ano</th>
                    </tr>`

    filmes.forEach(f => {
        pagHTML += `
<tr>
    <td><a href='/filmes/${f.id}'>${f.id}</a></td>
    <td>${f.title}</td>
    <td>${f.year}</td>
</tr>`
    })

    pagHTML += `
    </table>
    </div>

    <footer class="w3-container w3-purple">
        <h5>Generated by EngWeb2024::A100705</h5>
    </footer>
</div>
</body>
</html>`

    return pagHTML;
}

function getFilme(filme) {
    pagHTML = `
<!DOCTYPE html>
<html>
    <head>
        <title>Filme ${filme.id}</title>
        <link rel="stylesheet" type="text/css" href="../w3.css">
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-purple">
                <h1>${filme.title}</h1>
                <a href="/filmes">Lista de Filmes</a>
            </header>

            <div class="w3-container">`
            
    pagHTML += `<p><b>ID: </b>${filme.id}</p>`
    pagHTML += `<p><b>Ano: </b>${filme.year}</p>`
    if (filme.cast.length != 0) {
        pagHTML += '<p><b>Elenco: </b>'
        for (var cast in filme.cast) {
            pagHTML += filme.cast[cast];
            if (cast != filme.cast.length - 1) {
                pagHTML += ', ';
            }
        }
    }
    if (filme.genres.length != 0) {
        pagHTML += '<p><b>Géneros: </b>'
        for (var genre in filme.genres) {
            pagHTML += filme.genres[genre];
            if (genre != filme.genres.length - 1) {
                pagHTML += ', ';
            }
        }
    }

    pagHTML += `
            </div>

            <footer class="w3-container w3-purple">
                <h5>Generated by EngWeb2024::A100705</h5>
            </footer>
        </div>
    </body>
</html>`
    return pagHTML;
}

http.createServer(function(req, res) {
    var q = url.parse(req.url, true).pathname.slice(1)
    var regex = /^filmes\/[a-z0-9]{24}$/
    console.log(q)

    if (q === '') {
        serveFile('site/index.html', 'text/html; charset=utf-8', res)
    } else if (q === 'w3.css') {
        serveFile('w3.css', 'text/css', res);
    } else if (q === 'filmes') {
        axios.get('http://localhost:3000/filmes')
            .then(response => {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(getFilmes(response.data));
                res.end();
            })
            .catch(function (error) {
                console.log('Erro na obtenção de Filmes: ' + error);
            });
    } else if (regex.test(q)) {
        axios.get('http://localhost:3000/' + q)
            .then(response => {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(getFilme(response.data));
                res.end();
            })
            .catch(function (error) {
                console.log('Erro na obtenção do filme: ' + error);
            });
    } else {
        serveFile('site/404.html', 'text/html; charset=utf-8', res)
    }
}).listen(7777);

function serveFile(filePath, contentType, res) {
    fs.readFile(filePath, function(err, data) {
        if (err) {
            sendError(res);
        } else {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(data);
            res.end();
        }
    });
}

function sendError(res) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('Error reading file');
    res.end();
}