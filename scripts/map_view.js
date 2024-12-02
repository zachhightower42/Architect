 /**
 * Map View
 * This javascript file handles the interactive map functions including:
 * - Location creation, editing, and customization
 * - Connection management between locations
 * - Entry management for locations
 * - PDF export functionality
 * - Canvas drawing and event handling
 * 
 */
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
let entryHeaderInput;
let entryBodyTextarea;
let entriesList;
let entryDetails;
let readModeButton;
let editModeButton;

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

async function loadLocations() {
    try {
        const response = await fetch(`database/map_view_handler.php?action=get_locations&world_id=${worldId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
        console.error('Error details:', error);
        alert('Failed to load locations. Please check the console for details.');
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
/**
  * Icon Selection Modal
  * Displays available icons and handles icon selection
  */
function showIconSelection() {
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
        
        img.addEventListener('click', async function() {
            if (selectedLocation) {
                const iconPath = `assets/location_icons/${iconFile}`;
                
                try {
                    const response = await fetch('database/map_view_handler.php?action=update_location_icon', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            location_id: selectedLocation.id,
                            icon_path: iconPath
                        })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        selectedLocation.iconPath = iconPath;
                        redrawCanvas();
                    }
                } catch (error) {
                    console.error('Error updating location icon:', error);
                }
                
                iconModal.style.display = 'none';
            }
        });
        
        iconGrid.appendChild(img);
    });
    
    iconModal.style.display = 'block';
}

/**
 * Location Management
 * Handles location creation and storage
 */
/* let locationIdCounter = 0;

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
} */

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

    // Draw connections
    connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.connection_start_X, conn.connection_start_Y);
        ctx.lineTo(conn.connection_end_X, conn.connection_end_Y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    const imagePromises = [];

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
}async function loadLocations() {
    try {
        const response = await fetch(`database/map_view_handler.php?action=get_locations&world_id=${worldId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseText = await response.text();
        console.log('Raw response from PHP script:', responseText);

        const jsonData = JSON.parse(responseText);
        if (!jsonData.success) {
            throw new Error(jsonData.error || 'Unknown error occurred');
        }

        locations = jsonData.data.map(loc => ({
            id: loc.location_id,
            name: loc.location_name,
            x: parseFloat(loc.position_X),
            y: parseFloat(loc.position_Y),
            iconPath: loc.icon_path_location || DEFAULT_ICON_PATH
        }));

        redrawCanvas();
    } catch (error) {
        console.error('Error loading locations:', error);
        alert('Failed to load locations. Check console for details.');
    }
}
// Global variables at the top
let selectedLocationForEdit = null;

document.addEventListener('DOMContentLoaded', function () {
    // All modal elements initialization
    const locationModal = document.getElementById('locationModal');
    const closeModalButton = document.getElementById('closeModal');
    const addLocationButton = document.getElementById('addLocationButton');
    const locationNameInput = document.getElementById('locationName');
    const editLocationNameModal = document.getElementById('editLocationNameModal');
    const editLocationNameInput = document.getElementById('editLocationNameInput');
    const saveLocationNameButton = document.getElementById('saveLocationNameButton');
    const closeEditNameModal = document.getElementById('closeEditNameModal');

    // Location name editing event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('location-text') && activeTool === 'edit') {
            const locationId = e.target.id.replace('location-text-', '');
            const location = locations.find(loc => loc.id === parseInt(locationId));
            if (location) {
                // Show edit modal with current name
                const editLocationNameModal = document.getElementById('editLocationNameModal');
                const editLocationNameInput = document.getElementById('editLocationNameInput');
                editLocationNameInput.value = location.name;
                editLocationNameModal.style.display = 'block';
                selectedLocationForEdit = location;
            }
        }
    });

    document.getElementById('saveLocationNameButton').addEventListener('click', async function() {
        const newName = document.getElementById('editLocationNameInput').value.trim();
        if (newName && selectedLocationForEdit) {
            try {
                const response = await fetch('database/map_view_handler.php?action=update_location_name', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        location_id: selectedLocationForEdit.id,
                        location_name: newName
                    })
                });
            
                const data = await response.json();
                if (data.success) {
                    selectedLocationForEdit.name = newName;
                    const textElement = document.getElementById(`location-text-${selectedLocationForEdit.id}`);
                    if (textElement) {
                        textElement.textContent = newName;
                    }
                    document.getElementById('editLocationNameModal').style.display = 'none';
                }
            } catch (error) {
                console.error('Error updating location name:', error);
            }
        }
    });
    closeEditNameModal.addEventListener('click', () => {
        editLocationNameModal.style.display = 'none';
        selectedLocationForEdit = null;
    });

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
        const dx = x - offsetX - draggingLocation.x;
        const dy = y - offsetY - draggingLocation.y;
        
        draggingLocation.x = x - offsetX;
        draggingLocation.y = y - offsetY;

        // Update connected lines
        connections.forEach(connection => {
            if (connection.location_id === draggingLocation.id) {
                connection.connection_start_X += dx;
                connection.connection_start_Y += dy;
                connection.connection_end_X += dx;
                connection.connection_end_Y += dy;
            }
        });

        redrawCanvas();
    });
       

    canvas.addEventListener('mouseup', async function() {
        if (draggingLocation) {
            try {
                // Update location position
                await fetch('database/map_view_handler.php?action=update_location_position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        location_id: draggingLocation.id,
                        position_X: draggingLocation.x,
                        position_Y: draggingLocation.y
                    })
                });

                // Get all connections where this location is either start or end point
                const affectedConnections = connections.filter(conn => {
                    const startPoint = locations.find(loc => 
                        Math.abs(loc.x - conn.connection_start_X) < 15 && 
                        Math.abs(loc.y - conn.connection_start_Y) < 15
                    );
                    const endPoint = locations.find(loc => 
                        Math.abs(loc.x - conn.connection_end_X) < 15 && 
                        Math.abs(loc.y - conn.connection_end_Y) < 15
                    );
                    return startPoint?.id === draggingLocation.id || endPoint?.id === draggingLocation.id;
                });

                // Update each affected connection
                for (const connection of affectedConnections) {
                    const isStart = Math.abs(draggingLocation.x - connection.connection_start_X) < 15 &&
                                  Math.abs(draggingLocation.y - connection.connection_start_Y) < 15;

                    await fetch('database/map_view_handler.php?action=update_connections', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            connection_id: connection.connection_id,
                            start_x: isStart ? draggingLocation.x : connection.connection_start_X,
                            start_y: isStart ? draggingLocation.y : connection.connection_start_Y,
                            end_x: !isStart ? draggingLocation.x : connection.connection_end_X,
                            end_y: !isStart ? draggingLocation.y : connection.connection_end_Y
                        })
                    });
                }

                // Refresh connections and redraw
                await loadConnections();
                redrawCanvas();

            } catch (error) {
                console.error('Error updating position and connections:', error);
            }
            draggingLocation = null;
        }
    });

    canvas.addEventListener('click', function(e) {
        const { x, y } = getCanvasCoordinates(e);
        const location = locations.find(loc => isNear(loc, x, y));

        const toolActions = {
            'create': () => {
    if (locationModal && locationNameInput) {
        newLocationX = x;
        newLocationY = y;
        locationModal.style.display = 'block';
        locationNameInput.value = '';
        locationNameInput.focus();
    }
},
            'connect': () => {
                if (location) {
                    if (currentLine) {
                        const connection = {
                            start_x: currentLine.start.x,
                            start_y: currentLine.start.y,
                            end_x: location.x,
                            end_y: location.y,
                            location_id: currentLine.start.id
                        };
                        saveConnection(connection);
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
                    if (confirm('Are you sure you want to delete this location and all its associated entries and connections?')) {
                        deleteLocation(location.id).then(success => {
                            if (success) {
                                // Close side pane if it's showing the deleted location
                                if (activeLocation && activeLocation.id === location.id) {
                                    sidePane.style.display = 'none';
                                }
                            }
                        });
                    }
                }
            }
        };
        async function deleteLocation(locationId) {
            try {
                const response = await fetch('database/map_view_handler.php?action=delete_location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        location_id: locationId
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Remove location text
                    removeLocationText(locationId);
                    // Remove from local array
                    locations = locations.filter(loc => loc.id !== locationId);
                    // Remove connections
                    connections = connections.filter(conn => conn.location_id !== locationId);
                    // Redraw canvas
                    redrawCanvas();
                    return true;
                } else {
                    throw new Error(data.error || 'Failed to delete location');
                }
            } catch (error) {
                console.error('Error deleting location:', error);
                alert('Failed to delete location: ' + error.message);
                return false;
            }
        }

        if (toolActions[activeTool]) {
            toolActions[activeTool]();
        }
    });
// Add these at the top with other global variables
let locationModal;
let locationNameInput;
let closeModalButton;
let addLocationButton;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal elements
    locationModal = document.getElementById('locationModal');
    locationNameInput = document.getElementById('locationName');
    closeModalButton = document.getElementById('closeModal');
    addLocationButton = document.getElementById('addLocationButton');

    // Initialize entry elements
    entryHeaderInput = document.getElementById('entryHeader');
    entryBodyTextarea = document.getElementById('entryBody');
    entriesList = document.getElementById('entriesList');
    entryDetails = document.getElementById('entryDetails');
    readModeButton = document.getElementById('readModeButton');
    editModeButton = document.getElementById('editModeButton');

    // Now attach the event listeners
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            locationModal.style.display = 'none';
        });
    }

    if (addLocationButton) {
        addLocationButton.addEventListener('click', async function() {
            const name = locationNameInput.value.trim();
            if (name) {
                await addLocation(name, newLocationX, newLocationY);
                locationModal.style.display = 'none';
            } else {
                alert('Please enter a location name.');
            }
        });
    }

    // Add window click event for modal closing
    window.addEventListener('click', function(event) {
        if (event.target === locationModal) {
            locationModal.style.display = 'none';
        }
    });

    // Load locations and connections
    const worldId = new URLSearchParams(window.location.search).get('id');
    if (worldId) {
        loadLocations();
        loadConnections();
    }
});    document.getElementById('closeIconModal').addEventListener('click', () => {
        iconModal.style.display = 'none';
    });
