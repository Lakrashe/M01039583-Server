var express = require("express");
var cors = require("cors");
var path = require("path");
require("dotenv").config({ path: "./config.env" });
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_PREFIX + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + process.env.MONGODB_URL;
const client = new MongoClient(uri);
const db = client.db("ExtraSchool_DB");

var app = express();
app.use(express.json());
app.use(cors());

app.use(function (request, response, next) {
    console.log("Income " + request.method + " request at " + request.url);
    next();
});

//Connections to mongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client;

    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}
connectToMongoDB();

app.get("/lesson", async function (request, response) {
    let collection = await db.collection("lesson");
    let lesson = await collection.find({}).toArray();
    response.send(lesson);
});

//Post route for orders
app.post("/orders", async function (request, response) {
    const { order , cart } = request.body;
    let collection = await db.collection("orders");
    let result = await collection.insertOne({ order, cart });
    response.send(result);
});
//Get orders 
app.get("/orders", async function (request, response) {
    let collection = await db.collection("orders");
    let orders = await collection.find({}).toArray();
    response.send(orders);
})

var publicPath = path.resolve(__dirname, "./img");
//Send static files from directory to server
app.use("/images", express.static(publicPath));
//Handle error for static file
app.use("/images", function (request, response) {
    response.status(404).send("Image not found!");
});

//Handle unrecognized request
app.use(function (request, response) {
    response.status(404).json({ error: "Request Not found" });
})

app.listen(3000, function () {
    console.log("App started on port 3000");
});

