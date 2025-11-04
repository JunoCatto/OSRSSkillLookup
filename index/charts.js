import {
  Chart,
  registerables,
} from "https://cdn.jsdelivr.net/npm/chart.js@4.5.1/+esm";
// import ChartDataLabels from "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/+esm";
import { skillData, minigameData } from "./runescapeWikiAPI.js";

Chart.register(...registerables);

let combatChart = null;
let minigameChart = null;

export function combatChartData() {
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
          backgroundColor: "#f38ba881",
          borderColor: "#f38ba8",
          borderWidth: 1,
          pointBackgroundColor: "#f38ba8",
          pointBorderColor: "#ffffff",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      animation: false,
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
            font: {
              size: 14,
              color: "#cdd6f4",
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
          text: "Combat Levels",
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

const catppuccinColors = [
  "#f38ba8", // Rosewater
  "#fab387", // Peach
  "#f9e2af", // Yellow
  "#a6e3a1", // Green
  "#94e2d5", // Teal
  "#89b4fa", // Blue
  "#b4befe", // Lavender
  "#cba6f7", // Mauve
  "#f5c2e7", // Pink
  "#eba0ac", // Red
  "#f2cdcd", // Flamingo
];

export function minigameChartData() {
  const canvas = document.getElementById("minigameChart");
  if (!canvas) return;

  // Colours
  const backgroundColours = minigameData.map((_, i) => {
    return catppuccinColors[i % catppuccinColors.length];
  });
  const borderColours = backgroundColours.map((colour) => colour + "cc");

  // Total score
  const totalScore = minigameData.reduce((sum, m) => sum + m.score, 0);

  const ctx = canvas.getContext("2d");

  if (minigameChart) {
    minigameChart.destroy();
  }
  minigameChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: minigameData.map(
        (minigame) => `${minigame.name} (${minigame.score})`
      ),
      datasets: [
        {
          label: "Minigame Scores",
          data: minigameData.map((minigame) => minigame.score),
          backgroundColor: backgroundColours,
          borderColor: borderColours,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
        // Inline plugin for drawing total
        tooltip: { enabled: true }, // keep tooltips if you want
      },
    },
    plugins: [
      {
        // Copied from https://www.youtube.com/watch?v=gb88gFbgf94
        id: "totalCenter", // unique id
        afterDraw(chart) {
          const {
            ctx,
            chartArea: { width, height },
          } = chart;
          ctx.save();
          ctx.font = "bold 24px Arial";
          ctx.fillStyle = "#cdd6f4";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(totalScore, width / 2, height / 2);
          ctx.restore();
        },
      },
    ],
  });
}
