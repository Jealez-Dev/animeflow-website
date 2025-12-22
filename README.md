# AnimeFlow

AnimeFlow es una aplicación web moderna para buscar y ver tus animes favoritos. Utiliza una API personalizada construida con FastAPI para obtener información y enlaces de reproducción de diversas fuentes.

## 🚀 Características

- **Búsqueda de Animes**: Encuentra rápidamente el anime que buscas.
- **Información Detallada**: Accede a sinopsis, imágenes de portada y lista de episodios.
- **Reproducción de Episodios**: Obtén enlaces directos a los servidores de video para ver los capítulos.
- **Interfaz Intuitiva**: Diseño limpio y fácil de usar.

## 🛠️ Tecnologías Utilizadas

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)**: Framework web moderno y rápido para construir APIs con Python.
- **[Uvicorn](https://www.uvicorn.org/)**: Servidor ASGI para ejecutar la aplicación.
- **[Requests](https://docs.python-requests.org/)**: Librería para realizar peticiones HTTP y scraping.
- **[Pydantic](https://pydantic-docs.helpmanual.io/)**: Validación de datos.

### Frontend
- **HTML5 & CSS3**: Estructura y estilos de la aplicación.
- **JavaScript (Vanilla)**: Lógica del lado del cliente para interactuar con la API.

## 📦 Instalación y Ejecución Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/Jealez-Dev/anime-website.git
    cd anime-website
    ```

2.  **Crear un entorno virtual (Opcional pero recomendado):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```

3.  **Instalar las dependencias:**

    ```bash
    pip install -r requeriments.txt
    ```

4.  **Ejecutar el servidor:**

    ```bash
    uvicorn api.main:program --reload
    ```

5.  **Abrir la aplicación:**
    Abre tu navegador y ve a `http://127.0.0.1:8000` (o la dirección que indique la consola, ten en cuenta que el frontend estático puede requerir un servidor separado o configuración adicional si no se sirve directamente desde FastAPI).

## ⚠️ Aviso Legal

Este proyecto es **únicamente para fines educativos y de aprendizaje**. El contenido mostrado (imágenes, sinopsis, enlaces de video) es obtenido de fuentes externas (`animeflv.net`) mediante técnicas de web scraping. No alojamos ningún contenido protegido por derechos de autor.
