import json
import os
from pathlib import Path

def ensure_directory(directory):
    """Create directory if it doesn't exist."""
    Path(directory).mkdir(parents=True, exist_ok=True)

def load_json_file(file_path):
    """Load and return JSON data from file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json_file(data, file_path):
    """Save data to JSON file with proper formatting."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def create_players_summary(bios):
    """Create a summary of all players with essential information."""
    players_summary = []
    for player in bios:
        summary = {
            "name": player["name"],
            "playerId": player["playerId"],
            "position": player.get("position", "Unknown"),
            "class": player.get("class", "Unknown"),
            "school": player.get("currentTeam", "Unknown"),
            "height": player.get("height", None),
            "weight": player.get("weight", None),
            "nationality": player.get("nationality", "Unknown")
        }
        players_summary.append(summary)
    return players_summary

def create_schools_summary(bios):
    """Create a summary of all schools and their players."""
    schools = {}
    for player in bios:
        school = player.get("currentTeam", "Unknown")
        if school not in schools:
            schools[school] = []
        schools[school].append({
            "name": player["name"],
            "playerId": player["playerId"],
            "position": player.get("position", "Unknown"),
            "class": player.get("class", "Unknown")
        })
    return schools

def main():
    # Define paths
    base_dir = Path("src/data")
    output_dir = base_dir / "processed"
    ensure_directory(output_dir)

    # Load the main JSON file
    main_data = load_json_file(base_dir / "intern_project_data.json")

    # Split and save original arrays
    for key, data in main_data.items():
        output_file = output_dir / f"{key}.json"
        save_json_file(data, output_file)
        print(f"Created {output_file}")

    # Create additional useful files
    if "bio" in main_data:
        # Create players summary
        players_summary = create_players_summary(main_data["bio"])
        save_json_file(players_summary, output_dir / "players_summary.json")
        print("Created players_summary.json")

        # Create schools summary
        schools_summary = create_schools_summary(main_data["bio"])
        save_json_file(schools_summary, output_dir / "schools_summary.json")
        print("Created schools_summary.json")

        # Create positions summary
        positions = {}
        for player in main_data["bio"]:
            position = player.get("position", "Unknown")
            if position not in positions:
                positions[position] = []
            positions[position].append({
                "name": player["name"],
                "playerId": player["playerId"],
                "school": player.get("currentTeam", "Unknown")
            })
        save_json_file(positions, output_dir / "positions_summary.json")
        print("Created positions_summary.json")

if __name__ == "__main__":
    main() 