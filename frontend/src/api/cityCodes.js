export const CITY_CODES = {
  "Delhi": "DEL",
  "Mumbai": "BOM",
  "Bangalore": "BLR",
  "Chennai": "MAA",
  "Kolkata": "CCU",
  "Hyderabad": "HYD",
  "Pune": "PNQ",
  "Ahmedabad": "AMD",
  "Jaipur": "JAI",
  "Goa": "GOI",
  "London": "LON",
  "Paris": "PAR",
  "New York": "NYC",
  "Dubai": "DXB",
  "Singapore": "SIN",
  "Tokyo": "TYO",
  "Los Angeles": "LAX",
  "San Francisco": "SFO",
  "Chicago": "CHI",
  "Boston": "BOS",
  "Miami": "MIA",
  "Las Vegas": "LAS",
  "Amsterdam": "AMS",
  "Barcelona": "BCN",
  "Rome": "ROM",
  "Madrid": "MAD",
  "Berlin": "BER",
  "Sydney": "SYD",
  "Melbourne": "MEL",
  "Bangkok": "BKK",
  "Hong Kong": "HKG",
  "Seoul": "SEL",
  "Shanghai": "SHA",
  "Beijing": "BJS",
};

export function getCityCode(cityName) {
  const normalizedName = Object.keys(CITY_CODES).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );
  
  return normalizedName ? CITY_CODES[normalizedName] : cityName.toUpperCase();
}

export function getCityName(code) {
  const entry = Object.entries(CITY_CODES).find(
    ([_, value]) => value === code.toUpperCase()
  );
  
  return entry ? entry[0] : code;
}

export const POPULAR_CITIES = [
  { name: "Delhi", code: "DEL" },
  { name: "Mumbai", code: "BOM" },
  { name: "Bangalore", code: "BLR" },
  { name: "London", code: "LON" },
  { name: "Paris", code: "PAR" },
  { name: "New York", code: "NYC" },
  { name: "Dubai", code: "DXB" },
  { name: "Singapore", code: "SIN" },
];