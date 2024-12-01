 /**
 * Map View
 * This javascript file handles the interactive map functions including:
 * - Location creation, editing, and customization
 * - Connection management between locations
 * - Entry management for locations
 * - PDF export functionality
 * - Canvas drawing and event handling
// Global state management
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
let selectedLocation = null;

// Constants
const DEFAULT_ICON_PATH = 'assets/location_icons/default_location.png';
const iconModal = document.getElementById('iconModal');
const iconGrid = document.getElementById('iconGrid');
const worldId = new URLSearchParams(window.location.search).get('id');

/**
  * Location Customization Tool
  * Handles the icon customization functionality for locations
  */
document.getElementById('customize-location').addEventListener('click', function(event) {
    event.preventDefault();
    activeTool = 'customize';
    console.log('Customize Location tool selected, activeTool =', activeTool);
    alert('Customize Location tool selected. Click on a location to change its icon.');
});

/**
  * Icon Selection Modal
  * Displays available icons and handles icon selection
  */
function showIconSelection() {

async function loadLocations() {
    try {
        const response = await fetch(`database/map_view_handler.php?action=get_locations&world_id=${worldId}`);
        const data = await response.json();
        locations = data.map(loc => ({
            id: loc.location_id,
            name: loc.location_name,
            x: loc.position_X,
            y: loc.position_Y,
            iconPath: loc.icon_path_location || DEFAULT_ICON_PATH
        }));
        redrawCanvas();
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

async function addLocation(name, x, y) {
    try {
        const response = await fetch('database/map_view_handler.php?action=create_location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location_name: name,
                world_id: worldId,
                position_X: x,
                position_Y: y,
                icon_path_location: DEFAULT_ICON_PATH
            })
        });
        const data = await response.json();
        if (data.success) {
            await loadLocations();
        }
    } catch (error) {
        console.error('Error creating location:', error);
    }
}
    iconGrid.innerHTML = '';
    
    const iconFiles = [
        'default_location.png',
        'apartment_icon.png',
        'castle_icon.png',
        'gate_icon.png',
        'teepee_icon.png',
        'trees_icon.png',
        'mountain_icon.png'
    ];
    
    iconFiles.forEach(iconFile => {
        const img = document.createElement('img');
        img.src = `assets/location_icons/${iconFile}`;
        img.className = 'icon-option';
        
        img.addEventListener('click', function() {
            if (selectedLocation) {
                selectedLocation.iconPath = img.src;
                redrawCanvas();
            }
            iconModal.style.display = 'none';
        });
        
        iconGrid.appendChild(img);
    });
    
    iconModal.style.display = 'block';
}

/**
 * Location Management
 * Handles location creation and storage
 */
let locationIdCounter = 0;

function addLocation(name, x, y) {
    const location = { 
        id: `loc-${locationIdCounter++}`,  // Unique ID
        name: name, 
        x: x, 
        y: y,
        iconPath: DEFAULT_ICON_PATH,
        entries: [] // Initialize entries here to avoid undefined errors later
    };
    locations.push(location);
    redrawCanvas();
}

/**
 * Canvas Management
 * Handles canvas setup, resizing, and drawing
 */
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imagePromises = [];

    // Draw connections
    connections.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Draw locations and labels
    locations.forEach(loc => {
        const iconImage = new Image();
        iconImage.src = loc.iconPath;

        const imagePromise = new Promise((resolve, reject) => {
            iconImage.onload = function() {
                const iconSize = 30;
                ctx.drawImage(
                    iconImage,
                    loc.x - iconSize / 2,
                    loc.y - iconSize / 2,
                    iconSize,
                    iconSize
                );
                resolve();
            };
            iconImage.onerror = function() {
                console.error('Error loading image:', loc.iconPath);
                reject(new Error(`Failed to load image: ${loc.iconPath}`));
            };
        });

        imagePromises.push(imagePromise);

        // Location text labels
        let textElement = document.getElementById(`location-text-${loc.id}`);
        if (!textElement) {
            textElement = document.createElement('div');
            textElement.id = `location-text-${loc.id}`;
            textElement.className = 'location-text';
            document.querySelector('.map-section').appendChild(textElement);
        }

        textElement.style.left = `${loc.x + 15}px`;
        textElement.style.top = `${loc.y - 10}px`;
        textElement.textContent = loc.name;
    });

    // Return a promise that resolves when all images are loaded
    return Promise.all(imagePromises);
}

