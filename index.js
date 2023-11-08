import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1453", // constantinople
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

async function checkVisited() {
  const visitedList = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];

  visitedList.rows.forEach((country) => {
    countries.push(country.country_code);
  });

  return countries;
}

app.get("/", async (req, res) => {
  let countries = await checkVisited();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.post("/add", async (req, res) => {
  const newCountry = req.body["country"];
  
  try {
    let newCode = await db.query(
      "SELECT country_code FROM countries WHERE country_name = $1",
      [newCountry]
    );
    let pushCode = newCode.rows[0].country_code;
    
    try {
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",
      [pushCode]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisited();
      res.render("index.ejs", { countries: countries, total: countries.length, error: "Country already added; try again." });
    }

  } catch (err) {
    console.log(err);
    const countries = await checkVisited();
    res.render("index.ejs", { countries: countries, total: countries.length, error: "Country does not exist; try again." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
