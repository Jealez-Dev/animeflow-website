from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from queue import Queue

class poolDriver():
    def __init__(self, size=3):
        self.option = Options()
        self.option.add_argument("--no-sandbox")
        self.option.add_argument("--disable-dev-shm-usage")
        self.option.add_argument("--start-maximized")
        self.option.add_argument("--headless")
        self.option.add_argument("--disable-gpu")
        self.option.add_argument("--window-size=1920,1080")
        self.pool = Queue(maxsize=size)
        for _ in range(size):
            self.pool.put(webdriver.Chrome(options=self.option))
    
    def get_driver(self):
        return self.pool.get()
    
    def return_driver(self, driver):
        driver.delete_all_cookies()       
        self.pool.put(driver)

    def close(self):
        for _ in range(self.pool.qsize()):
            driver = self.pool.get()
            driver.quit()

class Anime():
    def __init__(self):
        self.pool = poolDriver()

    def Buscar_anime(self, name_anime):
        try:
            driver = self.pool.get_driver()
            esperar = WebDriverWait(driver, 10)
            name_anime = name_anime.replace(" ", "-")
            driver.get(f"https://www3.animeflv.net/browse?q={name_anime}")
            print("¡Conexión exitosa! El navegador se abrió correctamente.")

            resultado = esperar.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "ul.ListAnimes li")))

            listadoAnimes = []
            for ani in resultado:
                titulo = ani.find_element(By.CSS_SELECTOR, "article.Anime a h3.Title").text
                link = ani.find_element(By.CSS_SELECTOR, "article.Anime a").get_attribute("href")
                img = ani.find_element(By.CSS_SELECTOR, "article.Anime a img").get_attribute("src")
                listadoAnimes.append({"titulo": titulo, "link": link, "img": img})
            return listadoAnimes    
        except Exception as e:
            print(e)
            self.pool.close()
        finally:
            self.pool.return_driver(driver)

    def listado_anime(self, name_anime):
        return self.Buscar_anime(name_anime)

    def select_anime(self, name_anime):
        try:
            name = name_anime.replace(" ", "-").lower()
            info = []
            driver = self.pool.get_driver()
            driver.get(f"https://www3.animeflv.net/anime/{name}")
            print(f"https://www3.animeflv.net/anime/{name}")
            esperar = WebDriverWait(driver, 10)

            titulo = name_anime

            sipnosis = driver.find_element(By.CSS_SELECTOR, "div.Description p").text

            img = driver.find_element(By.CSS_SELECTOR, "div.Image img").get_attribute("src")

            esperar.until(EC.presence_of_element_located((By.CSS_SELECTOR, "ul.ListCaps")))

            sort = driver.find_element(By.ID, "sortEpisodes")
            sort.click()

            esp = driver.find_elements(By.CSS_SELECTOR, "ul.ListCaps li")
            listCap = []
            for ep in esp:
                episode = ep.find_element(By.CSS_SELECTOR, "a p").text
                listCap.append(episode)

            info.append({"Titulo": titulo, "Sipnosis": sipnosis, "Img": img, "Cap": listCap})
            return info 
        except Exception as e:
            print(e)
            self.pool.close()
        finally:
            self.pool.return_driver(driver)
        
    def select_cap(self, name_anime, selectEP):
        try:
            name = name_anime.replace(" ", "-").lower()
            info = []
            driver = self.pool.get_driver()
            driver.get(f"https://www3.animeflv.net/anime/{name}")
            esperar = WebDriverWait(driver, 10)

            esperar.until(EC.presence_of_element_located((By.CSS_SELECTOR, "ul.ListCaps")))

            esp = driver.find_elements(By.CSS_SELECTOR, "ul.ListCaps li")
            for ep in esp:
                episode = ep.find_element(By.CSS_SELECTOR, "a p").text
                if episode == selectEP:
                    driver.get(ep.find_element(By.CSS_SELECTOR, "a").get_attribute("href"))
                    break

            okru = driver.find_element(By.CSS_SELECTOR, "[data-id='0']")
            okru.click()

            url = driver.find_element(By.CSS_SELECTOR, "iframe").get_attribute("src")
            return url     
        except Exception as e:
            print(e)
            self.pool.close()
        finally:
            self.pool.return_driver(driver)
        