const BASE_URL = "https://api.spoonacular.com";

function getApiKey() {
  const key = process.env.REACT_APP_SPOONACULAR_API_KEY;
  if (!key) {
    throw new Error(
      "Missing API key. Add REACT_APP_SPOONACULAR_API_KEY to your .env file and restart npm start."
    );
  }
  return key;
}

export async function apiGet(path, params = {}, signal) {
  const url = new URL(BASE_URL + path);

  // Add apiKey to every request
  url.searchParams.set("apiKey", getApiKey());

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), { method: "GET", signal });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}
