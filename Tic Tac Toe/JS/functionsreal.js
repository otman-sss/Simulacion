// ====================================================
// VARIABLES GLOBALES Y ESTADO DEL JUEGO
// ====================================================
let board = ["", "", "", "", "", "", "", "", ""];   // Estado interno
let currentPlayer = "X";            // X empieza siempre
let gameActive = true;
let timerInterval = null;
let timeLeft = 180;                 // 3 minutos = 180 segundos
let winningCombination = null;      // Guardar índice de línea ganadora para dibujar

// Elementos del DOM
const boardElement = document.getElementById("board");
const timerDisplay = document.getElementById("timerDisplay");
const turnText = document.getElementById("turnText");
const gameStatusDiv = document.getElementById("gameStatus");
const winnerMessageDiv = document.getElementById("winnerMessage");
const applyConfigBtn = document.getElementById("applyConfigBtn");
const resetGameBtn = document.getElementById("resetGameBtn");
const newGameBtn = document.getElementById("newGameBtn");

// Elementos de configuración
const imgXSelect = document.getElementById("imgX");
const imgOSelect = document.getElementById("imgO");
const cellColorEvenInput = document.getElementById("cellColorEven");
const cellColorOddInput = document.getElementById("cellColorOdd");
const gridLineColorInput = document.getElementById("gridLineColor");
const winLineColorInput = document.getElementById("winLineColor");

// Mapeo de imágenes (emojis o texto)
let playerXSymbol = "❌";
let playerOSymbol = "⭕";

// Colores
let evenCellColor = "#f0f8ff";
let oddCellColor = "#e6e6fa";
let gridLineColor = "#333333";
let winLineColor = "#ff4500";

// ====================================================
// FUNCIONES AUXILIARES Y UTILERÍA
// ====================================================

// Actualizar los colores de las celdas según su índice (par/impar)
function applyCellColors() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, idx) => {
        if (idx % 2 === 0) {
            cell.style.backgroundColor = evenCellColor;
        } else {
            cell.style.backgroundColor = oddCellColor;
        }
    });
}

// Actualizar color de líneas intermedias (background del board)
function applyGridLineColor() {
    boardElement.style.backgroundColor = gridLineColor;
}

// Actualizar símbolos visuales en el tablero según el estado 'board'
function updateBoardUI() {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
        const cellValue = board[i];
        if (cellValue === "X") {
            cells[i].innerHTML = playerXSymbol;
        } else if (cellValue === "O") {
            cells[i].innerHTML = playerOSymbol;
        } else {
            cells[i].innerHTML = "";
        }
    }
    // Reaplicar colores por si acaso
    applyCellColors();
}

// Resaltar línea ganadora
function highlightWinningLine(combination) {
    if (!combination) return;
    const cells = document.querySelectorAll(".cell");
    // Primero limpiamos cualquier estilo previo de borde ganador
    cells.forEach(cell => {
        cell.style.boxShadow = "";
        cell.style.border = "";
    });
    // Aplicar color de línea ganadora (sombra intensa y borde)
    combination.forEach(index => {
        cells[index].style.boxShadow = `0 0 0 3px ${winLineColor}`;
        cells[index].style.border = `2px solid ${winLineColor}`;
    });
}

// Limpiar resaltado de línea ganadora
function clearWinHighlight() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.boxShadow = "";
        cell.style.border = "";
    });
}

// Verificar si hay ganador o empate
function checkWinner() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],  // Filas
        [0,3,6], [1,4,7], [2,5,8],  // Columnas
        [0,4,8], [2,4,6]             // Diagonales
    ];
    
    for (let pattern of winPatterns) {
        const [a,b,c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winningCombination = pattern;
            return board[a];  // 'X' o 'O'
        }
    }
    
    // Empate? (todas las celdas llenas)
    if (board.every(cell => cell !== "")) {
        return "tie";
    }
    return null;
}

