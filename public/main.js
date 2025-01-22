function isValidColor(color) {
  if (color.startsWith("#")) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  }
  if (color.startsWith("rgba")) {
    return /^rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-1](?:\.[0-9]+)?)\s*\)$/.test(
      color
    );
  }
  return false;
}

function validateColors() {
  const colorInputs = document.querySelectorAll('input[type="text"]');
  const validationMessages = document.querySelector(".validation-messages");
  const errors = [];

  colorInputs.forEach((input) => input.classList.remove("error"));

  colorInputs.forEach((input) => {
    if (!isValidColor(input.value)) {
      input.classList.add("error");
      const label = input.previousElementSibling.textContent;
      errors.push(`Invalid HEX (#RRGGBB) or RGBA (r,g,b,a) format`);
    }
  });

  validationMessages.innerHTML = errors.join("<br>");

  return errors.length === 0;
}

function setupColorControls() {
  document.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value.match(/^[0-9A-Fa-f]{6}$/)) {
        e.target.value = "#" + value;
      }
    });
  });

  document.getElementById("apply-colors").addEventListener("click", () => {
    if (validateColors()) {
      renderMap();
    }
  });
}

function getColorValues() {
  return {
    region: document.getElementById("region-color").value.trim(),
    regionHover: document.getElementById("region-hover-color").value.trim(),
    point: document.getElementById("point-color").value.trim(),
    pointHover: document.getElementById("point-hover-color").value.trim(),
    selected: document.getElementById("selected-color").value.trim(),
    border: document.getElementById("border-color").value.trim(),
  };
}

const tooltipRenderer = (point) => `
  <div style="margin-bottom: 8px;">
    <strong style="color: #5EEAD4">${point.name}</strong>
  </div>
  <div style="margin-bottom: 4px;">
    <span style="color: #D4D4D8">Region:</span> ${point.region}
  </div>
  <div style="margin-bottom: 4px;">
    <span style="color: #D4D4D8">Location:</span> ${point.location}
  </div>
  <div style="margin-bottom: 4px;">
    <span style="color: #D4D4D8">Type:</span> ${point.type}
  </div>
`;

const handleRegionClick = (name) => {
  document.getElementById("region-name").textContent = name || "Choose Region";
};

async function renderMap() {
  try {
    console.log("Rendering map...");

    const colors = getColorValues();
    const points = window.cityHalls;

    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = "";

    const map = await GeoKoreaRenderer.createMap("map-container", {
      points,
      colors,
      onRegionClick: handleRegionClick,
      tooltipRenderer,
    });

    window.map = map;
  } catch (error) {
    console.error("Failed to render map:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderMap();
  setupColorControls();
});
