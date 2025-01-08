async function initMap() {
  try {
    console.log("Starting map initialization...");
    const response = await fetch("./K-HJD_241001.json");
    const data = await response.json();
    console.log("TopoJSON data structure:", data);

    const map = await D3MapLib.initializeMap(
      "map-container",
      "./K-HJD_241001.json",
      {
        onRegionClick: (name) => {
          document.getElementById("region-name").textContent =
            name || "지역을 선택하세요";
        },
      }
    );
    window.map = map; // 디버깅용
  } catch (error) {
    console.error("Failed to initialize map:", error);
  }
}

document.addEventListener("DOMContentLoaded", initMap);
