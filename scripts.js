let canvas = document.getElementById('wabenCanvas');
let ctx = canvas.getContext('2d');
let slider = document.getElementById("wabenSlider");
let colors = ['red', 'blue', 'yellow'];
let rows = [];

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    initGrid(parseInt(this.value));
}

document.getElementById('nextStepBtn').addEventListener('click', addRow);
document.getElementById('resetBtn').addEventListener('click', function() {
    initGrid(parseInt(slider.value));
});

function initGrid(hexCount) {
    rows = [];
    const firstRow = [];
    for (let i = 0; i < hexCount; i++) {
        firstRow.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    rows.push(firstRow);
    redrawGrid();
}

// Draw a rotated hexagon
function drawHex(x, y, size, fill) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + size * Math.cos((Math.PI / 3) * i - Math.PI / 2), y + size * Math.sin((Math.PI / 3) * i - Math.PI / 2));
    }
    ctx.closePath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = fill;
    ctx.fill();
}

function addRow() {
    if (rows.length >= rows[0].length) return;  // If we reached the maximum number of rows, return

    const lastRow = rows[rows.length - 1];
    const newRow = [];
    
    for (let i = 0; i < lastRow.length - 1; i++) {
        const leftColor = lastRow[i];
        const rightColor = lastRow[i + 1];
        
        if (leftColor === rightColor) {
            newRow.push(leftColor);
        } else {
            newRow.push(colors.find(color => color !== leftColor && color !== rightColor));
        }
    }

    rows.push(newRow);
    redrawGrid();
}

function redrawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const numHexInFirstRow = rows[0].length;
    const maxRows = numHexInFirstRow;
    const sizeBasedOnWidth = canvas.width / (maxRows);

    const hexHeight = sizeBasedOnWidth * Math.sqrt(3);  // Berechnet die Höhe eines Hexagons
    const totalHeight = hexHeight * maxRows;  // Berechnet die Gesamthöhe, die benötigt wird, um alle Reihen zu zeichnen
    
    let size;
    if (totalHeight > canvas.height) {  // Überprüft, ob die Gesamthöhe größer ist als die Höhe des Canvas
        size = sizeBasedOnWidth * canvas.height / totalHeight;  // Wenn ja, wird die Größe der Waben angepasst, damit sie in den Canvas passen
    } else {
        size = sizeBasedOnWidth;
    }

    for (let i = 0; i < rows.length; i++) {
        let yOffset = size * Math.sin((Math.PI / 3) * 3 - Math.PI / 2) - size * Math.sin((Math.PI / 3) - Math.PI / 2); 
        let xOffset = (i) * (size * Math.cos((Math.PI / 3) * 1 - Math.PI / 2));
		let width = size * Math.cos((Math.PI / 3) * 1 - Math.PI / 2) * 2;

        for (let j = 0; j < rows[i].length; j++) {
            const x = j * width + width/2 + xOffset;// + size + xOffset;
            const y = i * yOffset + size;  
            drawHex(x, y, size, rows[i][j]);
        }
    }
}

document.getElementById('sierpinskiBtn').addEventListener('click', setSierpinski);

function setSierpinski() {
    //slider.value = 53;  // Setzt den Slider auf 82
    const hexCount = parseInt(slider.value);
    rows = [];
    const firstRow = new Array(hexCount).fill('yellow');  // Füllt die erste Reihe mit gelben Waben
    const middleIndex = Math.floor(hexCount / 2);
    firstRow[middleIndex] = 'red';  // Setzt die mittlere Wabe auf rot
    rows.push(firstRow);
    redrawGrid();
}

document.getElementById('completeBtn').addEventListener('click', completeGrid);

function completeGrid() {
    while (rows.length < rows[0].length) {  // Fügt Reihen hinzu, bis nur noch eine Wabe übrig ist
        addRow();
    }
}

// Initialize with default value
initGrid(parseInt(slider.value));
