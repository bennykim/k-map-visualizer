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
        points: industrialClusters,
        onRegionClick: (name) => {
          document.getElementById("region-name").textContent =
            name || "지역을 선택하세요";
        },
      }
    );
    window.map = map; // For debugging
  } catch (error) {
    console.error("Failed to initialize map:", error);
  }
}

document.addEventListener("DOMContentLoaded", initMap);

const industrialClusters = [
  {
    name: "반월시화산단",
    region: "수도권",
    location: "경기도 안산시/시흥시",
    coordinates: [37.3319, 126.7858],
    industries: ["자동차부품", "전자", "기계"],
    companies: 19000,
    majorCompanies: ["현대모비스", "삼성전기", "LG이노텍"],
  },
  {
    name: "남동산단",
    region: "수도권",
    location: "인천광역시 남동구",
    coordinates: [37.4079, 126.6958],
    industries: ["기계", "금속", "전기전자"],
    companies: 7300,
    majorCompanies: ["두산인프라코어", "LS전선"],
  },
  {
    name: "파주 LCD산업단지",
    region: "수도권",
    location: "경기도 파주시",
    coordinates: [37.8584, 126.78],
    industries: ["전자", "디스플레이"],
    companies: 950,
    majorCompanies: ["LG디스플레이", "삼성전자"],
  },
  {
    name: "화성 산업단지",
    region: "수도권",
    location: "경기도 화성시",
    coordinates: [37.1252, 126.9324],
    industries: ["반도체", "디스플레이"],
    companies: 1200,
    majorCompanies: ["삼성전자"],
  },
  {
    name: "판교 테크노밸리",
    region: "수도권",
    location: "경기도 성남시",
    coordinates: [37.4019, 127.1086],
    industries: ["IT", "소프트웨어", "바이오"],
    companies: 1300,
    majorCompanies: ["카카오", "네이버", "엔씨소프트"],
  },
  {
    name: "대덕연구개발특구",
    region: "충청권",
    location: "대전광역시",
    coordinates: [36.3737, 127.3657],
    industries: ["R&D", "바이오", "IT"],
    companies: 2000,
    majorCompanies: ["한국전자통신연구원", "한국화학연구원"],
  },
  {
    name: "천안 제2일반산업단지",
    region: "충청권",
    location: "충청남도 천안시",
    coordinates: [36.8019, 127.1577],
    industries: ["반도체", "배터리"],
    companies: 850,
    majorCompanies: ["삼성SDI", "SK하이닉스"],
  },
  {
    name: "아산 테크노밸리",
    region: "충청권",
    location: "충청남도 아산시",
    coordinates: [36.915, 126.9188],
    industries: ["자동차", "디스플레이"],
    companies: 750,
    majorCompanies: ["현대자동차", "삼성디스플레이"],
  },
  {
    name: "오송생명과학단지",
    region: "충청권",
    location: "충청북도 청주시",
    coordinates: [36.6336, 127.3205],
    industries: ["바이오", "제약"],
    companies: 400,
    majorCompanies: ["LG화학", "셀트리온"],
  },
  {
    name: "구미전자산단",
    region: "영남권",
    location: "경상북도 구미시",
    coordinates: [36.1019, 128.3894],
    industries: ["전자", "디스플레이", "반도체"],
    companies: 2500,
    majorCompanies: ["LG전자", "삼성전자"],
  },
  {
    name: "울산미포산단",
    region: "영남권",
    location: "울산광역시 남구",
    coordinates: [35.4758, 129.3668],
    industries: ["조선", "자동차", "석유화학"],
    companies: 1000,
    majorCompanies: ["현대중공업", "현대자동차"],
  },
  {
    name: "포항철강산업단지",
    region: "영남권",
    location: "경상북도 포항시",
    coordinates: [36.0199, 129.3605],
    industries: ["철강", "소재"],
    companies: 600,
    majorCompanies: ["POSCO"],
  },
  {
    name: "거제 조선해양산업단지",
    region: "영남권",
    location: "경상남도 거제시",
    coordinates: [34.8883, 128.6214],
    industries: ["조선", "해양플랜트"],
    companies: 300,
    majorCompanies: ["삼성중공업", "대우조선해양"],
  },
  {
    name: "마산 자유무역지역",
    region: "영남권",
    location: "경상남도 창원시",
    coordinates: [35.2156, 128.5814],
    industries: ["전기전자", "기계부품"],
    companies: 450,
    majorCompanies: ["LG전자", "두산중공업"],
  },
  {
    name: "광주첨단과학산단",
    region: "호남권",
    location: "광주광역시",
    coordinates: [35.2185, 126.8506],
    industries: ["광산업", "전자", "자동차부품"],
    companies: 1000,
    majorCompanies: ["삼성전자", "LG이노텍"],
  },
  {
    name: "여수국가산단",
    region: "호남권",
    location: "전라남도 여수시",
    coordinates: [34.8476, 127.7361],
    industries: ["석유화학", "정유"],
    companies: 280,
    majorCompanies: ["LG화학", "GS칼텍스", "롯데케미칼"],
  },
  {
    name: "군산 국가산업단지",
    region: "호남권",
    location: "전라북도 군산시",
    coordinates: [35.9766, 126.6306],
    industries: ["자동차", "신재생에너지", "기계"],
    companies: 350,
    majorCompanies: ["한국전기차", "두산퓨얼셀"],
  },
  {
    name: "광양 제철산업단지",
    region: "호남권",
    location: "전라남도 광양시",
    coordinates: [34.9425, 127.7052],
    industries: ["철강", "신소재"],
    companies: 220,
    majorCompanies: ["POSCO 광양제철소"],
  },
  {
    name: "원주 의료기기산업단지",
    region: "강원권",
    location: "강원도 원주시",
    coordinates: [37.3447, 127.9507],
    industries: ["의료기기", "바이오헬스"],
    companies: 150,
    majorCompanies: ["루트로닉", "레이"],
  },
  {
    name: "춘천 바이오산업단지",
    region: "강원권",
    location: "강원도 춘천시",
    coordinates: [37.8813, 127.7365],
    industries: ["바이오", "제약"],
    companies: 100,
    majorCompanies: ["차바이오텍", "바이오솔루션"],
  },
];
