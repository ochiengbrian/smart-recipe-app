import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { usePreferences } from "../context/PreferencesContext";

export default function Settings() {
  const { prefs, setDiet, setCuisine, setMaxTime, reset } = usePreferences();

  return (
    <div className="stack">
      <Card
        title="Settings"
        subtitle="Preferences are saved on this device (no login required)."
      >
        <div className="settingsGrid" style={{ marginTop: "14px" }}>
          <Card title="Dietary preferences" subtitle="Toggle what applies to you.">
            <div className="stack">
              <label className="toggleRow">
                <span>Vegetarian</span>
                <input
                  type="checkbox"
                  checked={prefs.diets.vegetarian}
                  onChange={(e) => setDiet("vegetarian", e.target.checked)}
                />
              </label>

              <label className="toggleRow">
                <span>Vegan</span>
                <input
                  type="checkbox"
                  checked={prefs.diets.vegan}
                  onChange={(e) => setDiet("vegan", e.target.checked)}
                />
              </label>

              <label className="toggleRow">
                <span>Gluten-free</span>
                <input
                  type="checkbox"
                  checked={prefs.diets.glutenFree}
                  onChange={(e) => setDiet("glutenFree", e.target.checked)}
                />
              </label>

              <label className="toggleRow">
                <span>Dairy-free</span>
                <input
                  type="checkbox"
                  checked={prefs.diets.dairyFree}
                  onChange={(e) => setDiet("dairyFree", e.target.checked)}
                />
              </label>
            </div>
          </Card>

          <Card title="Taste & time" subtitle="Help us recommend better recipes.">
            <div className="stack">
              <div className="stack">
                <label style={{ fontWeight: 800 }}>Cuisine</label>
                <select
                  className="select"
                  value={prefs.cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                >
                  <option>Any</option>
                  <option>Italian</option>
                  <option>Indian</option>
                  <option>Chinese</option>
                  <option>Mexican</option>
                  <option>Thai</option>
                  <option>French</option>
                  <option>Mediterranean</option>
                </select>
              </div>

              <div className="stack">
                <label style={{ fontWeight: 800 }}>Max cooking time</label>
                <select
                  className="select"
                  value={prefs.maxTime}
                  onChange={(e) => setMaxTime(e.target.value)}
                >
                  <option value="Any">Any</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                </select>
              </div>

              <Button variant="ghost" onClick={reset}>
                Reset preferences
              </Button>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
