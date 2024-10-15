let locations = [];
let connections = [];
let currentLine = null;
let activeTool = 'create'; // Default tool is 'create'
let draggingLocation = null;
let offsetX, offsetY;

function goBack() {
    window.location.href = "world_selection_and_management_screen.html";
}

document.getElementById('create-location').addEventListener('click', function () {
    activeTool = 'create';
    alert('Create Location tool selected. Click on the canvas to place new locations.');
});

document.getElementById('connect-locations').addEventListener('click', function () {
    activeTool = 'connect';
    alert('Connect Locations tool selected. Click on two locations to connect them.');
});

document.getElementById('edit-location').addEventListener('click', function () {
    activeTool = 'edit';
    alert('Edit Location tool selected. Click and drag a location to move it.');
});

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', function (e) {
    if (activeTool !== 'edit') return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const location = locations.find(loc => isNear(loc, x, y));
    if (location) {
        draggingLocation = location;
        offsetX = x - location.x;
        offsetY = y - location.y;
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (!draggingLocation) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    draggingLocation.x = x - offsetX;
    draggingLocation.y = y - offsetY;
    redrawCanvas();
});

canvas.addEventListener('mouseup', function () {
    draggingLocation = null;
});

canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'create') {
        const name = prompt('Enter location name:');
        if (name) {
            addLocation(name, x, y);
        }
    } else if (activeTool === 'connect') {
        const location = locations.find(loc => isNear(loc, x, y));
        if (location) {
            if (currentLine) {
                currentLine.end = location;
                connections.push([currentLine.start, currentLine.end]);
                redrawCanvas();
                currentLine = null;
            } else {
                currentLine = { start: location };
            }
        }
    }
});

function addLocation(name, x, y) {
    locations.push({ name, x, y });
    drawLocation(name, x, y);
}

function drawLocation(name, x, y) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(name, x + 10, y);
}

function drawLine(start, end) {
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function isNear(location, x, y) {
    const dx = location.x - x;
    const dy = location.y - y;
    return Math.sqrt(dx * dx + dy * dy) < 10;
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    locations.forEach(loc => drawLocation(loc.name, loc.x, loc.y));
    connections.forEach(([start, end]) => drawLine(start, end));
}

function getWorldIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('worldId');
}

window.onload = function() {
  const worldId = getWorldIdFromUrl();
  if (worldId) {
    console.log(`Loading map for world ID: ${worldId}`);
  } else {
    console.error('No world ID found in URL');
  }
  alert('Create Location tool selected by default. Click on the canvas to place new locations.');
};