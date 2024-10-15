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
  // Mockup for retrieving data for the worlds from the database
  const worldsContainer = document.getElementById("worlds-container");
  worldsContainer.innerHTML = "";
  // Example data for the two worlds that are used for the demo
  const worlds = [
    {
      id: 1,
      name: "Alpha Centaurii",
      description: "A world beyond the stars, with an infinitude of potential.",
    },
    {
      id: 2,
      name: "Pax Equus",
      description:
        "Rome has been taken overy by magical horses and only Caligula can stop them.",
    },
  ];
  worlds.forEach((world) => {
    const worldCard = document.createElement("div");
    worldCard.classList.add("world-card");
    worldCard.setAttribute("data-world-id", world.id);
    worldCard.innerHTML = `
    <h3>${world.name}</h3>
    <p>${world.description}</p>
    <button class="delete-world-button" onclick="deleteWorld(${world.id})">Delete</button>
    <button class="open-world-button" onclick="openWorld(${world.id})">Open World</button>
  `;
    worldsContainer.appendChild(worldCard);
  });}

document
  .getElementById("create-world-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const worldName = document.getElementById("world-name").value;
    const worldDescription = document.getElementById("world-description").value;
    // Logic to send new world to the database mockup
    const newWorld = {
      id: Date.now(),
      name: worldName,
      description: worldDescription,
    };

    const worldsContainer = document.getElementById("worlds-container");
    const worldCard = document.createElement("div");
    worldCard.classList.add("world-card");
    worldCard.setAttribute("data-world-id", newWorld.id);
    worldCard.innerHTML = `
            <h3>${newWorld.name}</h3>
            <p>${newWorld.description}</p>
            <button class="delete-world-button" onclick="deleteWorld(${newWorld.id})">Delete</button>
            <button class="open-world-button" onclick="openWorld(${newWorld.id})">Open World</button>
        `;
    worldsContainer.appendChild(worldCard);

    document.getElementById("world-name").value = "";
    document.getElementById("world-description").value = "";
  });

function deleteWorld(id) {
  // Logic to delete world from database mockup
  const worldCard = document.querySelector(
    `.world-card[data-world-id='${id}']`
  );
  worldCard.remove();
}
// Mockup for opening a world
function openWorld(id) {
  window.location.href = `world.html?id=${id}`; // Open the selected world
}
// Onload effects
window.onload = loadWorlds;
