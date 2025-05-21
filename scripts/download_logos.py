import os
import requests
from pathlib import Path

# Create logos directory if it doesn't exist
LOGO_DIR = Path("src/assets/logos")
LOGO_DIR.mkdir(parents=True, exist_ok=True)

# Dictionary of school domains for Clearbit Logo API
SCHOOL_DOMAINS = {
    "duke": "duke.edu",
    "rutgers": "rutgers.edu",
    "texas": "utexas.edu",
    "baylor": "baylor.edu",
    "gonzaga": "gonzaga.edu",
    "iowa": "uiowa.edu",
    "auburn": "auburn.edu",
    "villanova": "villanova.edu",
    "florida": "ufl.edu",
    "nebraska": "unl.edu",
    "joventut": "penya.com",  # Official site for Joventut Badalona
    "stjohns": "stjohns.edu",
    "perth": "wildcats.com.au",
    "alabama": "ua.edu",
    "capitanes": "capitanes.mx"
}

def download_logo(school_key, domain):
    try:
        url = f"https://logo.clearbit.com/{domain}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        file_path = LOGO_DIR / f"{school_key}.png"
        with open(file_path, 'wb') as f:
            f.write(response.content)
        print(f"Successfully downloaded {school_key} logo from {domain}")
    except Exception as e:
        print(f"Error downloading {school_key} logo: {str(e)}")

def main():
    for school_key, domain in SCHOOL_DOMAINS.items():
        download_logo(school_key, domain)

if __name__ == "__main__":
    main() 