const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "64139cc148008318561dc320",
  };

  next();
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
app.use(express.json());
app.use("/", userRouter);
