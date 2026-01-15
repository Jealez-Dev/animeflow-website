import cloudscraper
import requests
import re
import json
import random
import cloudscraper
from curl_cffi import requests as curl_requests
from dotenv import load_dotenv
import os


class Anime():
    def __init__(self):
        load_dotenv()

    def Buscar_anime(self, name_anime=None, year=None, genre=None, type=None, status=None, order=None, page=None):
        try:
            params = {
                "q": name_anime or None,
                "year[]": year or None,
                "genre[]": genre or None,
                "type[]": type or None,
                "status[]": status or None,
                "order": order or None,
                "page": page or None
            }
            response = requests.get(f"https://www3.animeflv.net/browse", params=params)
            print(response.url)
            print("¡Conexión exitosa! El navegador se abrió correctamente.")
            listadoAnimes = []
            titulos = []
            imgs = []
            links = []
            TotalPage = 0

            if response.status_code == 200:
                html = response.text

                tituloMatch = re.finditer(r'<h3 class="Title">(.*?)</h3>', html, re.DOTALL)
                for titulo in tituloMatch:
                    titulo = titulo.group(1)
                    titulos.append(titulo)

                imgMatch = re.finditer(r'<img src="https://animeflv.net/uploads/animes/covers/(.*?)" alt="(.*?)">', html, re.DOTALL)
                for img in imgMatch:
                    img = img.group(1)
                    url_img = f"https://animeflv.net/uploads/animes/covers/{img}"
                    imgs.append(url_img)

                linkMatch = re.finditer(r'<a href="/anime/(.*?)">', html, re.DOTALL)
                for link in linkMatch:
                    link = link.group(1)
                    links.append(link)

                pageMatch = re.findall(r'[?&]page=(\d+)(?="|&)', html, re.DOTALL)
                if not pageMatch:
                   TotalPage = 1
                
                TotalPage = max([int(page) for page in pageMatch])

                listadoAnimes = ({"Titulo": titulos, "Img": imgs, "Link": links, "Page": TotalPage})


                return listadoAnimes
            else:
                print("Estado de la pagina web: ", response.status_code)
            
        except Exception as e:
            print(e)

    def listado_anime(self, name_anime):
        return self.Buscar_anime(name_anime)

    def select_anime(self, name_anime):
        try:
            name = name_anime
            info = []
            response = requests.get(f"https://www3.animeflv.net/anime/{name}")

            titulo = name_anime
            sipnosis1 = []
            imgs = []
            listEps = []
            screenshots = []

            if response.status_code == 200:
                html = response.text

                sipnosis = re.finditer(r'<div class="Description">(.*?)</div>', html, re.DOTALL)
                for sip in sipnosis:
                    sip = re.finditer(r'<p>(.*?)</p>', sip.group(1), re.DOTALL)
                    for s in sip:
                        s = s.group(1)
                        sipnosis1.append(s)

                img = re.finditer(r'<div class="Image">(.*?)</div>', html, re.DOTALL)
                for im in img:
                    im = im.group(1)
                    im = re.finditer(r'<img src="(.*?)" alt="(.*?)">', im, re.DOTALL)
                    for i in im:
                        i = i.group(1)
                        imgs.append(f"https://www3.animeflv.net/{i}")

                anime_idFLV = re.finditer(r'var anime_info = (.*?);', html, re.DOTALL)
                for anime in anime_idFLV:
                    anime = anime.group(1)
                    anime = json.loads(anime)
                    anime_id = anime[0]

                numEp = []
                episodres = re.finditer(r'var episodes = (.*?);', html, re.DOTALL)
                if episodres:
                   for ep in episodres:
                       ep = json.loads(ep.group(1))
                       
                       for num in ep:
                           num = num[0]
                           numEp.append(num)
                           screenUrl = f"https://cdn.animeflv.net/screenshots/{anime_id}/{num}/th_3.jpg"
                           screenshots.append(screenUrl)

                numEp.reverse()
                screenshots.reverse()
                listEps.append({"Num": numEp, "Screen": screenshots})

                anime_title = re.finditer(r'<h1 class="Title">(.*?)</h1>', html, re.DOTALL)
                for title in anime_title:
                    title = title.group(1)
                    titulo = title

                print("Date fa-calendar" in html) # ¿Existe la clase?

                date_next_ep = ""
                estado = re.search(r'<span class="fa-tv">(.*?)</span>', html)
                estado = estado.group(1)
                print(estado)
                if estado == "En emision":
                    print("paso por aca")
                    date_next_ep = re.search(r'var\s+anime_info\s*=\s*(\[.*?\]);', html, re.DOTALL)
                    date_next_ep = date_next_ep.group(1).strip()
                    date_next_ep = json.loads(date_next_ep)
                    date_next_ep = date_next_ep[3]
                    estado = True
                else:
                    estado = False

            info.append({"Titulo": titulo, "Sipnosis": sipnosis1, "Img": imgs, "Estado": estado, "Cap": listEps, "Date": date_next_ep})
            return info 
        except Exception as e:
            print(e)
      
    def select_cap(self, name_anime):
        try:
            info = []
            response = requests.get(f"https://www3.animeflv.net/ver/{name_anime}")
            print(name_anime)

            if response.status_code == 200:
                print("¡Conexión exitosa! El navegador se abrió correctamente.")
                html = response.text

                servidores = re.search(r'var videos = (.*?);', html, re.DOTALL)
                datos = json.loads(servidores.group(1))

                lista_servidores = datos.get('SUB', [])

                for s in lista_servidores:
                    info.append({"nombre": s.get('title'), "url": s.get('code')})

                serverHD = self.servidoresHDAnimeFelix(name_anime)
                for item in serverHD:
                    if "mp4upload.com" in item.get('url'):
                        info.append({"nombre": "Mp4upload 1080p", "url": item.get('url')})
                    elif "ironhentai.com" in item.get('url'):
                        if item.get('server_index') == "1":
                            info.append({"nombre": "Ironhentai 1080p", "url": item.get('url')})

                return info
            else:
                print("Error al obtener la página web", response.status_code)
                
            return info   
        except Exception as e:
            print(e)

    def anime_random(self):
        try:
            response = requests.get("https://www3.animeflv.net/")
            if response.status_code == 200:
                html = response.text

                titulos = []
                tituloMatch = re.finditer(r'<h3 class="Title">(.*?)</h3>', html, re.DOTALL)
                for titulo in tituloMatch:
                    titulo = titulo.group(1)
                    titulos.append(titulo)

                titulo_random = random.choice(titulos)

                portada = ""
                img = re.finditer(rf'<img [^>]*src="([^"]*)" [^>]*alt="{re.escape(titulo_random)}"', html, re.DOTALL)
                for i in img:
                    i = i.group(1)
                    portada = f"https://www3.animeflv.net/{i}"

                sipnosisMatch = re.finditer(r'<div class="Description">.*?<p>.*?</p>.*?<p>(.*?)</p>', html, re.DOTALL)
                
                descripcion = ""
                for match in sipnosisMatch:
                    divTitulo = match.group(0)
                    if re.search(titulo_random, divTitulo):
                        descripcion = match.group(1)
                        break

                link = ""
                linkMatch = re.finditer(rf'<a href="(/anime/[^"]+)"[^>]*>(?:(?!<a href=").)*?alt="{titulo_random}"', html, re.DOTALL)
                for link in linkMatch:
                    link = link.group(1).replace("/anime/", "")
                    break

                info = []
                info.append({"Titulo": titulo_random, "Sipnosis": descripcion, "Img": portada, "Link": link})
                return info 
            else:
                print("Error al obtener la página web")
            
        except Exception as e:
            print(e)

    def animes_Recientes(self):
        try:
            response = requests.get("https://www3.animeflv.net/")
            if response.status_code == 200:
                html = response.text

                titulos = []
                tituloMatch = re.finditer(r'<h3 class="Title">(.*?)</h3>', html, re.DOTALL)
                for titulo in tituloMatch:
                    titulo = titulo.group(1)
                    titulos.append(titulo)

                portadas = []
                patron = r'<article[^>]*>.*?<figure>.*?<img src="([^"]*)"[^>]*alt="(.*?)"'

                matches = re.finditer(patron, html, re.DOTALL)

                for match in matches:
                    img_url = match.group(1)
                    portadas.append(f"https://www3.animeflv.net{img_url}")

                links = []
                linkMatch = re.finditer(r'<a class="[^>]*" href="/anime/(.*?)">', html, re.DOTALL)
                for link in linkMatch:
                    link = link.group(1)
                    links.append(link)

                info = []
                info.append({"Titulo": titulos, "Img": portadas, "Link": links})
                return info 
            else:
                print("Error al obtener la página web")
        except Exception as e:
            print(e)

    def servidoresHDAnimeFelix(self, name_anime):
        try:
            scraper = cloudscraper.create_scraper()

            response = scraper.get(f"https://animefenix2.tv/ver/{name_anime}")
            if response.status_code == 200:
                html = response.text

                pattern = r"tabsArray\['(\d+)'\]\s*=\s*\"(.*?)\";"
                matches = re.findall(pattern, html)

                links_encontrados = []

                if not matches:
                    print("No se encontraron servidores. Verifica el acceso al HTML.")
                else:
                    for index, iframe_html in matches:
                        # 2. Extraemos el 'src' dentro del string del iframe
                        src_match = re.search(r"src='(.*?)'", iframe_html)
                        if src_match:
                            full_src = src_match.group(1)
            
                            # 3. Limpiamos el link de redirección para obtener la fuente real
                            # El link real está después de 'id='
                            if 'redirect.php?id=' in full_src:
                                real_source = full_src.split('redirect.php?id=')[-1]
                                links_encontrados.append({
                                    "server_index": index,
                                    "url": real_source
                                })

                return links_encontrados
            else:
                print("Error al obtener la página web", response.status_code)
        except Exception as e:
            print(e)