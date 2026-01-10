import requests
import re
import json
import random


class Anime():
    def __init__(self):
        pass

    def Buscar_anime(self, name_anime):
        try:
            name_anime = name_anime.replace(" ", "-")
            response = requests.get(f"https://www3.animeflv.net/browse?q={name_anime}")
            print("¡Conexión exitosa! El navegador se abrió correctamente.")
            listadoAnimes = []
            titulos = []
            imgs = []
            links = []

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

                listadoAnimes = ({"Titulo": titulos, "Img": imgs, "Link": links})


                return listadoAnimes
            else:
                print("Error al obtener la página web")
            
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


            info.append({"Titulo": titulo, "Sipnosis": sipnosis1, "Img": imgs, "Cap": listEps})
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

                sipnosis = ""
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