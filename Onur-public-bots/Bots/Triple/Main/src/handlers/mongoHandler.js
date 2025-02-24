const mongoose = require("mongoose");
const config = require("../../../../../config.json");

mongoose.set("strictQuery", true);

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Database bağlantısı tamamlandı!");
});

mongoose.connection.on("error", (err) => {
  console.error("[HATA] Database bağlantısı kurulamadı!", err);
});

const voteSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const Vote = mongoose.model("Vote", voteSchema);

module.exports = { Vote };
