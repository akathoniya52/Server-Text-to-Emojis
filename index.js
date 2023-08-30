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

// get the data from the database
app.get("/", async (req, res) => {
  const { emoji, pass } = req.body;
  console.log(emoji);

  // emojis to text
  let emojisText = "";
  let str = emoji.split(" ");

  str.forEach((element) => {
    console.log("Elements ", element);
    emojisText += `&#${element.codePointAt(0)} `;
    console.log(emojisText);
  });

  const data = await textSchema
    .find({ emoji: emojisText } && { pass: pass })
    .then((data) => {
      // console.log(data);
      return res.json({ message: "success", txt: data[0].text });
    })
    .catch((err) => {
      // console.log(err);
      return res.json({ message: "Try again" });
    });
});

// add the text for the emojis
app.post("/", function (req, res) {
  const { text, pass } = req.body;

  // create the emojis from the texts
  let emojis = "";
  let str = text.split("");
  str.forEach((element) => {
    emojis += `&#128${element.charCodeAt()} `;
  });

  // console.log(str);
  const txt = new textSchema({
    text: text,
    pass: pass,
    emoji: emojis,
  });

  txt.save().then((val) => {
    // console.log(val.emoji);
    res.json({ msg: "Data Added Successfully", emojis: val.emoji });
  });
});
