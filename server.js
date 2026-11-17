var express = require("express");
var cors = require("cors");
var path = require("path");
require("dotenv").config({ path: "./config.env" });
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_PREFIX + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + process.env.MONGODB_URL;
const client = new MongoClient(uri);
const db = client.db("ExtraSchool_DB");

//Dynamically get the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

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

//Get route for lessons
app.get("/lesson", async function (request, response) {
    let collection = await db.collection("lesson");
    let lesson = await collection.find({}).toArray();
    response.send(lesson);
});
//Put route for lessons
app.put("/lesson/:_id", async function (request, response) {
    var body = request.body;
    let collection = await db.collection("lesson");
    let tempid = request.params._id;
    const query = { _id: new ObjectId(tempid) };
    const update = { $set: request.body };
    const result = await collection.updateOne(query, update);
    response.send(result);
    console.log(result);
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

app.listen(PORT, function () {
    console.log("App started on port " + PORT);
});

