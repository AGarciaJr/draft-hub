from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from pathlib import Path
import base64
import time
import requests
from PIL import Image
from io import BytesIO

SCHOOL_ALIASES = {
    'Arizona': 'Arizona Wildcats Logo',
    'Arkansas': 'Arkansas Razorbacks Logo',
    'Auburn': 'Auburn Tigers Logo',
    'BYU': 'BYU Cougars Logo',
    'Baylor': 'Baylor Bears Logo',
    'Colorado St': 'Colorado State Rams Logo',
    'Connecticut': 'UConn Huskies Logo',  # Fallback
    'Creighton': 'Creighton Bluejays Logo',
    'Duke': 'Duke Blue Devils Logo',
    'Florida': 'Florida Gators Logo',
    'Georgetown': 'Georgetown Hoyas Logo',
    'Georgia': 'Georgia Bulldogs Logo',
    'Houston': 'Houston Cougars Logo',
    'Illinois': 'Illinois Fighting Illini Logo',
    'Kentucky': 'Kentucky Wildcats Logo',
    'Marquette': 'Marquette Golden Eagles Logo',
    'Maryland': 'Maryland Terrapins Logo',
    'Michigan': 'Michigan Wolverines Logo',
    'Michigan St': 'Michigan State Spartans Logo',
    'North Carolina': 'North Carolina Tar Heels Logo',  # Fallback
    'Oklahoma': 'Oklahoma Sooners Logo',
    'Rutgers': 'Rutgers Scarlet Knights Logo',
    "Saint Joseph's": "Saint Joseph’s Hawks Logo",  # Fallback (curly apostrophe)
    'San Diego St': 'San Diego State Aztecs Logo',
    'South Carolina': 'South Carolina Gamecocks Logo',
    'Stanford': 'Stanford Cardinal Logo',
    'Tennessee': 'Tennessee Volunteers Logo',
    'Texas': 'Texas Longhorns Logo',
    'Texas Tech': 'Texas Tech Red Raiders Logo',
    'UAB': 'UAB Blazers Logo',
    'Villanova': 'Villanova Wildcats Logo',
    'Wake Forest': 'Wake Forest Demon Deacons Logo',
    'Washington St': 'Washington State Cougars Logo'
}

FALLBACK_LOGO_PAGES = {
    'Connecticut': {
        'url': 'https://1000logos.net/uconn-logo/',
        'alt': 'UConn'  # Match anything with UConn
    },
    'North Carolina': {
        'url': 'https://1000logos.net/north-carolina-tar-heels-logo/',
        'alt': 'North Carolina'  # Less specific
    },
    "Saint Joseph's": {
        'url': 'https://1000logos.net/saint-josephs-hawks-logo/',
        'alt': "Saint Joseph"  # Apostrophe-safe
    }
}


output_dir = Path(__file__).resolve().parent.parent / "src" / "assets" / "logos"
output_dir.mkdir(parents=True, exist_ok=True)

options = Options()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(options=options)

matched = 0
unmatched = set(SCHOOL_ALIASES.keys())

# Phase 1: Search A–Z pages
for letter in "abcdefghijklmnopqrstuvwxyz":
    print(f"\n🔍 Searching: {letter.upper()}")
    driver.get(f"https://1000logos.net/american-colleges-ncaa/?az={letter}")
    time.sleep(2)
    images = driver.find_elements(By.TAG_NAME, "img")

    for img in images:
        alt = img.get_attribute("alt")
        if not alt:
            continue

        for school, expected_alt in SCHOOL_ALIASES.items():
            if school not in unmatched:
                continue
            if expected_alt.lower() in (alt or "").lower():
                try:
                    driver.execute_script("arguments[0].scrollIntoView(true);", img)
                    time.sleep(1)
                    src = img.get_attribute("src")
                    filename = output_dir / f"{school.replace(' ', '_')}.png"

                    if src.startswith("data:image"):
                        data = base64.b64decode(src.split(",")[1])
                    else:
                        data = requests.get(src).content

                    image = Image.open(BytesIO(data)).convert("RGBA")
                    image.save(filename, "PNG")

                    print(f"✅ {school} → {filename.name}")
                    matched += 1
                    unmatched.remove(school)
                except Exception as e:
                    print(f"⚠️ Failed to process {school}: {e}")
                break

# Phase 2: Fallback individual pages
for school in list(unmatched):
    if school not in FALLBACK_LOGO_PAGES:
        continue
    url = FALLBACK_LOGO_PAGES[school]
    expected_alt = SCHOOL_ALIASES[school]
    print(f"\n🛟 Fallback for {school} → {url}")

    driver.get(url)
    time.sleep(2)
    images = driver.find_elements(By.TAG_NAME, "img")

    for img in images:
        alt = img.get_attribute("alt")
        if alt == expected_alt:
            try:
                driver.execute_script("arguments[0].scrollIntoView(true);", img)
                time.sleep(1)
                src = img.get_attribute("src")
                filename = output_dir / f"{school.replace(' ', '_')}.png"

                if src.startswith("data:image"):
                    data = base64.b64decode(src.split(",")[1])
                else:
                    data = requests.get(src).content

                image = Image.open(BytesIO(data)).convert("RGBA")
                image.save(filename, "PNG")

                print(f"✅ (fallback) {school} → {filename.name}")
                matched += 1
                unmatched.remove(school)
            except Exception as e:
                print(f"⚠️ Failed fallback for {school}: {e}")
            break

driver.quit()

# Summary
print(f"\n🎯 Done. {matched}/{len(SCHOOL_ALIASES)} logos saved as PNG.")
if unmatched:
    print("❌ Not found:")
    for school in sorted(unmatched):
        print(f" - {school}")
