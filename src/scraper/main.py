import os
import sys
import tempfile
import argparse
import requests
from requests.auth import HTTPBasicAuth
from git import Repo, GitCommandError
import json
import subprocess
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def convert_to_git_url(url):
    """Convert a GitHub repository URL to the .git format."""
    if url.endswith('.git'):
        return url
    return url.rstrip('/') + '.git'

def clone_repo(repo_url):
    """Clone the repository into a temporary directory."""
    git_url = convert_to_git_url(repo_url)
    temp_dir = tempfile.mkdtemp()
    repo_path = os.path.join(temp_dir, 'repo')

    try:
        print(f"Cloning repository from {git_url} into {repo_path}")
        Repo.clone_from(git_url, repo_path)
    except GitCommandError as e:
        print(json.dumps({"error": f"Failed to clone repository: {e}"}))
        sys.exit(1)

    if not os.path.isdir(os.path.join(repo_path, '.git')):
        print(json.dumps({"error": f"The directory {repo_path} is not a valid Git repository."}))
        sys.exit(1)

    print(f"Repository cloned successfully to {repo_path}")
    return repo_path, temp_dir

def get_commit_history(repo_path):
    """Get the commit history from the cloned repository."""
    repo = Repo(repo_path)
    commits = list(repo.iter_commits())
    
    if not commits:
        print(json.dumps({"error": "No commits found in the repository."}))
        return []

    commit_data_list = []
    for commit in commits:
        commit_data = {
            'commit_hash': commit.hexsha,
            'author_name': commit.author.name,
            'author_email': commit.author.email,
            'date': commit.authored_datetime.strftime('%Y-%m-%d %H:%M:%S'),
            'message': commit.message.strip(),
            'files_changed': list(commit.stats.files.keys())
        }
        commit_data_list.append(commit_data)
    
    return commit_data_list

def fetch_sonar_metrics(sonar_host_url, sonar_project_key):
    """Fetch metrics from SonarQube API."""
    url = f"{sonar_host_url}/api/measures/component"
    component = sonar_project_key
    metrics = "coverage,violations,code_smells,bugs,vulnerabilities"
    user = os.getenv('SONAR_USER')
    password = os.getenv('SONAR_PASSWORD')
    
    try:
        response = requests.get(f"{url}?component={component}&metricKeys={metrics}",
                                auth=HTTPBasicAuth(user, password))
        response.raise_for_status()
        metrics_data = response.json()
        print(json.dumps(metrics_data, indent=4))
        return metrics_data
    except requests.exceptions.RequestException as e:
        print(json.dumps({"error": f"Failed to retrieve analysis results: {e}"}))
        sys.exit(1)

def run_sonar_scanner(repo_path):
    """Run SonarQube Scanner on the cloned repository."""
    sonar_host_url = os.getenv('SONAR_HOST_URL')
    sonar_token = os.getenv('SONAR_TOKEN')
    sonar_project_key = os.getenv('SONAR_PROJECT_KEY')
    sonar_project_name = os.getenv('SONAR_PROJECT_NAME')
    sonar_project_version = os.getenv('SONAR_PROJECT_VERSION')

    properties_file = os.path.join(repo_path, 'sonar-project.properties')
    properties_dir = os.path.dirname(properties_file)

    if not os.path.exists(properties_dir):
        os.makedirs(properties_dir)
        print(f"Created directory: {properties_dir}")

    # Path to the SonarQube Scanner executable
    sonar_scanner_path = os.getenv('SONAR_SCANNER_PATH')

    try:
        with open(properties_file, 'w') as f:
            f.write(f"""\
sonar.projectKey={sonar_project_key}
sonar.projectName={sonar_project_name}
sonar.projectVersion={sonar_project_version}
sonar.sources=.
sonar.host.url={sonar_host_url}
sonar.token={sonar_token}
""")
        print(f"sonar-project.properties created successfully at: {properties_file}")
    except IOError as e:
        print(json.dumps({"error": f"Failed to create sonar-project.properties: {e}"}))
        sys.exit(1)

    try:
        result = subprocess.run([sonar_scanner_path, '-Dproject.settings=' + properties_file],
                                cwd=repo_path,
                                check=True,
                                stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE)
        output = result.stdout.decode().strip()
        json_output = {"sonar_scanner_output": output}
        print(json.dumps(json_output))
        
        metrics = fetch_sonar_metrics(sonar_host_url, sonar_project_key)
        return metrics
    except subprocess.CalledProcessError as e:
        error_output = e.stderr.decode().strip()
        print(json.dumps({"error": error_output}))
        sys.exit(1)

def fetch_languages(repo_url):
    """Fetch the languages used in the GitHub repository."""
    # Extract owner and repo name from the URL
    parts = repo_url.rstrip('/').split('/')
    owner, repo_name = parts[-2], parts[-1]
    api_url = f"https://api.github.com/repos/{owner}/{repo_name}/languages"
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        languages = response.json()
        return languages
    except requests.exceptions.RequestException as e:
        print(json.dumps({"error": f"Failed to retrieve languages: {e}"}))
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Analyze a GitHub repository.')
    parser.add_argument('repo_url', type=str, help='URL of the GitHub repository')
    args = parser.parse_args()

    repo_url = args.repo_url
    # Ensure the output file is in the correct directory
    output_file = os.path.join(os.path.dirname(__file__), 'commit_history.json')

    temp_dir = None
    try:
        repo_path, temp_dir = clone_repo(repo_url)
        
        # Run SonarQube scanner and get metrics
        sonar_metrics = run_sonar_scanner(repo_path)
        
        commit_history = get_commit_history(repo_path)
        
        if not commit_history:
            print(json.dumps({"error": "No commit history data to save."}))
            sys.exit(1)

        # Fetch languages used in the repository
        languages = fetch_languages(repo_url)

        # Combine commit history, sonar metrics, and languages
        final_output = {
            "commit_history": commit_history,
            "sonar_metrics": sonar_metrics,
            "languages": languages
        }

        with open(output_file, 'w') as f:
            json.dump(final_output, f, indent=4)
        print(json.dumps(final_output, indent=4))

    finally:
        if temp_dir:
            # Optionally clean up the temporary directory
            # Uncomment the following line if you want to remove the temporary directory
            # shutil.rmtree(temp_dir, ignore_errors=True)
            print(f"Temporary directory: {temp_dir} will be removed automatically.")

if __name__ == '__main__':
    main()