/**
 * Main Application Setup
 * Initializes all event listeners and UI components
 */
document.addEventListener('DOMContentLoaded', function () {
    // Modal elements initialization
    const locationModal = document.getElementById('locationModal');
    const closeModalButton = document.getElementById('closeModal');
    const addLocationButton = document.getElementById('addLocationButton');
    const locationNameInput = document.getElementById('locationName');

    // Side pane elements initialization
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

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /**
     * Tool Selection Setup
     * Initializes all tool selection buttons
     */
    const tools = {
        'create-location': 'create',
        'connect-locations': 'connect',
        'edit-location': 'edit',
        'enter-location': 'enter',
        'delete-location': 'delete'
    };

    Object.entries(tools).forEach(([id, tool]) => {
        document.getElementById(id).addEventListener('click', function(event) {
            event.preventDefault();
            activeTool = tool;
            alert(`${tool.charAt(0).toUpperCase() + tool.slice(1)} Location tool selected.`);
        });
    });

    /**
     * Canvas Event Handlers
     * Manages all canvas interactions
     */
    canvas.addEventListener('mousedown', function(e) {
        if (activeTool !== 'edit') return;

        const { x, y } = getCanvasCoordinates(e);
        const location = locations.find(loc => isNear(loc, x, y));
        
        if (location) {
            draggingLocation = location;
            offsetX = x - location.x;
            offsetY = y - location.y;
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        if (!draggingLocation) return;

        const { x, y } = getCanvasCoordinates(e);
        draggingLocation.x = x - offsetX;
        draggingLocation.y = y - offsetY;
        redrawCanvas();
    });

    canvas.addEventListener('mouseup', () => draggingLocation = null);

    canvas.addEventListener('click', function(e) {
        const { x, y } = getCanvasCoordinates(e);
        const location = locations.find(loc => isNear(loc, x, y));

        const toolActions = {
            'create': () => {
                newLocationX = x;
                newLocationY = y;
                locationModal.style.display = 'block';
                locationNameInput.value = '';
                locationNameInput.focus();
            },
            'connect': () => {
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
            },
            'enter': () => {
                if (location) openSidePane(location);
            },
            'customize': () => {
                if (location) {
                    selectedLocation = location;
                    showIconSelection();
                }
            },
            'delete': () => {
                if (location) {
                    // Remove connections involving this location
                    connections = connections.filter(conn => 
                        conn[0] !== location && conn[1] !== location
                    );
                    
                    // Remove the location from the locations array
                    locations.splice(locations.indexOf(location), 1);

                    // Remove the text label associated with the location
                    const textElement = document.getElementById(`location-text-${location.id}`);
                    if (textElement) {
                        textElement.parentNode.removeChild(textElement);
                    }

                    // Redraw the canvas to reflect changes
                    redrawCanvas();
                }
            }
        };
        if (toolActions[activeTool]) {
            toolActions[activeTool]();
        }
    });

    /**
     * Modal Event Handlers
     * Manages modal interactions
     */
    closeModalButton.addEventListener('click', () => locationModal.style.display = 'none');
    
    addLocationButton.addEventListener('click', function() {
        const name = locationNameInput.value.trim();
        if (name) {
            addLocation(name, newLocationX, newLocationY);
            locationModal.style.display = 'none';
        } else {
            alert('Please enter a location name.');
        }
    });

    window.addEventListener('click', function(event) {
        if (event.target === locationModal) {
            locationModal.style.display = 'none';
        }
    });

    document.getElementById('closeIconModal').addEventListener('click', () => {
        iconModal.style.display = 'none';
    });

    /**
     * Side Pane Event Handlers
     * Manages side pane and entry interactions
     */
    closeSidePaneButton.addEventListener('click', function() {
        sidePane.style.display = 'none';
        entryDetails.style.display = 'none';
        activeEntry = null;
        activeLocation = null;
    });

    addEntryButton.addEventListener('click', function() {
        const entry = {
            header: 'New Entry',
            body: 'Body',
            mode: 'read'
        };
        activeLocation.entries.push(entry);
        updateEntriesList();
    });

    entriesList.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            openEntryDetails(e.target.getAttribute('data-index'));
        }
    });

    readModeButton.addEventListener('click', () => setEntryMode('read'));
    editModeButton.addEventListener('click', () => setEntryMode('edit'));

    entryHeaderInput.addEventListener('input', function() {
        if (activeEntry?.mode === 'edit') {
            activeEntry.header = entryHeaderInput.value;
            updateEntriesList();
        }
    });

    entryBodyTextarea.addEventListener('input', function() {
        if (activeEntry?.mode === 'edit') {
            activeEntry.body = entryBodyTextarea.value;
        }
    });

    /**
     * Helper Functions
     */
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / canvas.clientWidth;
        const scaleY = canvas.height / canvas.clientHeight;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

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
        if (!activeEntry) return;

        activeEntry.mode = mode;
        const isReadMode = mode === 'read';
        
        entryHeaderInput.readOnly = isReadMode;
        entryBodyTextarea.readOnly = isReadMode;
        readModeButton.classList.toggle('active', isReadMode);
        editModeButton.classList.toggle('active', !isReadMode);
    }

    function isNear(loc, x, y) {
        const dx = loc.x - x;
        const dy = loc.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 15;
    }


    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    /**
     * PDF Export Function
     * Handles the export of map and entries to PDF
     */
    function exportToPDF() {
        console.log("Starting exportToPDF function.");
    
        const { jsPDF } = window.jspdf;
    
        redrawCanvas().then(() => {
            console.log("Canvas redraw complete.");
    
            const mapSection = document.querySelector('.map-section');
    
            html2canvas(mapSection, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: true,
                onclone: (clonedDoc) => {
                    console.log('Document cloned for html2canvas.');
                }
            }).then(canvas => {
                console.log('Canvas captured by html2canvas.');
    
                // Create PDF with A4 dimensions
                const pdf = new jsPDF('l', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
    
                // Add the map image
                pdf.addImage(
                    canvas.toDataURL('image/png', 1.0),
                    'PNG',
                    0,
                    0,
                    pdfWidth,
                    pdfHeight
                );
    
                // Add location entries
                locations.forEach(location => {
                    pdf.addPage();
                    pdf.setFontSize(16);
                    pdf.text(location.name, 10, 20);
    
                    if (location.entries) {
                        let yPosition = 30;
                        location.entries.forEach(entry => {
                            pdf.setFontSize(12);
                            pdf.text(entry.header, 10, yPosition);
                            yPosition += 10;
    
                            const splitText = pdf.splitTextToSize(entry.body, pdfWidth - 20);
                            pdf.text(splitText, 10, yPosition);
                            yPosition += (splitText.length * 7) + 10;
    
                            if (yPosition > pdfHeight - 20) {
                                pdf.addPage();
                                yPosition = 20;
                            }
                        });
                    }
                });
    
                pdf.save('world_map.pdf');
            }).catch(error => {
                console.error('Error during PDF generation:', error);
                alert('An error occurred while generating the PDF. Please try again.');
            });
        }).catch(error => {
            console.error('Error during canvas redraw:', error);
            alert('An error occurred while preparing the canvas. Please try again.');
        });
    }

});
