const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const textSchema = require("./models");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();

// middlewares
mongoose.set("strictQuery", false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// database connection
async function ConnectToMongoDb() {
  try {
    const res = await mongoose
      .connect(process.env.URI)
      .then((res) => {
        console.log("Database Connected..!", res.connection.host);
      })
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

ConnectToMongoDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Started : ${PORT}`);
  });
});

app.get("/emoji", async (req, res) => {
  const { emojis, pass } = req.query;
  console.log(emojis, pass);

  // // emojis to text
  let emojisText = "";
  let str = emojis.split(" ");

  str.forEach((element) => {
    emojisText += `&#${element.codePointAt(0)} `;
  });

  try {
    await textSchema
      .find({ emoji: emojisText, pass: pass })
      .then((data) => {
        return res.json({ message: "success", data: data });
      })
      .catch((err) => {
        return res.json({ message: "Try again" });
      });
  } catch (error) {
    return res.json({ error: error });
  }
});

// add the text for the emojis
app.post("/", function (req, res) {
  const { text, pass } = req.body;
  console.log(req.body);

  // create the emojis from the texts
  let emojis = "";
  let str = text.split("");
  str.forEach((element) => {
    emojis += `&#128${element.charCodeAt()} `;
  });

  try {
    const txt = new textSchema({
      text: text,
      pass: pass,
      emoji: emojis,
    });

    txt.save().then((val) => {
      return res.json({ msg: "Data Added Successfully", emojis: val.emoji });
    });
  } catch (error) {
    return res.json({ error: error });
  }
});
