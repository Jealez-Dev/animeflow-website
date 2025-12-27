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

            if response.status_code == 200:
                html = response.text

                tituloMatch = re.finditer(r'<h3 class="Title">(.*?)</h3>', html, re.DOTALL)
                for titulo in tituloMatch:
                    titulo = titulo.group(1)
                    titulos.append(titulo)

                imgMatch = re.finditer(r'<img src="(.*?)" alt="(.*?)">', html, re.DOTALL)
                for img in imgMatch:
                    img = img.group(1)
                    imgs.append(img)

                listadoAnimes = ({"Titulo": titulos, "Img": imgs})
                return listadoAnimes
            else:
                print("Error al obtener la página web")
            
        except Exception as e:
            print(e)

    def listado_anime(self, name_anime):
        return self.Buscar_anime(name_anime)

    def select_anime(self, name_anime):
        try:
            name = self.name_to_url(name_anime)
            info = []
            response = requests.get(f"https://www3.animeflv.net/anime/{name}")

            titulo = name_anime
            sipnosis1 = []
            imgs = []
            listEps = []

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

                episodres = re.finditer(r'var episodes = (.*?);', html, re.DOTALL)
                if episodres:
                   for ep in episodres:
                       ep = json.loads(ep.group(1))
                       
                       numEp = [f"Episodio {e[0]}" for e in ep]
                       numEp.reverse()
                       listEps.append(numEp)

            info.append({"Titulo": titulo, "Sipnosis": sipnosis1, "Img": imgs, "Cap": listEps})
            return info 
        except Exception as e:
            print(e)
        
    def select_cap(self, name_anime, selectEP):
        try:
            name = self.name_to_url(name_anime)

            EPnum = selectEP.replace("Episodio ", "")
            EPnum = int(EPnum.replace(" ", ""))

            info = []
            response = requests.get(f"https://www3.animeflv.net/ver/{name}-{EPnum}")
            print(f"https://www3.animeflv.net/ver/{name}-{EPnum}")

            if response.status_code == 200:
                print("¡Conexión exitosa! El navegador se abrió correctamente.")
                html = response.text

                servidores = re.finditer(r'var videos = (.*?);', html, re.DOTALL)
                for s in servidores:
                    s = s.group(1)
                    s = json.loads(s)
                    print(s)
                    info.append(s)
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


                info = []
                info.append({"Titulo": titulo_random, "Sipnosis": descripcion, "Img": portada})
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

                info = []
                info.append({"Titulo": titulos, "Img": portadas})
                return info 
            else:
                print("Error al obtener la página web")
        except Exception as e:
            print(e)


    def name_to_url(self, name_anime):
        try:
            name = name_anime
            name = re.sub(r"[-:!?'()]", "", name)
            name = name.replace(" ", "-").lower()
            return name
        except Exception as e:
            print(e)

anime = Anime()
anime.animes_Recientes()