import json

def pertence(periodo, periodos):
    for p in periodos:
        if p['nome'] == periodo:
            return True
    return False

def getPeriodoName(periodo, periodos):
    for p in periodos:
        if p['nome'] == periodo:
            return p['id']

def parseComps(compositores, periodos):
    for compositor in compositores:
        compositor['periodo'] = {'id': getPeriodoName(compositor['periodo'], periodos), 'nome': compositor['periodo']}
    return compositores

def main():
    with open('compositores.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

        periodos = []

        for compositor in data['compositores']:
            periodo = compositor['periodo']
            if pertence(periodo, periodos):
                for p in periodos:
                    if p['nome'] == periodo:
                        p['compositores'].append({'id': compositor['id'], 'nome': compositor['nome']})
            else:
                periodos.append({'id': 'P' + str(len(periodos) + 1), 'nome': periodo, 'compositores': [{'id': compositor['id'], 'nome': compositor['nome']}]})

        newData = {
            'compositores': parseComps(data['compositores'], periodos),
            'periodos': periodos
        }

        with open('compositores2.json', 'w', encoding='utf-8') as file:
            json.dump(newData, file, indent=4, ensure_ascii=False)

if __name__ == '__main__':
    main()
