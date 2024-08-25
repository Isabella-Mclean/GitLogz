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

async function insertOrUpdateCommitGroup(repositoryUrl, commits) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO commit_groups (repository_url, commits)
       VALUES ($1, $2)
       ON CONFLICT (repository_url) DO UPDATE
       SET commits = EXCLUDED.commits,
           analyzed_at = CURRENT_TIMESTAMP`,
      [repositoryUrl, JSON.stringify(commits)]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database insert/update error:", error);
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

  // Path to the shell script
  const shellScriptPath = path.join(
    __dirname,
    "..",
    "scraper",
    "run_python_script.sh"
  );

  // Command to run the shell script with the repository URL
  const command = `bash ${shellScriptPath} ${escapedUrl}`;

  console.log(`Running command: ${command}`);

  // Run the Python script within the virtual environment using the shell script
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

    // Path to the commit history JSON file
    const commitHistoryPath = path.join(
      __dirname,
      "..",
      "scraper",
      "commit_history.json"
    );

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

        // Insert or update the group of commits in PostgreSQL
        try {
          await insertOrUpdateCommitGroup(url, commitHistory);
          res.json({
            message:
              "Commit history successfully inserted/updated in the database",
            data: commitHistory,
          });
        } catch (dbError) {
          res.status(500).json({
            error: "Error inserting/updating commit history in the database",
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
