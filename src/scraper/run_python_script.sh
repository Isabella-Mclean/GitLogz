# Path to your virtual environment and Python script
VENV_PATH="/app/src/scraper/.venv/bin/activate"
PYTHON_SCRIPT_PATH="/app/src/scraper/main.py"
REPO_URL="$1"

# Activate the virtual environment and run the Python script
source "$VENV_PATH" && python "$PYTHON_SCRIPT_PATH" "$REPO_URL"
