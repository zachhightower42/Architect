/**
 * Management script for handling user authentication and world management.
 * This file contains functions for signing out, loading worlds, and creating new worlds.
 * It also includes event listeners for form submission and world interaction.
 */

//management

function signOut() {
  window.location.href = "login_page.html";
}

function loadWorlds() {
  const worldsContainer = document.getElementById("worlds-container");
  worldsContainer.innerHTML = "";

  // Fetch worlds from the server
  fetch('database/world_handler.php?action=get_worlds')
    .then(response => response.json())
    .then(worlds => {
      worlds.forEach((world) => {
        const worldCard = document.createElement("div");
        worldCard.classList.add("world-card");
        worldCard.setAttribute("data-world-id", world.world_id);
        worldCard.innerHTML = `
          <h3>${world.world_name}</h3>
          <p>${world.description}</p>
          <button class="delete-world-button" onclick="deleteWorld(${world.world_id})">Delete</button>
          <button class="open-world-button" onclick="openWorld(${world.world_id})">Open World</button>
        `;
        worldsContainer.appendChild(worldCard);
      });
    })
    .catch(error => {
      console.error('Error fetching worlds:', error);
    });
}
document
  .getElementById("create-world-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const worldName = document.getElementById("world-name").value;
    const worldDescription = document.getElementById("world-description").value;

    // Send new world data to the server
    fetch('database/world_handler.php?action=create_world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        world_name: worldName,
        description: worldDescription,
        user_id: userId // Replace with actual user ID
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Reload worlds
        loadWorlds();
        // Clear form
        document.getElementById("world-name").value = "";
        document.getElementById("world-description").value = "";
      } else {
        console.error('Error creating world:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
function deleteWorld(id) {
  if (confirm("Are you sure you want to delete this world? This action cannot be undone.")) {
    // Send delete request to the server
    fetch(`database/world_handler.php?action=delete_world`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ world_id: id })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Reload worlds
        loadWorlds();
      } else {
        console.error('Error deleting world:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}// Mockup for opening a world
function openWorld(id) {
  window.location.href = `world.html?id=${id}`; // Open the selected world
}
// Onload effects
window.onload = loadWorlds;
