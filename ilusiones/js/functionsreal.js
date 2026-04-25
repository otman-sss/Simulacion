// -------------------- CONFIGURACIÓN --------------------
const canvasSize = 280;  // tamaño fijo cuadrado

// ==================== SET 1 (8 ilusiones) ====================

// 1. Trama Vertical (líneas paralelas verticales)
function drawVerticalLines(ctx) {
    const w = canvasSize, step = 12;
    ctx.clearRect(0, 0, w, w);
    ctx.strokeStyle = "#2c3e66";
    ctx.lineWidth = 1.8;
    for (let x = step/2; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, w);
        ctx.stroke();
    }
}

// 2. Trama Horizontal
function drawHorizontalLines(ctx) {
    const w = canvasSize, step = 12;
    ctx.clearRect(0, 0, w, w);
    ctx.strokeStyle = "#3a5a40";
    ctx.lineWidth = 1.8;
    for (let y = step/2; y < w; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}

// 3. Cuadrícula de Hermann (puntos grises fantasmas)
function drawHermannGrid(ctx) {
    const w = canvasSize;
    const cells = 8;
    const cellSize = w / cells;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, w);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= cells; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, w);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(w, i * cellSize);
        ctx.stroke();
    }
}

// 4. Envolvente en V (Reloj de arena)
function drawHourglassEnvelope(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#FFF5E6";
    ctx.fillRect(0, 0, w, w);
    const steps = 32;
    const offset = 20;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x1 = offset + t * (w - 2*offset);
        const y1 = offset + t * (w - 2*offset);
        const x2 = offset + (1-t) * (w - 2*offset);
        const y2 = offset + t * (w - 2*offset);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsl(${25 + t * 40}, 70%, 45%)`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
    }
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x1 = offset + t * (w - 2*offset);
        const y1 = w - offset - t * (w - 2*offset);
        const x2 = offset + (1-t) * (w - 2*offset);
        const y2 = w - offset - t * (w - 2*offset);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsl(${5 + t * 50}, 75%, 50%)`;
        ctx.stroke();
    }
}

// 5. Trama Diagonal 45°
function drawDiagonalLines(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#fef0dc";
    ctx.fillRect(0, 0, w, w);
    ctx.strokeStyle = "#C44B3C";
    ctx.lineWidth = 1.8;
    const spacing = 12;
    for (let k = -w; k < w + w; k += spacing) {
        ctx.beginPath();
        ctx.moveTo(k, 0);
        ctx.lineTo(k + w, w);
        ctx.stroke();
    }
}

// 6. Parábola de Esquina
function drawCornerParabola(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#FDF5E6";
    ctx.fillRect(0, 0, w, w);
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = w * t;
        const y = w * (1 - t);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(x, w);
        ctx.strokeStyle = "#3F7E6B";
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = w * t;
        const y = w * t;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(w, y);
        ctx.strokeStyle = "#C2623B";
        ctx.stroke();
    }
}

// 7. Hipocicloide de cuatro cúspides
function drawHypocycloidFour(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#FCF9F0";
    ctx.fillRect(0, 0, w, w);
    const steps = 38;
    const margin = 15;
    const corners = [[margin, margin], [w-margin, margin], [w-margin, w-margin], [margin, w-margin]];
    for (let idx = 0; idx < 4; idx++) {
        const [cx, cy] = corners[idx];
        const targetX = idx%2 === 0 ? w-margin : margin;
        const targetY = idx<2 ? w-margin : margin;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x1 = cx + (targetX - cx) * t;
            const y1 = cy + (targetY - cy) * t;
            const x2 = (idx===0 || idx===3) ? w-margin : margin;
            const y2 = (idx===0 || idx===1) ? w-margin : margin;
            const tx = x2;
            const ty = y2;
            const xFrom = x1;
            const yFrom = y1;
            const xTo = tx + (cx - tx) * t;
            const yTo = ty + (cy - ty) * t;
            ctx.beginPath();
            ctx.moveTo(xFrom, yFrom);
            ctx.lineTo(xTo, yTo);
            ctx.strokeStyle = `hsl(${idx*90 + 20}, 65%, 50%)`;
            ctx.stroke();
        }
    }
}

