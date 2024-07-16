const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send("Hello World!")
})

const userRouter = require("./routes/userRoute");
const itemRouter = require('./routes/itemRoute');
// const showcaseRouter = require('./routes/showcaseRoute');
// const collectionRouter = require('./routes/collectionRoute');
// const seriesRouter = require('./routes/seriesRoute');
// const productRouter = require('./routes/productRoute');


app.use("/users", userRouter);
app.use('/items', itemRouter);
app.use('/showcases', showcaseRouter);
// app.use('/collections', collectionRouter);
// app.use('/series', seriesRouter);
// app.use('/products', productRouter);

module.exports = app;