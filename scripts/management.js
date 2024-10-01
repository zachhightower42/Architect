//management

    // Function to handle signing out
    function signOut() {
        window.location.href = 'login_page.html'; // Redirect to login page
    }
    // Function to dynamically load user's created worlds
    function loadWorlds() {
        // Logic to retrieve and display worlds (mocked here)
        const worldsContainer = document.getElementById('worlds-container');
        worldsContainer.innerHTML = ''; // Clear current content
        // Example data for worlds (replace with dynamic data from server)
        const worlds = [
            { id: 1, name: 'Alpha Centaurii', description: 'A world beyond the stars, with an infinitude of potential.' },
            { id: 2, name: 'Pax Equus', description: 'Rome has been taken overy by magical horses and only Caligula can stop them.' }
        ];
        worlds.forEach(world => {
            const worldCard = document.createElement('div');
            worldCard.classList.add('world-card');
            worldCard.setAttribute('data-world-id', world.id);
            worldCard.innerHTML = `
                <h3>${world.name}</h3>
                <p>${world.description}</p>
                <button class="delete-world-button" onclick="deleteWorld(${world.id})">Delete</button>
                <button class="open-world-button" onclick="openWorld(${world.id})">Open World</button>
            `;
            worldsContainer.appendChild(worldCard);
        });
    }
    // Function to create a new world
    document.getElementById('create-world-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const worldName = document.getElementById('world-name').value;
        const worldDescription = document.getElementById('world-description').value;
        // Logic to send new world to the server (mocked here)
        const newWorld = {
            id: Date.now(), // Unique ID for the new world
            name: worldName,
            description: worldDescription
        };
        // Add new world to the UI (without reloading)
        const worldsContainer = document.getElementById('worlds-container');
        const worldCard = document.createElement('div');
        worldCard.classList.add('world-card');
        worldCard.setAttribute('data-world-id', newWorld.id);
        worldCard.innerHTML = `
            <h3>${newWorld.name}</h3>
            <p>${newWorld.description}</p>
            <button class="delete-world-button" onclick="deleteWorld(${newWorld.id})">Delete</button>
            <button class="open-world-button" onclick="openWorld(${newWorld.id})">Open World</button>
        `;
        worldsContainer.appendChild(worldCard);
        // Clear form inputs
        document.getElementById('world-name').value = '';
        document.getElementById('world-description').value = '';
    });
    // Function to delete a world
    function deleteWorld(id) {
        // Logic to delete world (mocked here)
        const worldCard = document.querySelector(`.world-card[data-world-id='${id}']`);
        worldCard.remove();
    }
    // Function to open a world (redirect to a new page)
    function openWorld(id) {
        window.location.href = `world.html?id=${id}`; // Open the selected world
    }
    // Load worlds when the page is loaded
    window.onload = loadWorlds;
