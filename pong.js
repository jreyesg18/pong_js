const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Propiedades de los objetos del juego
const paddleWidth = 10, paddleHeight = 100, ballRadius = 10;
let upArrowPressed = false, downArrowPressed = false;

// Pala izquierda
const leftPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 4
};

// Pala derecha (jugador controlado por la IA)
const rightPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 4
};

// Bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 4,
    dx: 4,
    dy: -4
};

// Dibuja un rectángulo, utilizado para dibujar palas
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Dibuja la bola
function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Dibuja la red central
function drawNet() {
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "#FFF");
    }
}

// Mueve las palas
function movePaddles() {
    if (upArrowPressed && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.dy;
    } else if (downArrowPressed && leftPaddle.y < canvas.height - leftPaddle.height) {
        leftPaddle.y += leftPaddle.dy;
    }

    // Movimiento simple de la IA
    if (ball.y < rightPaddle.y + rightPaddle.height / 2) {
        rightPaddle.y -= rightPaddle.dy;
    } else {
        rightPaddle.y += rightPaddle.dy;
    }
}

// Mueve la bola
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisión con paredes superior e inferior
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Colisión con la pala izquierda
    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
        ball.dx *= -1;
    }

    // Colisión con la pala derecha
    if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
        ball.dx *= -1;
    }

    // Reinicia la posición de la bola si sale de la pantalla
    if (ball.x + ball.radius < 0 || ball.x - ball.radius > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 4;
        ball.dy = 4;
    }
}

// Dibuja todo el juego
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, "#FFF");
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, "#FFF");
    drawBall(ball.x, ball.y, ball.radius, "#FFF");
}

// Actualiza el juego
function update() {
    movePaddles();
    moveBall();
}

// Función principal del juego
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Control de teclas
window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 38:
            upArrowPressed = true;
            break;
        case 40:
            downArrowPressed = true;
            break;
    }
});

window.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
        case 38:
            upArrowPressed = false;
            break;
        case 40:
            downArrowPressed = false;
            break;
    }
});

// Inicia el juego
gameLoop();
