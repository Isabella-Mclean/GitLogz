import os
import tempfile
from git import Repo
import json


def clone_repo(repo_url):
    # Create a temporary directory to clone the repository
    temp_dir = tempfile.TemporaryDirectory()
    repo_path = os.path.join(temp_dir.name, 'repo')
    print(f"Cloning repository into temporary directory {repo_path}")
    Repo.clone_from(repo_url, repo_path)
    return repo_path, temp_dir


def get_commit_history(repo_path):
    repo = Repo(repo_path)
    commits = []

    for commit in repo.iter_commits():
        commit_data = {
            'commit_hash': commit.hexsha,
            'author_name': commit.author.name,
            'author_email': commit.author.email,
            'date': commit.authored_datetime.strftime('%Y-%m-%d %H:%M:%S'),
            'message': commit.message.strip(),
            'files_changed': list(commit.stats.files.keys())
        }
        commits.append(commit_data)

    return commits


def main():
    # URL of the open-source repository you want to analyze
    repo_url = 'https://github.com/QuivrHQ/quivr.git'
    output_file = 'commit_history.json'

    # Clone the repository into a temporary directory
    repo_path, temp_dir = clone_repo(repo_url)

    try:
        # Collect commit history
        commit_history = get_commit_history(repo_path)

        # Save commit history to a JSON file
        with open(output_file, 'w') as f:
            json.dump(commit_history, f, indent=4)
        print(f"Commit history saved to {output_file}")

    finally:
        # Cleanup the temporary directory
        temp_dir.cleanup()


if __name__ == '__main__':
    main()
