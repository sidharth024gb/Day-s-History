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
    const date = new Date();
    const response = await axios(
      `${API_URL}/${date.getMonth() + 1}/${date.getDate()}/events.json`
    );
    const events = response.data.events;
    const years = events.reduce((accumulator, event) => {
      accumulator.push(event.year);
      return accumulator;
    }, []);

    res.render("index.ejs", { events, years });
  } catch (error) {
    console.log(error);
    res.render("index.ejs", { error: error.message });
  }
});

app.post("/get-events/:type", async (req, res) => {
  try {
    const { month, date } = req.body;
    const { type } = req.params;

    const response = await axios(`${API_URL}/${month}/${date}/${type}.json`);
    const events = response.data.events;
    const years = events.reduce((accumulator, event) => {
      accumulator.push(event.year);
      return accumulator;
    }, []);

    res.render("index.ejs", { events, years });
  } catch (error) {
    console.log(error);
    res.render("index.ejs", { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
