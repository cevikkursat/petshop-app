require("dotenv").config();
const runApp = require("./app/express.js");
const connnect = require("./db/connectDB.js");
connnect();

const app = runApp();

app.listen(process.env.PORT || 5000, () => console.log(`${process.env.PORT || 5000} Portu Dinleniyor!`));