// 8. Envolvente en X
function drawXEnvelope(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#F1E7D3";
    ctx.fillRect(0, 0, w, w);
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
        const t = Math.sin(Math.PI * i / steps);
        const x1 = w/2 + (w/2 - 30) * (t-0.5)*2;
        const y1 = 15 + (w-30) * (i/steps);
        const x2 = w/2 - (w/2 - 30) * (t-0.5)*2;
        const y2 = 15 + (w-30) * (i/steps);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#247BA0";
        ctx.stroke();
    }
    for (let i = 0; i <= steps; i++) {
        const t = Math.sin(Math.PI * i / steps);
        const x1 = w/2 + (w/2 - 30) * (t-0.5)*2;
        const y1 = w-15 - (w-30) * (i/steps);
        const x2 = w/2 - (w/2 - 30) * (t-0.5)*2;
        const y2 = w-15 - (w-30) * (i/steps);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#C44536";
        ctx.stroke();
    }
}

// ==================== SET 2 (8 ilusiones) ====================

// 9. Astroide
function drawAstroid(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#FFFAF0";
    ctx.fillRect(0, 0, w, w);
    const center = w/2, R = w*0.38;
    const steps = 70;
    for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const x1 = center + R * Math.cos(theta);
        const y1 = center + R * Math.sin(theta);
        const phi = theta + Math.PI/2;
        const x2 = center + R * Math.cos(phi);
        const y2 = center + R * Math.sin(phi);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#6B4E3D";
        ctx.lineWidth = 1.1;
        ctx.stroke();
    }
}

// 10. Rombo de Progresión
function drawRhombusProgression(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#EBE3D5";
    ctx.fillRect(0, 0, w, w);
    const center = w/2;
    for (let s = 12; s < w/2; s += 9) {
        const size = s;
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(Math.PI/4);
        ctx.strokeStyle = "#234E6C";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-size/2, -size/2, size, size);
        ctx.restore();
    }
}

// 11. Bicúspide enfrentada
function drawBicuspid(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#FDF2E0";
    ctx.fillRect(0, 0, w, w);
    const steps = 40;
    for(let i=0; i<=steps; i++) {
        let t = i/steps;
        let x = w*t;
        let y1 = w/2 - 100*t*(1-t)*2;
        let y2 = w/2 + 100*t*(1-t)*2;
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.strokeStyle = "#A64B2A";
        ctx.stroke();
    }
    for(let i=0; i<=steps; i++) {
        let t = i/steps;
        let x1 = w*t;
        let y1 = w/2 - 70*Math.sin(Math.PI*t);
        let x2 = w*(1-t);
        let y2 = w/2 - 70*Math.sin(Math.PI*t);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#408080";
        ctx.stroke();
    }
}

// 12. Cuatrifolio Geométrico
function drawQuatrefoil(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#F0EAE1";
    ctx.fillRect(0, 0, w, w);
    const center = w/2;
    const rad = w*0.35;
    for(let ang=0; ang<4; ang++) {
        let baseAngle = ang * Math.PI/2;
        for(let t=0; t<=1; t+=0.03) {
            let angle = baseAngle + (t-0.5)*1.5;
            let x1 = center + rad*Math.cos(angle);
            let y1 = center + rad*Math.sin(angle);
            let angle2 = baseAngle + Math.PI/2 + (t-0.5)*1.2;
            let x2 = center + rad*0.7*Math.cos(angle2);
            let y2 = center + rad*0.7*Math.sin(angle2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "#4D7C6B";
            ctx.stroke();
        }
    }
}

// 13. Triangulación Inversa
function drawInverseTriangulation(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#FFF3E3";
    ctx.fillRect(0, 0, w, w);
    const points = [[20,20],[w-20,20],[w/2,w-20]];
    for(let step=0; step<100; step++) {
        let t = step/100;
        for(let i=0;i<3;i++) {
            let p1 = points[i];
            let p2 = points[(i+1)%3];
            let xm = p1[0] + (p2[0]-p1[0])*t;
            let ym = p1[1] + (p2[1]-p1[1])*t;
            ctx.beginPath();
            ctx.arc(xm, ym, 1.2, 0, Math.PI*2);
            ctx.fillStyle = `hsl(${70+step*2}, 60%, 45%)`;
            ctx.fill();
        }
    }
}

// 14. Túnel Cuadrado
function drawSquareTunnel(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#2E2F2F";
    ctx.fillRect(0, 0, w, w);
    const center = w/2;
    for(let i=0; i<24; i++) {
        let sz = w - i*12;
        if(sz<4) break;
        ctx.strokeStyle = `hsl(${40 + i*8}, 80%, 65%)`;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(center - sz/2, center - sz/2, sz, sz);
    }
}

// 15. Túnel Triangular
function drawTriangleTunnel(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#192841";
    ctx.fillRect(0, 0, w, w);
    const centerX = w/2, centerY = w/2;
    for(let r = w/2; r>6; r-=9) {
        ctx.beginPath();
        for(let k=0;k<3;k++) {
            let angle = k * Math.PI*2/3 - Math.PI/2;
            let x1 = centerX + r * Math.cos(angle);
            let y1 = centerY + r * Math.sin(angle);
            if(k===0) ctx.moveTo(x1,y1);
            else ctx.lineTo(x1,y1);
        }
        ctx.closePath();
        ctx.strokeStyle = `#FFB347`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
    }
}

// 16. Círculos Concéntricos
function drawConcentricCircles(ctx) {
    const w = canvasSize;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#EAE2D7";
    ctx.fillRect(0, 0, w, w);
    const center = w/2;
    for(let r = w/2; r>6; r-=7) {
        ctx.beginPath();
        ctx.arc(center, center, r, 0, Math.PI*2);
        ctx.strokeStyle = `#406E8E`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

// ==================== LISTA COMPLETA (SOLO 16) ====================

const illusions = [
    { name: "1. Trama Vertical", func: drawVerticalLines },
    { name: "2. Trama Horizontal", func: drawHorizontalLines },
    { name: "3. Cuadrícula de Hermann", func: drawHermannGrid },
    { name: "4. Envolvente en V (Reloj arena)", func: drawHourglassEnvelope },
    { name: "5. Trama Diagonal 45°", func: drawDiagonalLines },
    { name: "6. Parábola de Esquina", func: drawCornerParabola },
    { name: "7. Hipocicloide (4 cúspides)", func: drawHypocycloidFour },
    { name: "8. Envolvente en X", func: drawXEnvelope },
    { name: "9. Astroide", func: drawAstroid },
    { name: "10. Rombo de Progresión", func: drawRhombusProgression },
    { name: "11. Bicúspide enfrentada", func: drawBicuspid },
    { name: "12. Cuatrifolio Geométrico", func: drawQuatrefoil },
    { name: "13. Triangulación Inversa", func: drawInverseTriangulation },
    { name: "14. Túnel Cuadrado", func: drawSquareTunnel },
    { name: "15. Túnel Triangular", func: drawTriangleTunnel },
    { name: "16. Círculos Concéntricos", func: drawConcentricCircles }
];

function renderGallery() {
    const container = document.getElementById("gallery");
    container.innerHTML = "";
    illusions.forEach((ill, idx) => {
        const card = document.createElement("div");
        card.className = "card";
        const titleSpan = document.createElement("div");
        titleSpan.className = "title";
        titleSpan.innerText = ill.name;
        const canvas = document.createElement("canvas");
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext("2d");
        ill.func(ctx);
        const badge = document.createElement("div");
        badge.className = "badge";
        badge.innerText = "🎨 ilusión óptica";
        card.appendChild(titleSpan);
        card.appendChild(canvas);
        card.appendChild(badge);
        container.appendChild(card);
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", renderGallery);