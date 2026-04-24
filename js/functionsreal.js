// Configuración inicial
const BOARD_SIZE = 8;
let cellSize = 67.5;
let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
let lockedCells = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
let lockModeActive = false;
let currentTheme = "classic";
let currentPiece = "queen1";
let attackColor = "#ff6666";

const themes = {
    classic: { light: "#f0d9b5", dark: "#b58863" },
    emerald: { light: "#d9ead3", dark: "#2d6a4f" },
    sunset: { light: "#ffe3c9", dark: "#bb6b3a" }
};

let currentAttackCells = [];
let canvas = document.getElementById('boardCanvas');
let ctx = canvas.getContext('2d');

// Actualizar tamaño del canvas
function updateCanvasSize() {
    let maxSize = Math.min(560, window.innerWidth - 60);
    canvas.width = maxSize;
    canvas.height = maxSize;
    cellSize = canvas.width / BOARD_SIZE;
    drawBoard();
}

// Calcular celdas bajo ataque
function computeAttackedCells() {
    let attacked = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
    let queens = [];
    
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            if(board[i][j] === 1) queens.push({row: i, col: j});
        }
    }
    
    for(let q of queens) {
        // Horizontal y vertical
        for(let i = 0; i < BOARD_SIZE; i++) {
            attacked[i][q.col] = true;
            attacked[q.row][i] = true;
        }
        // Diagonales
        for(let i = -7; i <= 7; i++) {
            let nr = q.row + i;
            let nc = q.col + i;
            if(nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) attacked[nr][nc] = true;
            let nr2 = q.row + i;
            let nc2 = q.col - i;
            if(nr2 >= 0 && nr2 < BOARD_SIZE && nc2 >= 0 && nc2 < BOARD_SIZE) attacked[nr2][nc2] = true;
        }
    }
    
    let list = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            if(attacked[i][j]) list.push({row: i, col: j});
        }
    }
    return list;
}

