const textMap = {
    1: "Decifrando Jeroglíficos",
    2: "El misterio de la letra ilegible en los exámenes",
    3: "Por: Un profesor con problemas de visión",
    4: "Desde tiempos inmemoriales, los profesores han enfrentado un desafío mayor que corregir malas respuestas: **¡descifrar la letra de los estudiantes!** Algunos dicen que es falta de práctica, otros creen que es una técnica de defensa para que los docentes no resten puntos.",
    5: "Pero, ¿qué dice la ciencia? Investigaciones sugieren que, al escribir rápido, el cerebro se enfoca más en el contenido que en la forma. Sin embargo, hay teorías más inquietantes: ¿y si los estudiantes han desarrollado un sistema secreto de escritura solo entendible entre ellos?",
    6: "¿Existe un curso secreto donde se enseña \"Caligrafía Críptica 101\"? ¿Deberían los docentes tomar clases de egiptología para corregir exámenes? El debate sigue abierto.",
};

const wrapTextToFall = () => {
    for (const id in textMap) {
        const text = textMap[id];
        const element = document.getElementById(id);
        if (!element) continue;

        let boldBuffer = null;
        for (const letter of text) {
            if (letter === "*") {
                boldBuffer = boldBuffer ? null : document.createElement("b");
                if (boldBuffer) element.appendChild(boldBuffer);
                continue;
            }

            let fallingLetter = document.createElement("span");
            fallingLetter.className = "letra";
            fallingLetter.innerHTML = letter.trim() ? letter : "&nbsp;";

            if (boldBuffer) {
                boldBuffer.appendChild(fallingLetter);
            } else {
                element.appendChild(fallingLetter);
            }
        }
    }
};

const { Engine, Render, World, Bodies } = Matter;
let engine, world, suelo, letras;

window.onload = () => {
    wrapTextToFall();
    const sonidoCaida = document.getElementById("sonidoCaida");

    engine = Engine.create();
    world = engine.world;

    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            background: "transparent",
            wireframes: false,
        },
    });

    suelo = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 20, window.innerWidth, 40, { isStatic: true, render: { fillStyle: "#333" } });
    World.add(world, suelo);

    letras = document.querySelectorAll(".letra");

    letras.forEach((letra) => {
        let delay = Math.random() * 29000 + 1000;
        setTimeout(() => {
            const rect = letra.getBoundingClientRect();
            let body = Bodies.rectangle(rect.left + rect.width / 2, rect.top + rect.height / 2, rect.width, rect.height, { restitution: 0.7 });
            World.add(world, body);
            letra.style.visibility = "hidden";
        }, delay);

        Matter.Events.on(engine, "collisionStart", () => sonidoCaida.play().catch(() => { }));
    });

    setTimeout(stopRemanentSounds, Math.max(...Array.from(letras).map(() => Math.random() * 29000 + 1000)) + 250);

    Engine.run(engine);
    Render.run(render);
};

function reiniciarLetras() {
    World.clear(world);
    World.add(world, suelo);
    letras.forEach((letra) => {
        letra.style.visibility = "visible";
    });
    stopRemanentSounds();
}

function stopRemanentSounds() {
    const sonidoCaida = document.getElementById("sonidoCaida");
    sonidoCaida.pause();
    sonidoCaida.currentTime = 0;
}
