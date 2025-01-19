async function initMap() {
  try {
    console.log("Starting map initialization...");
    const response = await fetch("./K-City_2023.json");
    const data = await response.json();
    console.log("TopoJSON data structure:", data);

    const points = window.cityHalls;

    const map = await GeoKoreaRenderer.createMap("map-container", {
      points,
      colors: {
        region: "#e5e7eb",
        regionHover: "#d1d5db",
        point: "#3b82f6",
        pointHover: "#ef4444",
        selected: "#93c5fd",
        border: "#6b7280",
      },
      onRegionClick: (name) => {
        document.getElementById("region-name").textContent =
          name || "지역을 선택하세요";
      },
      tooltipRenderer: (point) => {
        return `
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
      },
    });
    window.map = map; // For debugging
  } catch (error) {
    console.error("Failed to initialize map:", error);
  }
}

document.addEventListener("DOMContentLoaded", initMap);
