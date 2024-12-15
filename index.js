import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://byabbe.se/on-this-day";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

app.get("/", async (_, res) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    const response = await axios(`${API_URL}/${month}/${date}/events.json`);
    const events = response.data.events;

    if (!events)
      return res.render("index.ejs", { error: "404 No Events for Tod  ay" });

    const years = events.reduce((accumulator, event) => {
      accumulator.push(event.year);
      return accumulator;
    }, []);

    return res.render("index.ejs", {
      events,
      years: [...new Set(years)],
      type: "events",
      month,
      date,
      filterYear: "",
    });
  } catch (error) {
    console.log(error);
    return res.render("index.ejs", { error: error.message });
  }
});

app.get("/get-events/:type", async (req, res) => {
  try {
    const { month, date, filterYear } = req.query;
    const { type } = req.params;

    if (!month || !date || !type) {
      return res.render("index.ejs", { error: "Missing Data" });
    }

    const response = await axios(`${API_URL}/${month}/${date}/${type}.json`);
    const events = response.data[type];
    let filterEvents;

    if (!events)
      return res.render("index.ejs", { error: "404 No Events on that Day" });

    if (filterYear) {
      filterEvents = events.filter((event) => event.year === filterYear);
    } else {
      filterEvents = events;
    }
    
    const years = events.reduce((accumulator, event) => {
      accumulator.push(event.year);
      return accumulator;
    }, []);

    return res.render("index.ejs", {
      events: filterEvents,
      years: [...new Set(years)],
      type,
      month,
      date,
      filterYear,
    });
  } catch (error) {
    console.log(error);
    return res.render("index.ejs", { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
