import {
  Chart,
  registerables,
} from "https://cdn.jsdelivr.net/npm/chart.js@4.5.1/+esm";
import { skillData, minigameData } from "./runescapeWikiAPI.js";

Chart.register(...registerables);

let combatChart = null;

export function chartData() {
  const canvas = document.getElementById("combatLevel");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (combatChart) {
    combatChart.destroy();
  }

  // filtering skillData to only include combat skills
  const combatSkillNames = [
    "Attack",
    "Defence",
    "Strength",
    "Hitpoints",
    "Ranged",
    "Prayer",
    "Magic",
  ];

  const combatSkills = skillData.filter((skill) =>
    combatSkillNames.includes(skill.name)
  );

  combatChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: combatSkills.map((skill) => skill.name),
      datasets: [
        {
          label: combatSkills.name,
          data: combatSkills.map((skill) => skill.level),
          backgroundColor: "#f2cdcd7e",
          borderColor: "#f2cdcd",
          borderWidth: 1,
          pointBackgroundColor: "#f2cdcd",
          pointBorderColor: "#ffffff",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainaspectratio: false,
      scales: {
        r: {
          min: 0,
          max: 99,
          ticks: {
            stepSize: 10,
            backdropColor: "transparent",
            color: "#cdd6f4",
          },
          pointLabels: {
            display: true,
            color: "#cdd6f4",
            font: {
              size: 12,
              weight: "bold",
            },
          },
          grid: {
            color: "#6c7086",
          },
        },
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Runescape Combat Levels",
          color: "#cdd6f4",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  });
}