// Actualizar estado del juego después de cada movimiento
function handleGameState() {
    const winner = checkWinner();
    
    if (winner === "X") {
        gameActive = false;
        gameStatusDiv.innerText = "🏆 ¡Jugador 1 (X) ha ganado!";
        winnerMessageDiv.innerText = "🎉 Gana el Jugador 1 🎉";
        highlightWinningLine(winningCombination);
        stopTimer();
        disableBoard(true);
        return;
    } else if (winner === "O") {
        gameActive = false;
        gameStatusDiv.innerText = "🏆 ¡Jugador 2 (O) ha ganado!";
        winnerMessageDiv.innerText = "🎉 Gana el Jugador 2 🎉";
        highlightWinningLine(winningCombination);
        stopTimer();
        disableBoard(true);
        return;
    } else if (winner === "tie") {
        gameActive = false;
        gameStatusDiv.innerText = "😲 ¡Empate!";
        winnerMessageDiv.innerText = "🤝 Empate, nadie ganó.";
        stopTimer();
        disableBoard(true);
        return;
    }
    
    // Si no hay fin, cambiar turno
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    turnText.innerText = (currentPlayer === "X") ? "Jugador 1 (X)" : "Jugador 2 (O)";
    gameStatusDiv.innerText = `Turno de ${currentPlayer === "X" ? "Jugador 1" : "Jugador 2"}`;
}

// Manejar click en una celda
function handleCellClick(index) {
    if (!gameActive) return;
    if (board[index] !== "") return;
    
    // Registrar movimiento
    board[index] = currentPlayer;
    updateBoardUI();
    
    // Verificar estado después del movimiento
    handleGameState();
}

// Deshabilitar/Habilitar interacción con tablero
function disableBoard(disabled) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, idx) => {
        if (disabled) {
            cell.classList.add("disabled");
        } else {
            cell.classList.remove("disabled");
        }
    });
}

// Reiniciar completamente el juego (manteniendo config actual)
function resetGame() {
    // Detener timer anterior
    stopTimer();
    // Limpiar variables
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    winningCombination = null;
    timeLeft = 180;
    updateTimerDisplay();
    clearWinHighlight();
    // Limpiar UI
    updateBoardUI();
    turnText.innerText = "Jugador 1 (X)";
    gameStatusDiv.innerText = "Juego en curso...";
    winnerMessageDiv.innerText = "";
    disableBoard(false);
    // Reiniciar colores de celdas
    applyCellColors();
    applyGridLineColor();
    // Iniciar temporizador nuevamente
    startTimer();
}

// ====================================================
// TEMPORIZADOR
// ====================================================
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTimer() {
    if (timerInterval) stopTimer();
    timerInterval = setInterval(() => {
        if (!gameActive) return; // No reducir si ya terminó
        
        if (timeLeft <= 1) {
            // Tiempo agotado sin ganador -> bloquear todo
            timeLeft = 0;
            updateTimerDisplay();
            stopTimer();
            gameActive = false;
            gameStatusDiv.innerText = "⏰ ¡Tiempo agotado! Sin ganador.";
            winnerMessageDiv.innerText = "⌛ Se acabaron los 3 minutos. Partida bloqueada.";
            disableBoard(true);
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

// ====================================================
// CONFIGURACIÓN DE IMÁGENES Y COLORES
// ====================================================
function applyConfiguration() {
    // Obtener valores seleccionados de imágenes
    playerXSymbol = imgXSelect.value;
    playerOSymbol = imgOSelect.value;
    
    // Colores
    evenCellColor = cellColorEvenInput.value;
    oddCellColor = cellColorOddInput.value;
    gridLineColor = gridLineColorInput.value;
    winLineColor = winLineColorInput.value;
    
    // Aplicar colores
    applyCellColors();
    applyGridLineColor();
    
    // Si la partida está activa, actualizar los símbolos en pantalla
    updateBoardUI();
    
    // Si hay una línea ganadora resaltada previamente, actualizar con nuevo color
    if (winningCombination && !gameActive && (checkWinner() === "X" || checkWinner() === "O")) {
        highlightWinningLine(winningCombination);
    }
}

// ====================================================
// CREAR TABLERO HTML
// ====================================================
function createBoard() {
    boardElement.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", (e) => {
            e.stopPropagation();
            handleCellClick(parseInt(cell.dataset.index));
        });
        boardElement.appendChild(cell);
    }
    applyCellColors();
    applyGridLineColor();
    updateBoardUI();
}

// ====================================================
// INICIALIZACIÓN Y EVENTOS
// ====================================================
function init() {
    createBoard();
    resetGame();  // inicia tablero vacío y temporizador
    
    // Eventos botones
    applyConfigBtn.addEventListener("click", () => {
        applyConfiguration();
    });
    resetGameBtn.addEventListener("click", () => {
        resetGame();
    });
    newGameBtn.addEventListener("click", () => {
        resetGame();
    });
}

// Iniciar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", init);