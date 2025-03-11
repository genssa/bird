// Подключаем Telegram API
const tg = window.Telegram.WebApp;

// Разворачиваем Mini App на весь экран
tg.expand(); 

// Отображаем кнопку "Начать заново" внизу экрана
tg.MainButton.setText("Начать заново");
tg.MainButton.show();

// При нажатии на кнопку "Начать заново" перезапускаем игру
tg.onEvent("mainButtonClicked", () => {
    location.reload(); // Перезагружаем страницу (перезапуск игры)
});

// Создаем холст для игры
const gameCanvas = document.createElement("canvas");
const ctx = gameCanvas.getContext("2d");
gameCanvas.width = 320;
gameCanvas.height = 480;
document.body.appendChild(gameCanvas);

// Переменные игры
let birdY = 150;          // Начальная позиция птички по Y
let birdVelocity = 0;     // Начальная скорость птички
const gravity = 0.5;      // Сила гравитации
const jump = -8;          // Сила прыжка
let pipes = [];           // Массив для труб
let score = 0;            // Счет
let gameRunning = true;   // Статус игры

// Обработчик клика по экрану или нажатия пробела
function flap() {
    birdVelocity = jump; // Птичка подскакивает
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        flap(); // Нажатие пробела
    }
});

gameCanvas.addEventListener("click", flap); // Клик по холсту

// Функция для генерации труб
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (gameCanvas.height / 2)); // Высота трубы
    pipes.push({
        x: gameCanvas.width,
        top: pipeHeight,
        bottom: gameCanvas.height - pipeHeight - 100,
    });
}

// Основная функция игры (обновление экрана)
function gameLoop() {
    birdVelocity += gravity; // Применяем гравитацию
    birdY += birdVelocity;   // Обновляем позицию птички

    // Ограничиваем положение птички, чтобы она не выходила за пределы экрана
    if (birdY < 0) birdY = 0;
    if (birdY > gameCanvas.height) birdY = gameCanvas.height;

    // Добавляем новые трубы каждые 90 кадров
    if (Math.random() < 0.02) {
        createPipe();
    }

    // Обновляем и рисуем трубы
    pipes.forEach((pipe, index) => {
        pipe.x -= 2; // Двигаем трубы влево
        ctx.fillStyle = "#00ff00"; // Цвет труб
        ctx.fillRect(pipe.x, 0, 40, pipe.top); // Верхняя труба
        ctx.fillRect(pipe.x, gameCanvas.height - pipe.bottom, 40, pipe.bottom); // Нижняя труба

        // Удаляем трубы, которые вышли за пределы экрана
        if (pipe.x + 40 < 0) {
            pipes.splice(index, 1);
            score++; // Увеличиваем счет за проход трубы
        }
    });

    // Проверка на столкновение с трубами
    pipes.forEach(pipe => {
        if (50 + 10 > pipe.x && 50 - 10 < pipe.x + 40) { // Проверка X
            if (birdY - 10 < pipe.top || birdY + 10 > gameCanvas.height - pipe.bottom) { // Проверка Y
                gameRunning = false; // Игра закончена
                tg.MainButton.setText("Играть снова");
                tg.MainButton.show();
            }
        }
    });

    // Очистка экрана перед отрисовкой нового кадра
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Рисуем птичку (круг)
    ctx.beginPath();
    ctx.arc(50, birdY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0"; // Цвет птички
    ctx.fill();
    ctx.closePath();

    // Обновляем счет
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Счет: " + score, 10, 30);
}

// Вызов основной функции игры 60 раз в секунду
setInterval(gameLoop, 1000 / 60);
