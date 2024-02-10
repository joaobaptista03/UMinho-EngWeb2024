import os
import xml.etree.ElementTree as ET

source_directory = './MapaRuas/texto'
output_directory = './ruasSite'

preHTML = """
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>{title}</title>
        <meta charset="UTF-8">
        <meta nome="viewport" content="width=device-width, initial-scale=1" >
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-purple">
                <h3>{rua_nome}</h3>
            </header>
            <div class="w3-container">
"""

posHTML = """
            </div>
            <footer class="w3-container w3-purple">
                <h5>Generated by RuasDeBraga::EngWeb2024::A100705</h5>
                <address>
                    <a href="index.html">Voltar à página principal</a>
                </address>
            </footer>
        </div>
    </body>
</html>
"""

def generate_html_content(root):
    content = ""
    
    for para in root.findall('.//corpo/para'):
        content += f"<p>{ET.tostring(para, method='text', encoding='unicode')}</p>"
    
    for figura in root.findall('.//figura'):
        image_path = "../MapaRuas/" + figura.find('.//imagem').get('path').replace("../", "")
        caption = figura.find('.//legenda').text
        content += f"<figure><img src='{image_path}' style='max-width: 100%;height: auto;' alt='{caption}'><figcaption>{caption}</figcaption></figure>"
    
    casas = root.find('.//lista-casas')
    if casas is not None:
        content += "<ul><br>"
        for casa in casas.findall('.//casa'):
            casa_num = casa.find('.//número').text
            enfiteuta = casa.find('.//enfiteuta')
            enfiteuta_text = enfiteuta.text if enfiteuta is not None and enfiteuta.text is not None else "Não existe enfiteuta"
            foro = casa.find('.//foro')
            foro_text = foro.text if foro is not None and foro.text is not None else "Não existe foro"
            desc = casa.find('.//desc/para')
            desc_text = ET.tostring(desc, method='text', encoding='unicode').strip() if desc is not None else ""
            content += f"<li>Casa número {casa_num}<br>Enfiteuta: {enfiteuta_text}<br>Foro: {foro_text}<br>Descrição: {desc_text}</li><br>"
        content += "</ul><br>"
    
    return content

for filenome in os.listdir(source_directory):
    if filenome.endswith('.xml'):
        file_path = os.path.join(source_directory, filenome)
        
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        rua_numero = root.find('.//meta/número').text
        rua_nome = root.find('.//meta/nome').text
        
        output_filenome = f"{rua_numero}-{rua_nome.replace(' ', '')}.html"
        output_file_path = os.path.join(output_directory, output_filenome)
        
        dynamic_content = generate_html_content(root)
        
        full_html = preHTML.format(title=f"{rua_nome}", rua_nome = rua_nome) + dynamic_content + posHTML
        
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(full_html)