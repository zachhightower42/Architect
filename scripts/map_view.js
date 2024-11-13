

// Global variables
let locations = [];
let connections = [];
let currentLine = null;
let currentMousePosition = { x: 0, y: 0 };
let activeTool = 'create';
let draggingLocation = null;
let offsetX, offsetY;
let newLocationX, newLocationY;
let activeLocation = null;
let activeEntry = null;

// Default icon for locations
const locationIcon = new Image();
locationIcon.src = 'assets/architect default location node.png';


// Canvas setup
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size to match the displayed size
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    redrawCanvas();
}


function redrawCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    connections.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    // Draw locations
    locations.forEach(loc => {
        // Draw the location icon
        const iconSize = 20; // This matches the current circle diameter (2 * radius)
        ctx.drawImage(
            locationIcon, 
            loc.x - iconSize/2, 
            loc.y - iconSize/2, 
            iconSize, 
            iconSize
        );

        // Create or update text element
        let textElement = document.getElementById(`location-text-${loc.name}`);
        if (!textElement) {
            textElement = document.createElement('div');
            textElement.id = `location-text-${loc.name}`;
            textElement.className = 'location-text';
            document.querySelector('.map-section').appendChild(textElement);
        }
        
        // Position the text
        textElement.style.left = `${loc.x + 15}px`;
        textElement.style.top = `${loc.y - 10}px`;
        textElement.textContent = loc.name;
    });
    // If a line is currently being drawn (for connecting locations)
    if (currentLine && currentLine.start) {
        ctx.beginPath();
        ctx.moveTo(currentLine.start.x, currentLine.start.y);
        ctx.lineTo(currentMousePosition.x, currentMousePosition.y);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}


document.addEventListener('DOMContentLoaded', function () {

// Modal elements
const locationModal = document.getElementById('locationModal');
const closeModalButton = document.getElementById('closeModal');
const addLocationButton = document.getElementById('addLocationButton');
const locationNameInput = document.getElementById('locationName');

// Side pane elements
const sidePane = document.getElementById('sidePane');
const closeSidePaneButton = document.getElementById('closeSidePane');
const locationTitle = document.getElementById('locationTitle');
const addEntryButton = document.getElementById('addEntryButton');
const entriesList = document.getElementById('entriesList');
const entryDetails = document.getElementById('entryDetails');
const entryHeaderInput = document.getElementById('entryHeader');
const entryBodyTextarea = document.getElementById('entryBody');
const readModeButton = document.getElementById('readModeButton');
const editModeButton = document.getElementById('editModeButton');


// Initial resize
resizeCanvas();

// Resize canvas when window is resized
window.addEventListener('resize', resizeCanvas);

// Tool selection event listeners
document.getElementById('create-location').addEventListener('click', function (event) {
    event.preventDefault();
    activeTool = 'create';
    alert('Create Location tool selected. Click on the canvas to place new locations.');
});

document.getElementById('connect-locations').addEventListener('click', function (event) {
    event.preventDefault();
    activeTool = 'connect';
    alert('Connect Locations tool selected. Click on two locations to connect them.');
});

document.getElementById('edit-location').addEventListener('click', function (event) {
    event.preventDefault();
    activeTool = 'edit';
    alert('Edit Location tool selected. Click and drag a location to move it.');
});

document.getElementById('enter-location').addEventListener('click', function (event) {
    event.preventDefault();
    activeTool = 'enter';
    alert('Enter Location tool selected. Click on a location to enter it.');
});

// Go back function
function goBack() {
    window.location.href = "world_selection_and_management_screen.html";
}

// Canvas event listeners
canvas.addEventListener('mousedown', function (e) {
    if (activeTool !== 'edit') return;

    const { x, y } = getCanvasCoordinates(e);

    const location = locations.find(loc => isNear(loc, x, y));
    if (location) {
        draggingLocation = location;
        offsetX = x - location.x;
        offsetY = y - location.y;
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (!draggingLocation) return;

    const { x, y } = getCanvasCoordinates(e);

    draggingLocation.x = x - offsetX;
    draggingLocation.y = y - offsetY;
    redrawCanvas();
});

canvas.addEventListener('mouseup', function () {
    draggingLocation = null;
});

canvas.addEventListener('click', function (e) {
    const { x, y } = getCanvasCoordinates(e);

    if (activeTool === 'create') {
        newLocationX = x;
        newLocationY = y;

        // Show modal
        locationModal.style.display = 'block';
        locationNameInput.value = '';
        locationNameInput.focus();
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
    } else if (activeTool === 'enter') {
        const location = locations.find(loc => isNear(loc, x, y));
        if (location) {
            openSidePane(location);
        }
    }
});

// Function to get canvas coordinates from mouse event
function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
}

// Close modal when clicking the close button
closeModalButton.addEventListener('click', function (e) {
    locationModal.style.display = 'none';
});

// Add location when clicking the add button
addLocationButton.addEventListener('click', function (e) {
    const name = locationNameInput.value.trim();
    if (name) {
        addLocation(name, newLocationX, newLocationY);
        locationModal.style.display = 'none';
    } else {
        alert('Please enter a location name.');
    }
});

// Close modal when clicking outside of it
window.addEventListener('click', function (event) {
    if (event.target === locationModal) {
        locationModal.style.display = 'none';
    }
});

// Side pane functionality
closeSidePaneButton.addEventListener('click', function () {
    sidePane.style.display = 'none';
    entryDetails.style.display = 'none';
    activeEntry = null;
    activeLocation = null;
});

addEntryButton.addEventListener('click', function () {
    const entry = {
        header: 'New Entry',
        body: 'Body',
        mode: 'read',
    };
    activeLocation.entries.push(entry);
    updateEntriesList();
});

// Handle entry selection
entriesList.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        const index = e.target.getAttribute('data-index');
        openEntryDetails(index);
    }
});

