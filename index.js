import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1453",
  port: 5432,
})
db.connect();

let visitedList;
let countries = [];

// db.query("SELECT COUNT(*) FROM visited_countries", (err, res) => {
//   db.connect();
//   if (err) {
//     console.error("Error executing query.", err.stack);
//   } else {
//     total = res.rows;
//   }
//   db.end();
// })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.

  visitedList = await db.query("SELECT country_code FROM visited_countries");
  
  let countries = [];

  visitedList.rows.forEach((country) => {
    countries.push(country.country_code);
  });

  res.render("index.ejs", { countries: countries, total: countries.length });

});

app.post("/add", async (req, res) => {
  let newCountry = req.body["country"];
  
  let newCode = await db.query(
    "SELECT country_code FROM countries WHERE country_name = $1",
    [newCountry]
  );


    let pushCode = newCode.rows[0].country_code;

    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",
    [pushCode]);

    res.redirect("/");
  
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
