async function initMap() {
  try {
    console.log("Starting map initialization...");
    const response = await fetch("./K-City_2023.json");
    const data = await response.json();
    console.log("TopoJSON data structure:", data);

    const map = await GeoKoreaRenderer.initializeMap("map-container", {
      width: window.innerWidth,
      height: window.innerHeight,
      center: [128.15, 35.75],
      scale: 2,
      points: cityHalls,
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
              <span style="color: #D4D4D8">지역:</span> ${point.region}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #D4D4D8">위치:</span> ${point.location}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #D4D4D8">타입:</span> ${point.type}
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

const cityHalls = [
  {
    name: "서울시청",
    region: "수도권",
    location: "서울특별시",
    coordinates: [37.5666805, 126.9784147],
    type: "시청",
  },
  {
    name: "부산시청",
    region: "영남권",
    location: "부산광역시",
    coordinates: [35.1797865, 129.0750194],
    type: "시청",
  },
  {
    name: "인천시청",
    region: "수도권",
    location: "인천광역시",
    coordinates: [37.4561726, 126.7051698],
    type: "시청",
  },
  {
    name: "대구시청",
    region: "영남권",
    location: "대구광역시",
    coordinates: [35.8714354, 128.601445],
    type: "시청",
  },
  {
    name: "안산시청",
    region: "수도권",
    location: "경기도 안산시",
    coordinates: [37.3218843, 126.8308456],
    type: "시청",
  },
  {
    name: "시흥시청",
    region: "수도권",
    location: "경기도 시흥시",
    coordinates: [37.3792528, 126.8029755],
    type: "시청",
  },
  {
    name: "파주시청",
    region: "수도권",
    location: "경기도 파주시",
    coordinates: [37.7605677, 126.7796584],
    type: "시청",
  },
  {
    name: "화성시청",
    region: "수도권",
    location: "경기도 화성시",
    coordinates: [37.1995392, 126.8311976],
    type: "시청",
  },
  {
    name: "성남시청",
    region: "수도권",
    location: "경기도 성남시",
    coordinates: [37.4200973, 127.1267194],
    type: "시청",
  },
  {
    name: "대전시청",
    region: "충청권",
    location: "대전광역시",
    coordinates: [36.3504119, 127.3845475],
    type: "시청",
  },
  {
    name: "천안시청",
    region: "충청권",
    location: "충청남도 천안시",
    coordinates: [36.8151124, 127.1135403],
    type: "시청",
  },
  {
    name: "아산시청",
    region: "충청권",
    location: "충청남도 아산시",
    coordinates: [36.7900487, 127.0042174],
    type: "시청",
  },
  {
    name: "청주시청",
    region: "충청권",
    location: "충청북도 청주시",
    coordinates: [36.6424587, 127.4890619],
    type: "시청",
  },
  {
    name: "세종시청",
    region: "충청권",
    location: "세종특별자치시",
    coordinates: [36.4800984, 127.2891848],
    type: "시청",
  },
  {
    name: "구미시청",
    region: "영남권",
    location: "경상북도 구미시",
    coordinates: [36.1194257, 128.3445587],
    type: "시청",
  },
  {
    name: "울산시청",
    region: "영남권",
    location: "울산광역시",
    coordinates: [35.5383773, 129.3113596],
    type: "시청",
  },
  {
    name: "포항시청",
    region: "영남권",
    location: "경상북도 포항시",
    coordinates: [36.0190333, 129.3435765],
    type: "시청",
  },
  {
    name: "거제시청",
    region: "영남권",
    location: "경상남도 거제시",
    coordinates: [34.8806261, 128.6211769],
    type: "시청",
  },
  {
    name: "창원시청",
    region: "영남권",
    location: "경상남도 창원시",
    coordinates: [35.227959, 128.6819829],
    type: "시청",
  },
  {
    name: "광주시청",
    region: "호남권",
    location: "광주광역시",
    coordinates: [35.1595454, 126.8526012],
    type: "시청",
  },
  {
    name: "전주시청",
    region: "호남권",
    location: "전라북도 전주시",
    coordinates: [35.8242238, 127.1479532],
    type: "시청",
  },
  {
    name: "여수시청",
    region: "호남권",
    location: "전라남도 여수시",
    coordinates: [34.7604013, 127.6622632],
    type: "시청",
  },
  {
    name: "목포시청",
    region: "호남권",
    location: "전라남도 목포시",
    coordinates: [34.8118351, 126.3921664],
    type: "시청",
  },
  {
    name: "군산시청",
    region: "호남권",
    location: "전라북도 군산시",
    coordinates: [35.9676772, 126.7366793],
    type: "시청",
  },
  {
    name: "광양시청",
    region: "호남권",
    location: "전라남도 광양시",
    coordinates: [34.9402401, 127.6909882],
    type: "시청",
  },
  {
    name: "원주시청",
    region: "강원권",
    location: "강원도 원주시",
    coordinates: [37.3422184, 127.9199835],
    type: "시청",
  },
  {
    name: "춘천시청",
    region: "강원권",
    location: "강원도 춘천시",
    coordinates: [37.8811654, 127.7300948],
    type: "시청",
  },
  {
    name: "강릉시청",
    region: "강원권",
    location: "강원도 강릉시",
    coordinates: [37.7515127, 128.8759163],
    type: "시청",
  },
  {
    name: "제주도청",
    region: "제주권",
    location: "제주특별자치도",
    coordinates: [33.4890113, 126.4983023],
    type: "도청",
  },
];
