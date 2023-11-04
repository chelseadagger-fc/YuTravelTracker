import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "1234",
  port: 5432,
})

let visitedCountries;
let numCountries;

db.query("SELECT country_code FROM visited_countries", (err, res) => {
  db.connect();
  if (err) {
    console.error("Error executing query.", err.stack);
  } else {
    visitedCountries = res.rows;
  }
  db.end();
})

db.query("SELECT COUNT(*) FROM visited_countries", (err, res) => {
  db.connect();
  if (err) {
    console.error("Error executing query.", err.stack);
  } else {
    numCountries = res.rows;
  }
  db.end();
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.

  res.render("index.ejs", { numCountries : total })
});











app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
