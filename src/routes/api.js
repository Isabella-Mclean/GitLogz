const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const pool = require("../db/config"); // Import your PostgreSQL connection pool

// Function to execute a command
function runCommand(command, callback) {
  exec(command, { shell: true }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return callback(error, stdout, stderr);
    }
    callback(null, stdout, stderr);
  });
}

// Helper function to insert commit data into PostgreSQL
async function insertCommits(commits) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const commit of commits) {
      await client.query(
        `INSERT INTO commits (commit_hash, author_name, author_email, date, message, files_changed)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          commit.commit_hash,
          commit.author_name,
          commit.author_email,
          commit.date,
          commit.message,
          JSON.stringify(commit.files_changed),
        ]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database insert error:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Endpoint to analyze repository
router.post("/analyze", async (req, res) => {
  const { url } = req.body;

  // Validate the URL format
  const githubUrlPattern =
    /^(https:\/\/github\.com\/[\w-]+\/[\w-]+(\.git)?)|(git@github\.com:[\w-]+\/[\w-]+\.git)$/;

  if (!githubUrlPattern.test(url)) {
    return res.status(400).json({ error: "Invalid GitHub repository URL" });
  }

  // Escape special characters in the URL to prevent issues in the shell command
  const escapedUrl = url.replace(/"/g, '\\"');

  // Path to your Python script and virtual environment
  const pythonScriptPath = path.join(__dirname, "..", "scraper", "main.py");
  const venvPath = path.join(
    __dirname,
    "..",
    "scraper",
    ".venv",
    "Scripts",
    "activate.bat"
  );

  // Path to the commit history JSON file
  const commitHistoryPath = path.join(
    __dirname,
    "..",
    "scraper",
    "commit_history.json"
  );

  // Command to activate virtual environment and run the Python script
  const command = `cmd.exe /c "${venvPath} && python ${pythonScriptPath} ${escapedUrl}"`;

  console.log(`Running command: ${command}`);

  // Run the Python script within the virtual environment
  runCommand(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      console.error(`stderr: ${stderr}`);
      return res
        .status(500)
        .json({ error: stderr || "Error executing the Python script" });
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    // Check if commit_history.json exists and read it
    if (fs.existsSync(commitHistoryPath)) {
      try {
        const commitHistory = JSON.parse(
          fs.readFileSync(commitHistoryPath, "utf8")
        );

        if (commitHistory.length === 0) {
          return res.status(500).json({
            error: "commit_history.json file was created but is empty",
          });
        }

        // Insert commits into PostgreSQL
        try {
          await insertCommits(commitHistory);
          res.json({
            message: "Commit history successfully inserted into the database",
            data: commitHistory,
          });
        } catch (dbError) {
          res.status(500).json({
            error: "Error inserting commit history into the database",
            details: dbError.message,
          });
        }
      } catch (parseError) {
        console.error(`Parsing error: ${parseError.message}`);
        res.status(500).json({
          error: "Error parsing the commit history JSON",
          details: parseError.message,
        });
      }
    } else {
      // Create an empty JSON file if it doesn't exist
      try {
        fs.writeFileSync(commitHistoryPath, JSON.stringify([]));
        res
          .status(500)
          .json({ error: "commit_history.json file was created but is empty" });
      } catch (fileError) {
        console.error(`File creation error: ${fileError.message}`);
        res
          .status(500)
          .json({ error: "Error creating commit_history.json file" });
      }
    }
  });
});

module.exports = router;
