const tg = window.Telegram.WebApp;
tg.expand(); // Разворачивает Mini App на весь экран

// Обработчик кликов кнопки Telegram
tg.MainButton.setText("Начать игру");
tg.MainButton.show();
tg.onEvent("mainButtonClicked", () => {
    location.reload(); // Перезапуск игры
});
const gameCanvas = document.createElement("canvas");
const ctx = gameCanvas.getContext("2d");
gameCanvas.width = 320;
gameCanvas.height = 480;
document.body.appendChild(gameCanvas);

// Подключаем Telegram API
const tg = window.Telegram.WebApp;
tg.expand();

// Переменные
let birdY = 150;
let birdVelocity = 0;
const gravity = 0.5;
const jump = -8;
let pipes = [];
let score = 0;
let gameRunning = true;

// Обработчик кликов
function flap() {
    birdVelocity = jump;
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") flap();
});

gameCanvas.addEventListener("click", flap);

// Генерация труб
function addPipe() {
    let pipeHeight = Math.floor(Math.random() * 150) + 100;
    pipes.push({ x: gameCanvas.width, height: pipeHeight });
}
setInterval(addPipe, 1500);

// Основной игровой цикл
function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Обновление птицы
    birdVelocity += gravity;
    birdY += birdVelocity;
    ctx.fillStyle = "yellow";
    ctx.fillRect(50, birdY, 20, 20);

    // Обновление труб
    ctx.fillStyle = "green";
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;
        ctx.fillRect(pipes[i].x, 0, 30, pipes[i].height);
        ctx.fillRect(pipes[i].x, pipes[i].height + 100, 30, gameCanvas.height);

        // Проверка столкновений
        if (
            (50 < pipes[i].x + 30 && 50 + 20 > pipes[i].x &&
                (birdY < pipes[i].height || birdY + 20 > pipes[i].height + 100)) ||
            birdY > gameCanvas.height
        ) {
            gameRunning = false;
            alert("Game Over! Score: " + score);
            location.reload();
        }

        // Увеличение счета
        if (pipes[i].x === 48) score++;
    }

    // Отображение счета
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

gameLoop();
