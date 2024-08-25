# Use a base image with necessary tools
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    curl \
    unzip \
    openjdk-17-jdk \
    python3 \
    python3-venv \
    python3-pip \
    nodejs \
    npm \
    bash

# Install SonarQube Scanner
RUN mkdir -p /opt/sonar-scanner && \
    curl -L https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip -o /opt/sonar-scanner/sonar-scanner.zip && \
    unzip /opt/sonar-scanner/sonar-scanner.zip -d /opt/sonar-scanner && \
    rm /opt/sonar-scanner/sonar-scanner.zip

# Set environment variables for SonarQube Scanner
ENV SONAR_SCANNER_HOME=/opt/sonar-scanner/sonar-scanner-4.8.0.2856-linux
ENV PATH=$PATH:$SONAR_SCANNER_HOME/bin
ENV SONAR_SCANNER_PATH=$SONAR_SCANNER_HOME/bin/sonar-scanner

# Set the working directory
WORKDIR /app

# Copy the package.json and install Node.js dependencies
COPY package.json ./
RUN npm install

# Copy the rest of your application files to /app
COPY . .

# Set up Python environment
WORKDIR /app/src/scraper
RUN python3 -m venv .venv && \
    . .venv/bin/activate && \
    pip install -r requirements.txt

# Ensure SonarQube Scanner is in the `lib` directory
RUN mkdir -p /app/src/scraper/lib && \
    cp -r /opt/sonar-scanner/sonar-scanner-4.8.0.2856-linux /app/src/scraper/lib/sonar-scanner

# Set the working directory back to /app
WORKDIR /app

# Expose the necessary port (adjust if needed)
EXPOSE 3000

# Set environment variables from `.env`
COPY .env .env
RUN export $(grep -v '^#' .env | xargs)

# Start the server
CMD ["node", "src/index.js"]
