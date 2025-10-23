const express = require("express");
const mysql2 = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection (Aiven credentials stored in .env)
const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false } // needed for Aiven’s SSL requirement
});

db.connect((err) => {
    if (err) {
        console.error('DB connection error:', err);
    } else {
        console.log('✅ Connected to MySQL (Aiven)');

        // 2. Create table if it doesn't exist
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            business_name VARCHAR(255) NOT NULL,
            business_website VARCHAR(255),
            country VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) console.error('Table creation error:', err);
            else console.log('✅ Table ready');
        });
    }
});
// Routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.get("/form", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "form.html"))
);

app.post("/submit", (req, res) => {
  const { name, email, phone, business_name, business_website, country, message } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+\d{1,4}\s?\d{7,15}$/;
  const urlRegex = /^(https?:\/\/)?([\w\d\-]+\.)+[\w]{2,}(\/.*)?$/;

  if (!emailRegex.test(email)) return res.status(400).send("Invalid email format");
  if (!phoneRegex.test(phone)) return res.status(400).send("Invalid phone number with country code");
  if (business_website && !urlRegex.test(business_website))
    return res.status(400).send("Invalid website URL");

  const query = `
    INSERT INTO contacts
    (name, email, phone, business_name, business_website, country, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, email, phone, business_name, business_website, country, message], (err) => {
    if (err) {
      console.error("❌ Insert error:", err);
      res.status(500).send("Error saving data");
    } else res.send("Saved successfully ✅");
  });
});

// Dynamic port for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
