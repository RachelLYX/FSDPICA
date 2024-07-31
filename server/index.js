const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL
}));



app.get("/", (req, res) => {
    res.send("Let's save the earth!");
});

const programRoute = require('./routes/programs');
app.use("/programs", programRoute);

const volunteeringRoute = require('./routes/volunteering');
app.use("/volunteering", volunteeringRoute);

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });