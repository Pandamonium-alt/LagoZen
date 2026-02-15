let lagoVideo;          // Imagen de fondo del lago
let ripples = [];     // Array de ondas activas
let gotaX, gotaDestinoY;
let gotaY = -50;      // Para simular gota cayendo
let gotaActiva = false;
let sonidoGota;
let musica1, musica2, musica3, musica4, musica5, musica6;
let musicaActual = null;
let videoIniciado = false;
let tituloActual = "";
let mostrarTitulo = false;
let tituloTiempo = 0;
let tituloDuracion = 180; // ~6 segundos a 30fps
let canciones = [];
let titulos = [];
let indiceActual = 0;          // índice de la canción actual
let btnPlay, btnNext, btnPrev; // referencias a los botones

let mensajes = [
    "Hoy irá bien",
    "Te quiero!",
    "Que guapaa!!",
    "Ánimo!!",
    "Tú puedes!♡⸝⸝",
    "TKM <3",
    "Iluminas✦✦",
    "Bonita!!",
    "I ♡ U",
    "Me encantas!!!",
    "Estás chiquita",
    "Holaaa ♡",
    "Estoy contigo",
    "Yo sé que puedes",
    "Todo está bien",
    "Ya pasó",
    "⟡ Brillas ⟡",
    "-`♡´-",
    "Hermosa⋆˚✿˖°",
    "Estoy para ti",
    "˗ˏˋ ♡ ˎˊ˗",
    "Tan linda ₊˚⊹ᰔ",
    "Háblame",
    "Obvis"
];


function preload() {
    lagoVideo = createVideo('assets/lago.mp4');
    sonidoGota = loadSound('assets/gota.mp3');
    
    // Canciones (agrega más aquí)
    musica1 = loadSound('assets/musica1.mp3');
    musica2 = loadSound('assets/musica2.mp3');
    musica3 = loadSound('assets/musica3.mp3');  // ejemplo adicional
    musica4 = loadSound('assets/musica4.mp3');
    musica5 = loadSound('assets/musica5.mp3');
    musica6 = loadSound('assets/musica6.mp3');  // ejemplo adicional

    // Array de canciones y títulos (fácil de expandir)
    canciones = [musica1, musica2, musica3, musica4, musica5, musica6];
    titulos = [
        "Girl in Red - We fell in love in October", 
        "JVKE - Her", 
        "JVKE - Golden Hour", 
        "Mitski - My love mine all mine", 
        "Stephen Sanchez - Until I Found You", 
        "Lady Gaga, Bruno Mars - Die With A Smile"];
}

let canvas;
let aspectRatio = 9 / 16;

function setup() {

    let w = windowWidth;
    let h = windowHeight;

    if (w / h > aspectRatio) {
        w = h * aspectRatio;
    } else {
        h = w / aspectRatio;
    }

    createCanvas(w, h);

    let container = createDiv();
    container.id("uiContainer");
    container.style("position", "absolute");
    container.style("left", "50%");
    container.style("top", "50%");
    container.style("transform", "translate(-50%, -50%)");
    container.style("width", width + "px");
    container.style("height", height + "px");
    container.style("pointer-events", "none");

    lagoVideo.hide();
    lagoVideo.volume(0);

    crearBotones();
}


function draw() {
    image(lagoVideo, 0, 0, width, height);
    // Ondas (ripples) — mensaje solo dentro de la onda
    for (let i = ripples.length - 1; i >= 0; i--) {
        let r = ripples[i];

        noFill();
        stroke(255, 255, 255, r.alpha);
        strokeWeight(3);
        ellipse(r.x, r.y, r.radio * 2.4, r.radio * 1.4);

        // Mostrar mensaje cuando la onda esté creciendo
        if (r.radio > 10 && r.radio < 120) {
            fill(255, r.alpha);
            noStroke();
            textSize(22);
            textAlign(CENTER, CENTER);
            text(r.mensaje, r.x, r.y - 10);
        }

        r.radio += 2;
        r.alpha -= 3;

        if (r.alpha <= 0) ripples.splice(i, 1);
    }

    // Simular gota cayendo
    if (gotaActiva) {
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = "white";

        fill(255, 255, 255, 200);
        noStroke();
        ellipse(gotaX, gotaY, 15, 15);

        gotaY += 10;

        if (gotaY >= gotaDestinoY) {
            ripples.push({
                x: gotaX,
                y: gotaDestinoY,
                radio: 10,
                alpha: 220,
                mensaje: random(mensajes),
                mostrado: false
            });
            if (sonidoGota && sonidoGota.isLoaded()) {
                sonidoGota.play();
            }
            gotaActiva = false;
        }
        drawingContext.shadowBlur = 0;
    }
    // Título fade superior adaptable al texto
    if (mostrarTitulo) {
        tituloTiempo++;
        let alpha = 255;
        if (tituloTiempo > tituloDuracion - 60) {
            alpha = map(tituloTiempo, tituloDuracion - 60, tituloDuracion, 255, 0);
        }

        // Calcular ancho del texto para que el rect se adapte
        textSize(18);
        textStyle(BOLD);
        let textoAncho = textWidth(tituloActual);
        let padding = 30;  // espacio extra a los lados
        let rectAncho = textoAncho + padding * 2;
        let rectAlto = 55; // más alto para que se vea cómodo
        let rectX = width/2 - rectAncho/2;
        let rectY = 20;

        // Fondo semi-transparente (más grande y redondeado)
        fill(0, alpha * 0.6);  // un poco más oscuro para contraste
        noStroke();
        rect(rectX, rectY, rectAncho, rectAlto, 25); // radio 25 para más redondeado

        // Texto centrado
        fill(255, alpha);
        textAlign(CENTER, CENTER);
        text(tituloActual, width/2, rectY + rectAlto/2);

        if (tituloTiempo > tituloDuracion) {
            mostrarTitulo = false;
        }
    }
}

function touchStarted(event) {

    // Si el click fue sobre un botón HTML, no hacer nada
    if (event.target.tagName === "IMG") {
        return;
    }

    if (!videoIniciado) {
        lagoVideo.loop();
        videoIniciado = true;
    }

    userStartAudio();

    let x = mouseX;
    let y = mouseY;

    let margen = 80;
    if (y < margen) y = margen;
    if (y > height - margen) y = height - margen;

    gotaX = x;
    gotaDestinoY = y;
    gotaY = 0;
    gotaActiva = true;
}



function windowResized() {

    let w = windowWidth;
    let h = windowHeight;

    if (w / h > aspectRatio) {
        w = h * aspectRatio;
    } else {
        h = w / aspectRatio;
    }

    resizeCanvas(w, h);

    btnPlay.remove();
    btnPrev.remove();
    btnNext.remove();

    crearBotones();
}



function cambiarMusica(musica, titulo) {
    if (musicaActual === musica) return;

    if (musicaActual) {
        musicaActual.stop();
    }

    musica.loop();
    musica.setVolume(0.4);
    musicaActual = musica;

    // Mostrar título fade
    tituloActual = titulo;
    mostrarTitulo = true;
    tituloTiempo = 0;

    // Cambiar icono a pause (porque empieza reproduciendo)
    btnPlay.attribute('src', 'assets/pause.png');
}

function aplicarEstiloBoton(btn) {
    btn.style('border-radius', '50%');
    btn.style('background', 'rgba(46, 238, 17, 0.08)');
    btn.style('border', 'none');
    btn.style('backdrop-filter', 'blur(12px)');
    btn.style('box-shadow', '0 8px 32px rgba(2, 255, 234, 0.93)');
    btn.style('cursor', 'pointer');
    btn.style('padding', '10px');
}

function playPause() {
    if (!musicaActual) {
        // Si no hay canción, inicia la primera
        cambiarMusica(canciones[indiceActual], titulos[indiceActual]);
        btnPlay.attribute('src', 'assets/pause.png');
        return;
    }

    if (musicaActual.isPlaying()) {
        musicaActual.pause();
        btnPlay.attribute('src', 'assets/play.png');
    } else {
        musicaActual.play();
        btnPlay.attribute('src', 'assets/pause.png');
    }
}

function siguienteCancion() {
    indiceActual = (indiceActual + 1) % canciones.length;
    cambiarMusica(canciones[indiceActual], titulos[indiceActual]);
    btnPlay.attribute('src', 'assets/pause.png'); // asume que empieza reproduciendo
}

function anteriorCancion() {
    indiceActual = (indiceActual - 1 + canciones.length) % canciones.length;
    cambiarMusica(canciones[indiceActual], titulos[indiceActual]);
    btnPlay.attribute('src', 'assets/pause.png');
}

function crearBotones() {

    let btnSize = 70;
    let spacing = 40;
    let bottomMargin = 60;

    let playSize = btnSize * 1.4;

    let centerX = width / 2;
    let centerY = height - bottomMargin;

    btnPlay = createImg('assets/play.png');
    btnPlay.parent("uiContainer"); 
    btnPlay.size(playSize, playSize);
    btnPlay.position(centerX - playSize/2, centerY - playSize/2);
    btnPlay.style("pointer-events", "auto"); 
    aplicarEstiloBoton(btnPlay);
    btnPlay.mousePressed(() => {
        userStartAudio();
        playPause();
    });

    btnPrev = createImg('assets/prev.png');
    btnPrev.parent("uiContainer");
    btnPrev.size(btnSize, btnSize);
    btnPrev.position(
        centerX - playSize/2 - spacing - btnSize,
        centerY - btnSize/2
    );
    btnPrev.style("pointer-events", "auto");
    aplicarEstiloBoton(btnPrev);
    btnPrev.mousePressed(() => {
        userStartAudio();
        anteriorCancion();
    });

    btnNext = createImg('assets/next.png');
    btnNext.parent("uiContainer");
    btnNext.size(btnSize, btnSize);
    btnNext.position(
        centerX + playSize/2 + spacing,
        centerY - btnSize/2
    );
    btnNext.style("pointer-events", "auto");
    aplicarEstiloBoton(btnNext);
    btnNext.mousePressed(() => {
        userStartAudio();
        siguienteCancion();
    });
}

