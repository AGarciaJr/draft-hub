import requests
from bs4 import BeautifulSoup
import json
import time
from pathlib import Path
from tqdm import tqdm

BASE_URL = "https://www.sports-reference.com"
INDEX_URL = f"{BASE_URL}/cbb/players/"

def fetch_player_links_by_letter(letter: str):
    """Fetch all (name, link) pairs from an index letter page."""
    url = f"{INDEX_URL}{letter}-index.html"
    try:
        response = requests.get(url)
        if response.status_code != 200:
            return []
        soup = BeautifulSoup(response.text, 'html.parser')
        # Print the first 500 characters of the HTML for debugging (only for 'f')
        if letter == 'f':
            print("\n[DEBUG] First 500 chars of 'f' index page HTML:\n", response.text[:500])
        players = []
        for a in soup.select('a'):  # Try all <a> tags for now
            if a.parent.name == 'p':  # Most player links are in <p><a>...</a></p>
                name = a.text.strip()
                link = BASE_URL + a['href']
                players.append((name, link))
        return players
    except Exception:
        return []

def fetch_position(player_url: str) -> str:
    """Fetch the position from a player profile page."""
    try:
        res = requests.get(player_url, timeout=10)
        if res.status_code != 200:
            return "Unknown"

        soup = BeautifulSoup(res.text, 'html.parser')
        meta = soup.find('div', id='meta')

        if not meta:
            return "Unknown"

        # Find the <strong> tag with 'Position'
        strong = meta.find('strong', string=lambda s: s and 'Position' in s)
        if strong and strong.next_sibling:
            # The position is the next sibling, possibly with extra whitespace/quotes
            pos = strong.next_sibling
            if isinstance(pos, str):
                return pos.strip().replace('"', '')
            else:
                return pos.get_text(strip=True).replace('"', '')

        return "Unknown"
    except Exception as e:
        return "Unknown"

def main():
    # Load player bios
    input_path = Path("src/data/processed/bio.json")
    with open(input_path, 'r', encoding='utf-8') as f:
        bios = json.load(f)

    # Build target lookup by lowercase name
    target_names = {p["name"].strip().lower(): p["name"] for p in bios}
    found_positions = {}

    print("🔍 Scraping Sports-Reference player positions...")
    for letter in tqdm("abcdefghijklmnopqrstuvwxyz"):
        players = fetch_player_links_by_letter(letter)
        print(f"\n[DEBUG] Letter: {letter} - Scraped {len(players)} players")
        for scraped_name, link in players:
            print(f"[DEBUG] Scraped: {scraped_name}")
            key = scraped_name.strip().lower()
            if key in target_names and target_names[key] not in found_positions:
                print(f"[DEBUG] Matched: {scraped_name} (key: {key})")
                # Visit the player's profile page
                position = fetch_position(link)
                found_positions[target_names[key]] = position
                print(f"✓ {target_names[key]} → {position}")
                time.sleep(1.2)  # be polite

    # Mark unmatched players
    for name in target_names.values():
        if name not in found_positions:
            found_positions[name] = "Unknown"

    output_path = Path("src/data/processed/scraped_positions.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(found_positions, f, indent=2)

    print(f"\n✅ Finished scraping. Results saved to: {output_path}")

    # Test fetch_position for Cooper Flagg directly
    print("\n[TEST] Fetching position for Cooper Flagg directly:")
    cooper_url = "https://www.sports-reference.com/cbb/players/cooper-flagg-1.html"
    print(f"Result: {fetch_position(cooper_url)}")

if __name__ == "__main__":
    main()
