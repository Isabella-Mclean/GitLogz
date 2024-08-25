# Developer Guide

I (**Waseef**) have created this small guide for the team to understand and use the backend.

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)

## Introduction
GitLogz is a project aimed at simplifying the process of retrieving and analyzing Git commit logs. It provides a user-friendly interface and powerful features to help developers gain insights into their Git repositories.

## Prerequisites
Before you can start using GitLogz, make sure you have the following prerequisites installed on your system:
- Git: [Download and install Git](https://git-scm.com/downloads)
- Node.js: [Download and install Node.js](https://nodejs.org)

## Installation
To install GitLogz, follow these steps:
1. Clone the GitLogz repository: `git clone https://github.com/your-username/GitLogz.git`
2. Navigate to the project directory: `cd GitLogz`
3. Install the dependencies: `npm install`
4. Populate the `.env` file with the necessary info for Postgres:
    ```
    PORT=example_port
    DB_USER=example_user
    DB_HOST=example_host
    DB_DATABASE_NAME=example_database
    DB_PASSWORD=example_password
    DB_PORT=example_port
    ```


### Python Virtual Environment
1. Navigate to the `/src/scraper/` directory of the GitLogz project.
2. Run the command: `python -m venv .venv`
3. Activate the virtual environment:
    - On Windows: `venv\Scripts\activate`
    - On macOS and Linux: `source venv/bin/activate`
4. Install the packages `pip install -r requirements.txt`
5. Populate the .env file with necessary info:
    ```
    SONAR_PROJECT_KEY=example-project-key
    SONAR_PROJECT_NAME=example-project-name
    SONAR_HOST_URL=http://example.com:9000
    SONAR_TOKEN=example-token
    SONAR_PROJECT_VERSION=1.0
    SONAR_SCANNER_PATH=/path/to/sonar-scanner
    ```

### Postgres Setup
I'll have to ask you to figure out how to set up Postgres locally on your machine. For the table schema, this is what I have set:
```sql
CREATE TABLE commit_groups (
    id SERIAL PRIMARY KEY,
    repository_url TEXT NOT NULL,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commits JSONB NOT NULL
);
```

## Usage
To use GitLogz, follow these steps:
1. Make sure you have SonarQube running on your machine, I have it running on `http://localhost:9000`. Check the [Installation Docs](https://docs.sonarsource.com/sonarqube/latest/setup-and-upgrade/install-the-server/introduction/) to install SonarQube on your machine.
2. Open a terminal and navigate to the project directory.
3. If you have `nodemon` installed, run the command: `npm run dev`
4. I (**Waseef**) have only done the backend so I've used [Postman](https://www.postman.com) with a body containing just the `url`, i.e. github repository link.
    ```
    http://localhost:5000/api/analyze
    ```
5. Follow the on-screen instructions to connect to your Git repository and start analyzing commit logs.
<hr>

### END OF FILE
