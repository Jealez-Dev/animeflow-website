import requests
import re
import json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}

response = requests.get("https://www3.animeflv.net/browse?q=naruto", headers=headers)

if response.status_code == 200:
    print("Solicitud exitosa")
    html = response.text

    for match in re.finditer(r'<h3 class="Title">(.*?)</h3>', html, re.DOTALL):
        titulo = match.group(1)
        titulo = titulo.replace(" ", "-")
        if titulo.find(":") != -1:
            titulo = titulo.replace(":", "")
        url = f"https://www3.animeflv.net/{titulo}"    
        print(url)
        

        

    
