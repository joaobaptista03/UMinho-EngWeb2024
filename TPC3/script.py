import json

with open('filmes.json', 'r') as file:
    filmes = json.load(file)

def getByName(array, name):
    for item in array:
        if item['name'] == name:
            return item
    return None

def pertence(array, name):
    for item in array:
        if item['name'] == name:
            return True
    return False

def formatFilmes(filmes):
    
    for filme in filmes['filmes']:
        keys = list(filme.keys())
        if 'title' not in keys:
            filme['title'] = 'Unknown'
        if 'year' not in keys:
            filme['year'] = 'Unknown'
        if 'cast' not in keys:
            filme['cast'] = []
        if 'genres' not in keys:
            filme['genres'] = []

    return filmes

def getAtores(filmes):
    atores = []
    for filme in filmes['filmes']:
        atoresFilme = filme['cast']
        for ator in atoresFilme:
            if pertence(atores, ator) == False:
                newAtor = {
                    'id': len(atores) + 1,
                    'name': ator,
                    'movies': [filme['title']]
                }
                atores.append(newAtor)
            else:
                thisAtor = getByName(atores, ator)
                thisAtor['movies'].append(filme['title'])

    return atores

def getGeneros(filmes):
    generos = []
    for filme in filmes['filmes']:
        generosFilme = filme['genres']
        for genero in generosFilme:
            if pertence(generos, genero) == False:
                newGenero = {
                    'id': len(generos) + 1,
                    'name': genero,
                    'movies': [filme['title']]
                }
                generos.append(newGenero)
            else:
                thisGenero = getByName(generos, genero)
                thisGenero['movies'].append(filme['title'])
    return generos

formattedFilms = formatFilmes(filmes)

bd = {
    "filmes": formattedFilms['filmes'],
    "atores": getAtores(formattedFilms),
    "generos": getGeneros(formattedFilms)
}

with open('filmes2.json', 'w') as file:
    json.dump(bd, file, indent=4)