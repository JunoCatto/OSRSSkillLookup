import { iconMap } from "./icons.js";
import {
  createIcons,
  icons,
} from "https://cdn.jsdelivr.net/npm/lucide@latest/+esm";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
import { chartData } from "./charts.js";

// Global variables
let currentUser = "";
let userData = null;
export let minigameData = null;
export let skillData = null;
const skillContainer = document.getElementById("skillContainer");
const tabContainer = document.getElementById("tabContainer");
const playerContainer = document.getElementById("playerContainer");
const minigameContainer = document.getElementById("minigameContainer");
const playerLevel = document.getElementById("playerLevel");
const playerExp = document.getElementById("playerExp");
const playerRank = document.getElementById("playerRank");
const spinner = document.getElementById("spinner");

// API fetch
async function fetchData(user) {
  // Hides all previous data when fetching new user
  playerContainer.style.display = "none";
  tabContainer.style.display = "none";
  document
    .querySelectorAll(".tabContainer")
    .forEach((container) => (container.style.display = "none"));

  // Show spinner and container
  skillContainer.innerHTML = `
        <div class="d-flex justify-content-center" id="spinner" style="margin-top: 10px;">
          <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `;

  skillContainer.style.display = "grid";
  spinner.style.display = "flex";
  // API call
  const response = await fetch(`/.netlify/functions/player?user=${user}`);
  const result = await response.json();

  // Error checking for player not found
  if (result.error == "Player not found") {
    alert("That user does not exist.");
    skillContainer.style.display = "none";
    spinner.style.display = "none";
    currentUser = "";
    return;
  }
  userData = result;
  renderSkills();
  renderMinigames();
  renderStatistics();
  swapTab("Skills");
  document.querySelectorAll("#tabSelector .nav-link").forEach((tab) => {
    tab.classList.remove("active");
    document.getElementById("Skills").classList.add("active");
  });
}
// Renders the skills tab
function renderSkills() {
  const cleanedData = userData.skills.map(({ name, level, xp, rank }) => ({
    name,
    level,
    experience: xp,
    rank,
  }));

  playerContainer.style.display = "block";
  tabContainer.style.display = "block";

  const playerData = cleanedData.find((skill) => skill.name === "Overall");
  playerLevel.innerHTML = `<span class="fw-semibold">Overall Level</span><br> ${playerData.level}`;
  playerExp.innerHTML = `<span class="fw-semibold">Total Experience</span><br> ${playerData.experience}`;
  playerRank.innerHTML = `<span class="fw-semibold">Rank</span><br> #${playerData.rank}`;

  skillContainer.innerHTML = "";

  cleanedData.forEach((skill) => {
    if (skill.name === "Overall") return;

    const skillDiv = document.createElement("div");
    skillDiv.classList.add("skillsDiv");
    const maxLevel = 99;
    const progress = (skill.level / maxLevel) * 100;

    const iconName = iconMap[skill.name];
    skillDiv.innerHTML = `<div class="skillTop">
            <span class="skillIcon"><i data-lucide=${iconName}></i></span>
            <span class="fw-semibold skillName">${skill.name}</span>
          </div>
          <div class="d-flex w-100 justify-content-between align-items-center">
          <span>Level ${skill.level}</span>
          <span class="rank ms-auto">${skill.experience} XP</span>
          </div>
          <div class="progress w-100" style="background-color: #6c7086 ;height:5px;">
    <div class="progress-bar" role="progressbar" style="width: ${progress}%; background-color: #f2cdcd;" 
      aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="99">
    </div>
  </div>
          `;
    skillContainer.appendChild(skillDiv);
  });
  skillData = cleanedData;
  createIcons({ icons });
  // Hide spinner after data is fetched
  spinner.style.display = "none";
}
// Renders the activities tab
function renderMinigames() {
  minigameContainer.innerHTML = "";
  // Filter out minigames with score -1, and sorts by score.
  const cleanedData = userData.activities
    .filter((data) => data.score !== -1)
    .map((data) => ({
      name: data.name,
      score: data.score,
      rank: data.rank,
    }))
    .sort((a, b) => b.score - a.score);
  cleanedData.forEach((minigame) => {
    const minigameDiv = document.createElement("div");
    minigameDiv.classList.add("skillsDiv");
    minigameDiv.innerHTML = `<div class="skillTop">
            <span class="skillIcon">
            <i data-lucide="award"></i>
            </span>
            <span class="skillName">
            ${minigame.name}
            </span>
          </div>
    <div class="d-flex w-100 justify-content-between align-items-center">
      <span>Score: ${minigame.score}</span>
      <span class="rank ms-auto">#${minigame.rank}</span>
    </div>`;
    minigameContainer.appendChild(minigameDiv);
  });
  minigameData = cleanedData;
  createIcons({ icons });
}
// Renders the statistics tab
function renderStatistics() {
  chartData();
}

// Swaps tabs
function swapTab(tabName) {
  document
    .querySelectorAll(".tabContainer")
    .forEach((container) => (container.style.display = "none"));

  switch (tabName) {
    case "Skills":
      skillContainer.style.display = "grid";
      break;

    case "Activities":
      minigameContainer.style.display = "grid";
      break;

    case "Statistics":
      statisticsContainer.style.display = "grid";
      break;
  }
}

// Event listener for tab selection
document.querySelectorAll("#tabSelector .nav-link").forEach((tab) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();

    document.querySelectorAll("#tabSelector .nav-link").forEach((tab) => {
      tab.classList.remove("active");
    });
    event.target.classList.add("active");
    const tabName = event.target.textContent.trim();
    swapTab(tabName);
  });
});
// Event listener for user input
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("searchButton");
  const userInput = document.getElementById("userName");
  button.addEventListener("click", () => {
    if (
      userInput.value.trim().toLowerCase() === currentUser ||
      userInput.value.trim().toLowerCase() === ""
    )
      return;
    currentUser = userInput.value.trim().toLowerCase();
    try {
      fetchData(currentUser);
    } catch (error) {
      error.message === "That user does not exist.";
    }
  });
});
