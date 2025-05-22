import json
import requests
from bs4 import BeautifulSoup
import re
from pathlib import Path
import os

# List of target schools
schools = [
    "Arizona", "Arkansas", "Auburn", "BYU", "Baylor", "Colorado State", "Connecticut",
    "Creighton", "Duke", "Florida", "Georgetown", "Georgia", "Houston", "Illinois",
    "Kentucky", "Marquette", "Maryland", "Michigan", "Michigan State", "North Carolina",
    "Oklahoma", "Rutgers", "Saint Joseph's", "San Diego State", "South Carolina",
    "Stanford", "Tennessee", "Texas", "Texas Tech", "UAB", "Villanova", "Wake Forest", "Washington State"
]


# Normalize name for URL
def make_slug(name):
    return name.lower().replace(" ", "-").replace("'", "")

# Scrape color codes
def get_colors(school):
    slug = make_slug(school)
    url = f"https://teamcolorcodes.com/{slug}"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        hex_codes = re.findall(r'#[0-9A-Fa-f]{6}', soup.get_text())
        primary = hex_codes[0] if len(hex_codes) > 0 else "#e0e7ff"
        secondary = hex_codes[1] if len(hex_codes) > 1 else "#ffffff"

        print(f"✅ {school}: {primary}, {secondary}")
        return primary, secondary

    except Exception as e:
        print(f"⚠️ {school}: {e}")
        return "#e0e7ff", "#ffffff"

# Build dictionary
data = {"schools": {}}
for school in schools:
    primary, secondary = get_colors(school)
    data["schools"][school] = {
        "colors": {
            "primary": primary,
            "secondary": secondary
        },
        "logo": f"{school.replace(' ', '_')}.png"
    }

    
# Ensure directory exists
os.makedirs("src/data", exist_ok=True)

# Save JSON file
Path("data").mkdir(exist_ok=True)
with open("src/data/school_colors_logos.json", "w") as f:
    json.dump(data, f, indent=2)

print("\n🎯 Done. Saved to data/school_colors_logos.json")