document.addEventListener('DOMContentLoaded', function () {
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

    async function openSidePane(location) {
        activeLocation = location;
        sidePane.style.display = 'block';
        locationTitle.textContent = location.name;
    
        // Load entries from database
        const entries = await loadEntries(location.id);
        activeLocation.entries = entries;
    
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
        const iconSize = 30; // Match the size used in redrawCanvas
        const clickX = x - loc.x;
        const clickY = y - loc.y;
        return Math.abs(clickX) < iconSize/2 && Math.abs(clickY) < iconSize/2;
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



function goBack() {
    window.location.href = 'world_selection_and_management_screen.html';
}
async function saveConnection(connectionData) {
    try {
        const response = await fetch('database/map_view_handler.php?action=create_connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(connectionData)
        });
        
        const data = await response.json();
        if (data.success) {
            connections.push({
                connection_id: data.connection_id,
                connection_start_X: connectionData.start_x,
                connection_start_Y: connectionData.start_y,
                connection_end_X: connectionData.end_x,
                connection_end_Y: connectionData.end_y,
                location_id: connectionData.location_id
            });
            redrawCanvas();
        } else {
            throw new Error(data.error || 'Failed to save connection');
        }
    } catch (error) {
        console.error('Error saving connection:', error);
        alert('Failed to save connection');
    }
}
async function loadConnections() {
    try {
        const response = await fetch(`database/map_view_handler.php?action=get_connections&world_id=${worldId}`);
        const data = await response.json();
        
        if (data.success) {
            connections = data.data;
            redrawCanvas();
        }
    } catch (error) {
        console.error('Error loading connections:', error);
    }
}document.addEventListener('DOMContentLoaded', function() {
    const worldId = new URLSearchParams(window.location.search).get('id');
    if (!worldId) {
        window.location.href = 'world_selection_and_management_screen.html';
    }
    loadLocations();
    loadConnections();
});



function removeLocationText(locationId) {
    const textElement = document.getElementById(`location-text-${locationId}`);
    if (textElement) {
        textElement.remove();
    }
}


async function loadEntries(locationId) {
    // First check session storage
    const sessionEntries = getEntriesFromSession(locationId);
    if (sessionEntries) {
        return sessionEntries;
    }
    
    // If not in session, load from database
    try {
        const response = await fetch(`database/map_view_handler.php?action=get_entries&location_id=${locationId}`);
        const entries = await response.json();
        // Store in session storage
        storeEntriesInSession(locationId, entries);
        return entries;
    } catch (error) {
        console.error('Error loading entries:', error);
        return [];
    }
}
// Add these functions at the appropriate location in map_view.js

// Store entries in session storage
function storeEntriesInSession(locationId, entries) {
    sessionStorage.setItem(`entries_${locationId}`, JSON.stringify(entries));
}

// Retrieve entries from session storage
function getEntriesFromSession(locationId) {
    const stored = sessionStorage.getItem(`entries_${locationId}`);
    return stored ? JSON.parse(stored) : null;
}

// Modify the existing setEntryMode function
function setEntryMode(mode) {
    if (!activeEntry) return;

    activeEntry.mode = mode;
    const isReadMode = mode === 'read';
    
    entryHeaderInput.readOnly = isReadMode;
    entryBodyTextarea.readOnly = isReadMode;
    readModeButton.classList.toggle('active', isReadMode);
    editModeButton.classList.toggle('active', !isReadMode);

    if (isReadMode && activeLocation) {
        storeEntriesInSession(activeLocation.id, activeLocation.entries);
        syncEntries(); // Sync when switching to read mode
    }
}

function syncEntries() {
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith('entries_')) {
            const locationId = key.split('_')[1];
            const entries = JSON.parse(sessionStorage.getItem(key));
            
            fetch('database/map_view_handler.php?action=sync_entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    location_id: locationId,
                    entries: entries
                })
            }).catch(error => console.log('Entry sync error:', error));
        }
    }
}

// Add window event listener for page unload
window.addEventListener('beforeunload', async function(e) {
    // Sync all stored entries with the database
    const promises = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith('entries_')) {
            const locationId = key.split('_')[1];
            const entries = JSON.parse(sessionStorage.getItem(key));
            
            promises.push(fetch('database/map_view_handler.php?action=sync_entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    location_id: locationId,
                    entries: entries
                })
            }));
        }
    }
    await Promise.all(promises);
});
