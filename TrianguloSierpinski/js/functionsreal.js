// Configuración inicial
const canvas = document.getElementById('sierpinskiCanvas');
const ctx = canvas.getContext('2d');

// Dimensiones del canvas
const WIDTH = 800;
const HEIGHT = 700;

// Vértices del triángulo equilátero
const vertices = [
    { x: 400, y: 50 },      // Vértice superior
    { x: 50, y: 606 },      // Vértice inferior izquierdo
    { x: 750, y: 606 }      // Vértice inferior derecho
];

// Estado de la aplicación
let currentPoint = { x: 400, y: 350 };  // Punto inicial (centro aproximado)
let points = [];                         // Almacena todos los puntos generados
let iteration = 0;
let isRunning = false;
let animationInterval = null;

// Elementos DOM
const diceNumberEl = document.getElementById('diceNumber');
const iterationCountEl = document.getElementById('iterationCount');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const stepBtn = document.getElementById('stepBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

// Dibujar el triángulo base
function drawTriangle() {
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    ctx.lineTo(vertices[1].x, vertices[1].y);
    ctx.lineTo(vertices[2].x, vertices[2].y);
    ctx.closePath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Dibujar los vértices con colores
    vertices.forEach((vertex, index) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
        const colors = ['#ff4444', '#44ff44', '#4444ff'];
        ctx.fillStyle = colors[index];
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();
    });
}

// Dibujar todos los puntos generados
function drawPoints() {
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }
}

// Redibujar todo
function redraw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawTriangle();
    drawPoints();
}

// Generar número aleatorio entre 1 y 6 (dado)
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Obtener el vértice correspondiente al número del dado
function getVertexFromDice(diceNumber) {
    // 1-2: vértice 1, 3-4: vértice 2, 5-6: vértice 3
    if (diceNumber <= 2) return vertices[0];
    if (diceNumber <= 4) return vertices[1];
    return vertices[2];
}

// Calcular el punto medio entre dos puntos
function getMidPoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    };
}

// Realizar una iteración del juego del caos
function performIteration() {
    // Lanzar el dado
    const diceValue = rollDice();
    diceNumberEl.textContent = diceValue;
    
    // Obtener el vértice seleccionado
    const selectedVertex = getVertexFromDice(diceValue);
    
    // Calcular el punto medio entre el punto actual y el vértice seleccionado
    const newPoint = getMidPoint(currentPoint, selectedVertex);
    
    // Guardar el nuevo punto
    points.push(newPoint);
    currentPoint = newPoint;
    iteration++;
    iterationCountEl.textContent = iteration;
    
    // Dibujar el nuevo punto
    ctx.beginPath();
    ctx.arc(newPoint.x, newPoint.y, 1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

// Iniciar la generación automática
function startGeneration() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stepBtn.disabled = true;
    
    const delay = parseInt(speedSlider.value);
    animationInterval = setInterval(() => {
        performIteration();
    }, delay);
}

// Pausar la generación
function pauseGeneration() {
    if (!isRunning) return;
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stepBtn.disabled = false;
    
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
}

// Resetear la simulación
function resetSimulation() {
    // Detener la animación si está corriendo
    if (isRunning) {
        pauseGeneration();
    }
    
    // Reiniciar variables
    currentPoint = { x: 400, y: 350 };
    points = [];
    iteration = 0;
    iterationCountEl.textContent = "0";
    diceNumberEl.textContent = "-";
    
    // Redibujar todo
    redraw();
    
    // Habilitar botones
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stepBtn.disabled = false;
}

// Realizar un paso manual
function stepGeneration() {
    if (!isRunning) {
        performIteration();
    }
}

// Actualizar la velocidad
function updateSpeed() {
    const speed = speedSlider.value;
    speedValue.textContent = speed;
    
    if (isRunning) {
        // Reiniciar el intervalo con la nueva velocidad
        clearInterval(animationInterval);
        const delay = parseInt(speed);
        animationInterval = setInterval(() => {
            performIteration();
        }, delay);
    }
}

// Inicializar la aplicación
function init() {
    // Configurar el canvas
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    // Dibujar el triángulo inicial
    redraw();
    
    // Configurar event listeners
    startBtn.addEventListener('click', startGeneration);
    pauseBtn.addEventListener('click', pauseGeneration);
    resetBtn.addEventListener('click', resetSimulation);
    stepBtn.addEventListener('click', stepGeneration);
    speedSlider.addEventListener('input', updateSpeed);
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);