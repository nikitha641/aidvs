const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 💡 Database Configuration
const dbConfig = {
    host: "localhost",
    port: 3306,
    user: "nikitha",
    password: "123456789",
    database: "aidvs",
};

let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error("Database Connection Error:", err);
            setTimeout(handleDisconnect, 2000); // Try reconnect after 2s
        } else {
            console.log("Connected to MySQL database ✅");
        }
    });

    db.on("error", (err) => {
        console.error("Database Error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST" || err.fatal) {
            console.log("Reconnecting to MySQL...");
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect(); // Start initial connection

// 🔍 API Endpoint
app.post("/ask", (req, res) => {
    if (!req.body || !req.body.question) {
        return res.status(400).json({ error: "Invalid request: Question is missing" });
    }

    const userInput = req.body.question.trim();
    console.log("User input:", userInput);

    const query = `
        SELECT solution, Real_Time_Example, severity_level
        FROM questions
        WHERE problem = ?
        LIMIT 1;
    `;

    db.query(query, [userInput], (error, results) => {
        if (error) {
            console.error("Database Query Error:", error);
            return res.status(500).send("Database query error");
        }

        console.log("Query Results:", results);

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({
                solution: "No response available",
                Real_Time_Example: "N/A",
                severity_level: "unknown",
            });
        }
    });
});

// 🚀 Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
