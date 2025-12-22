document.addEventListener("DOMContentLoaded", function () {

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile || isTablet) {
        alert("Aviso: La web no tiene ads por default, pero los reproductores si. Para mejor experiencia use Brave Browser o similares.");
    }

    document.getElementById("animeSearch").addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombre_anime = document.getElementById("animeName").value;

        const simplificarBuscador = document.querySelector(".buscador");
        const simplificarForm = document.querySelector(".animeSearch");
        const animeNameNav = document.querySelector(".animeName");
        simplificarBuscador.classList.add("simplificarBuscador");
        simplificarForm.classList.add("simplyForm");
        animeNameNav.classList.add("animeNameNav");
        const loader = document.createElement("div");
        loader.classList.add("loader");
        document.body.appendChild(loader);

        /* Limpiar resultados anteriores de animes*/
        const mostrarAnime = document.querySelector(".mostrarAnime");
        mostrarAnime.classList.add("esconderAnime");

        const listCap = document.querySelector(".list-cap");
        listCap.innerHTML = "";

        const reproductor = document.querySelector(".reproductor");
        reproductor.innerHTML = "";

        try {
            const respuesta = await fetch("/api/BuscarAnime", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre_anime: nombre_anime })
            });

            const datos = await respuesta.json();
            console.log(datos);

            const listAnimes = document.querySelector(".nombre_anime");

            listAnimes.innerHTML = "";

            console.log(datos.listado.Titulo);

            datos.listado.Titulo.forEach((titulo, i) => {
                const a = document.createElement("a");
                a.innerHTML = `<img src="${datos.listado.Img[i + 1]}" alt="${titulo}">
                <p>${titulo}</p>`;
                a.classList.add(`card`);
                listAnimes.appendChild(a);
            });

            loader.remove();
        }
        catch (error) {
            console.log(error);
        }

        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.addEventListener("click", async function () {
                console.log(card.innerText);
                const respuesta = await fetch("/api/SeleccionAnime", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nombre_anime: card.innerText })
                });

                const datos = await respuesta.json();

                const mostrarAnime = document.querySelector(".mostrarAnime");
                mostrarAnime.classList.remove("esconderAnime");

                const listAnime = document.getElementsByClassName("nombre_anime")[0];
                listAnime.innerHTML = "";
                const titulo = document.getElementsByClassName("titulo")[0];
                const sipnosis = document.getElementsByClassName("sipnosis")[0];
                const img = document.getElementsByClassName("img")[0];
                const listCap = document.getElementsByClassName("list-cap")[0];
                titulo.innerHTML = datos.Informacion[0].Titulo;
                sipnosis.innerHTML = datos.Informacion[0].Sipnosis;
                img.src = datos.Informacion[0].Img;
                datos.Informacion[0].Cap.forEach(cap => {

                    const episodios = Array.isArray(cap);

                    if (episodios) {
                        cap.forEach(ep => {
                            const li = document.createElement("li");
                            li.innerHTML = ep;
                            li.classList.add("ep");
                            li.addEventListener("click", async function () {
                                selectCap(titulo.textContent, li.innerText);
                            });
                            listCap.appendChild(li);
                        });
                    }
                });
            });
        });
    });
});

async function selectCap(anime, ep) {
    console.log(anime, ep.textContent);
    const respuesta = await fetch("/api/SeleccionCap", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre_anime: anime, selectEP: ep })
    });

    const datos = await respuesta.json();

    console.log(datos);

    const reproductor = document.getElementsByClassName("reproductor")[0];
    const loader = document.createElement("div");
    loader.classList.add("loader");
    reproductor.appendChild(loader);
    reproductor.innerHTML = "";
    console.log(datos);

    servidores = datos.Url[0];
    const navServer = document.createElement("ul");
    navServer.classList.add("navServer");
    reproductor.appendChild(navServer);
    servidores.SUB.forEach(s => {
        url = s.code;
        navServer.innerHTML += `<li><a id="server" onclick="selectServer('${url}')">${s.title}</a></li>`;
    });
    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "800px";
    iframe.frameBorder = "0";
    iframe.setAttribute("allow", "autoplay");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.sandbox = "allow-scripts allow-same-origin allow-forms";
    reproductor.appendChild(iframe);
}

function selectServer(url) {
    const iframe = document.getElementsByTagName("iframe")[0];
    iframe.src = url;
}

/* Actualizar vercel por dios */