// Mezclar colores
function blendColors(c1, c2, ratio) {
    let r1 = parseInt(c1.slice(1,3), 16);
    let g1 = parseInt(c1.slice(3,5), 16);
    let b1 = parseInt(c1.slice(5,7), 16);
    let r2 = parseInt(c2.slice(1,3), 16);
    let g2 = parseInt(c2.slice(3,5), 16);
    let b2 = parseInt(c2.slice(5,7), 16);
    let r = Math.min(255, Math.floor(r1 * (1 - ratio) + r2 * ratio));
    let g = Math.min(255, Math.floor(g1 * (1 - ratio) + g2 * ratio));
    let b = Math.min(255, Math.floor(b1 * (1 - ratio) + b2 * ratio));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Dibujar reina
function drawQueen(ctx, x, y, size, isLocked) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const rad = size * 0.35;
    
    ctx.save();
    
    if(currentPiece === 'queen1') {
        ctx.fillStyle = "#FFD966";
        ctx.shadowBlur = 2;
        ctx.beginPath();
        ctx.arc(cx, cy - 4, rad * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#E6B422";
        for(let i = 0; i < 3; i++) {
            let angle = -Math.PI/2 + (i-1) * 0.7;
            let px = cx + Math.cos(angle) * rad * 0.9;
            let py = cy - 6 + Math.sin(angle) * rad * 0.9;
            ctx.beginPath();
            ctx.arc(px, py, rad * 0.28, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "#B87C1E";
        ctx.beginPath();
        ctx.rect(cx - 5, cy - 2, 10, 8);
        ctx.fill();
        ctx.fillStyle = "#F4C542";
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, rad * 0.6, rad * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
    } 
    else if(currentPiece === 'queen2') {
        ctx.fillStyle = "#E887AE";
        ctx.beginPath();
        for(let i = 0; i < 5; i++) {
            let angle = (i * 72) * Math.PI / 180;
            let px = cx + Math.cos(angle) * rad * 0.8;
            let py = cy + Math.sin(angle) * rad * 0.6;
            ctx.lineTo(px, py);
        }
        ctx.fill();
        ctx.fillStyle = "#DD5588";
        ctx.beginPath();
        ctx.arc(cx, cy, rad * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFE484";
        ctx.beginPath();
        ctx.ellipse(cx - 3, cy - 3, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    } 
    else {
        ctx.fillStyle = "#C0A080";
        ctx.beginPath();
        ctx.moveTo(cx, cy - rad * 0.8);
        ctx.lineTo(cx + rad * 0.6, cy + rad * 0.2);
        ctx.lineTo(cx + rad * 0.2, cy + rad * 0.5);
        ctx.lineTo(cx, cy + rad * 0.3);
        ctx.lineTo(cx - rad * 0.2, cy + rad * 0.5);
        ctx.lineTo(cx - rad * 0.6, cy + rad * 0.2);
        ctx.fill();
        ctx.fillStyle = "#8B5A2B";
        ctx.beginPath();
        ctx.rect(cx - 5, cy - rad * 0.5, 10, 12);
        ctx.fill();
        ctx.fillStyle = "#E5B73B";
        for(let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.arc(cx + i * 3, cy - 6, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    if(isLocked) {
        ctx.fillStyle = "#ffffffcc";
        ctx.font = `bold ${size * 0.25}px monospace`;
        ctx.shadowBlur = 0;
        ctx.fillText("🔒", cx - 6, cy + 6);
    }
    ctx.restore();
}

// Dibujar tablero completo
function drawBoard() {
    if(!ctx) return;
    const theme = themes[currentTheme];
    
    for(let row = 0; row < BOARD_SIZE; row++) {
        for(let col = 0; col < BOARD_SIZE; col++) {
            let x = col * cellSize;
            let y = row * cellSize;
            let isDark = (row + col) % 2 === 1;
            let baseColor = isDark ? theme.dark : theme.light;
            let isAttacked = currentAttackCells.some(cell => cell.row === row && cell.col === col);
            let fillColor = baseColor;
            
            if(isAttacked && board[row][col] !== 1) {
                fillColor = blendColors(baseColor, attackColor, 0.65);
            } else if(board[row][col] === 1 && isAttacked) {
                fillColor = blendColors(baseColor, "#ff3300", 0.4);
            } else if(lockedCells[row][col]) {
                fillColor = blendColors(baseColor, "#555555", 0.3);
            }
            
            ctx.fillStyle = fillColor;
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.strokeStyle = "#00000022";
            ctx.strokeRect(x, y, cellSize, cellSize);
            
            if(board[row][col] === 1) {
                drawQueen(ctx, x, y, cellSize, lockedCells[row][col]);
            } else if(lockedCells[row][col]) {
                ctx.fillStyle = "#ffffff88";
                ctx.font = `${cellSize * 0.35}px "Segoe UI"`;
                ctx.shadowBlur = 0;
                ctx.fillText("🔒", x + cellSize * 0.35, y + cellSize * 0.7);
            }
        }
    }
    
    // Bordes decorativos
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#d4b27a";
    for(let i = 0; i <= BOARD_SIZE; i++) {
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
}

// Actualizar toda la interfaz
function refreshGame() {
    currentAttackCells = computeAttackedCells();
    drawBoard();
    updateStatusMsg();
}

// Actualizar mensaje de estado
function updateStatusMsg() {
    let queenCount = board.flat().filter(v => v === 1).length;
    let lockedCount = lockedCells.flat().filter(v => v === true).length;
    let msg = `👑 Reinas: ${queenCount}/8 | 🔒 Bloqueadas: ${lockedCount}`;
    if(lockModeActive) {
        msg += " | ✨ MODO BLOQUEO ACTIVO (click bloquea/desbloquea)";
    } else {
        msg += " | Modo edición (colocar/eliminar reinas)";
    }
    document.getElementById('statusMsg').innerHTML = msg;
}

// Manejar clic en el tablero
function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    if(mouseX < 0 || mouseY < 0 || mouseX > canvas.width || mouseY > canvas.height) return;
    
    const row = Math.floor(mouseY / cellSize);
    const col = Math.floor(mouseX / cellSize);
    
    if(row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        if(lockModeActive) {
            // Modo bloqueo
            if(board[row][col] === 1) {
                document.getElementById('statusMsg').innerHTML = "⚠️ No se puede bloquear una celda ocupada por reina";
                setTimeout(() => updateStatusMsg(), 1200);
                return;
            }
            lockedCells[row][col] = !lockedCells[row][col];
            refreshGame();
        } else {
            // Modo edición
            if(lockedCells[row][col]) {
                document.getElementById('statusMsg').innerHTML = "🔐 Celda bloqueada, usa modo bloqueo para desbloquear";
                setTimeout(() => updateStatusMsg(), 1000);
                return;
            }
            if(board[row][col] === 1) {
                board[row][col] = 0;
                refreshGame();
            } else {
                board[row][col] = 1;
                refreshGame();
            }
        }
    }
}

// Soluciones predefinidas
const solutions = [
    [[0,3],[1,5],[2,2],[3,7],[4,1],[5,4],[6,6],[7,0]],
    [[0,0],[1,4],[2,7],[3,5],[4,2],[5,6],[6,1],[7,3]],
    [[0,4],[1,1],[2,5],[3,0],[4,6],[5,2],[6,0],[7,7]]
];

function applySolution(solution) {
    // Limpiar reinas existentes (respetando bloqueos)
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            if(board[i][j] === 1 && !lockedCells[i][j]) {
                board[i][j] = 0;
            }
        }
    }
    
    let success = true;
    for(let [row, col] of solution) {
        if(row < 8 && col < 8) {
            if(lockedCells[row][col]) {
                success = false;
                document.getElementById('statusMsg').innerHTML = `❌ No se puso reina en (${row+1},${col+1}) porque está bloqueada`;
                setTimeout(() => updateStatusMsg(), 1500);
                continue;
            }
            board[row][col] = 1;
        }
    }
    if(success) {
        document.getElementById('statusMsg').innerHTML = "✨ Solución cargada correctamente";
    }
    refreshGame();
}

function clearQueens() {
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            if(board[i][j] === 1) {
                board[i][j] = 0;
            }
        }
    }
    refreshGame();
}

function fullReset() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    lockedCells = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
    lockModeActive = false;
    document.getElementById('toggleLockMode').innerHTML = "🔓 Modo bloqueo";
    refreshGame();
}

// Event Listeners
canvas.addEventListener('click', handleCanvasClick);
window.addEventListener('resize', () => updateCanvasSize());

document.getElementById('themeSelect').addEventListener('change', (e) => {
    currentTheme = e.target.value;
    drawBoard();
});

document.getElementById('pieceStyle').addEventListener('change', (e) => {
    currentPiece = e.target.value;
    drawBoard();
});

document.getElementById('attackColorSelect').addEventListener('change', (e) => {
    attackColor = e.target.value;
    refreshGame();
});

document.getElementById('resetBtn').addEventListener('click', fullReset);
document.getElementById('clearBtn').addEventListener('click', clearQueens);
document.getElementById('sol1Btn').addEventListener('click', () => applySolution(solutions[0]));
document.getElementById('sol2Btn').addEventListener('click', () => applySolution(solutions[1]));
document.getElementById('sol3Btn').addEventListener('click', () => applySolution(solutions[2]));

const lockBtn = document.getElementById('toggleLockMode');
lockBtn.addEventListener('click', () => {
    lockModeActive = !lockModeActive;
    lockBtn.innerHTML = lockModeActive ? "🔒 Modo edición" : "🔓 Modo bloqueo";
    updateStatusMsg();
});

// Inicializar
function init() {
    updateCanvasSize();
    fullReset();
}
init();