// Mode toggle buttons
readModeButton.addEventListener('click', function () {
    setEntryMode('read');
});

editModeButton.addEventListener('click', function () {
    setEntryMode('edit');
});

// Update entry content
entryHeaderInput.addEventListener('input', function () {
    if (activeEntry && activeEntry.mode === 'edit') {
        activeEntry.header = entryHeaderInput.value;
        updateEntriesList();
    }
});

entryBodyTextarea.addEventListener('input', function () {
    if (activeEntry && activeEntry.mode === 'edit') {
        activeEntry.body = entryBodyTextarea.value;
    }
});

// Functions for side pane and entries
function openSidePane(location) {
    activeLocation = location;
    if (!activeLocation.entries) {
        activeLocation.entries = [];
    }
    sidePane.style.display = 'block';
    locationTitle.textContent = location.name;
    updateEntriesList();
    entryDetails.style.display = 'none';
}

function updateEntriesList() {
    entriesList.innerHTML = '';
    activeLocation.entries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = entry.header;
        li.setAttribute('data-index', index);
        entriesList.appendChild(li);
    });
}

function openEntryDetails(index) {
    activeEntry = activeLocation.entries[index];
    entryHeaderInput.value = activeEntry.header;
    entryBodyTextarea.value = activeEntry.body;
    setEntryMode('read');
    entryDetails.style.display = 'block';
}

function setEntryMode(mode) {
    if (!activeEntry) return

    activeEntry.mode = mode

    if (mode === 'read') {
        entryHeaderInput.readOnly = true
        entryBodyTextarea.readOnly = true
        readModeButton.classList.add('active')
        editModeButton.classList.remove('active')
    } else if (mode === 'edit') {
        entryHeaderInput.readOnly = false
        entryBodyTextarea.readOnly = false
        readModeButton.classList.remove('active')
        editModeButton.classList.add('active')
    }
}
});


function addLocation(name, x, y) {
    const location = { name: name, x: x, y: y };
    locations.push(location);
    redrawCanvas();
}

function isNear(loc, x, y) {
    const dx = loc.x - x;
    const dy = loc.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 15; // Adjust the threshold value if needed
}
