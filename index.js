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

let query;
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
  db.connect();

  query = await db.query("SELECT country_code FROM visited_countries");
  
  let countries = [];

  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });

  res.render("index.ejs", { countries: countries, total: countries.length });

  db.end();
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
