async function initMap() {
  try {
    console.log("Starting map initialization...");
    const response = await fetch("./K-City_2023.json");
    const data = await response.json();
    console.log("TopoJSON data structure:", data);

    const map = await MapRenderer.initializeMap(
      "map-container",
      "./K-City_2023.json",
      {
        width: window.innerWidth,
        height: window.innerHeight,
        center: [128.15, 35.75],
        scale: 5000,
        points: [],
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
              <span style="color: #D4D4D8">지역:</span> ${point.region}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #D4D4D8">위치:</span> ${point.location}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #D4D4D8">산업:</span> ${point.industries.join(
                ", "
              )}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #D4D4D8">기업 수:</span> ${point.companies.toLocaleString()}개
            </div>
            <div>
              <span style="color: #D4D4D8">주요기업:</span> ${point.majorCompanies.join(
                ", "
              )}
            </div>
          `;
        },
      }
    );
    window.map = map; // For debugging
  } catch (error) {
    console.error("Failed to initialize map:", error);
  }
}

document.addEventListener("DOMContentLoaded", initMap);
