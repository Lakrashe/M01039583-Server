var express = require("express");
var cors = require("cors");
var path = require("path");


var app = express();
app.use(express.json());
app.use(cors());

app.use(function (request, response, next) {
    console.log("Income " + request.method + " request at " + request.url);
    next();
});

let lesson = [
    { id: 1, subject: "Math", location: "Hendon", price: "100", availabilty: 5, img: "images/mathimg.png" },
    { id: 2, subject: "English", location: "Wembley", price: "150", availabilty: 5, img: "images/English.png" },
    { id: 3, subject: "Art", location: "Camden", price: "30", availabilty: 5, img: "images/Art.png" },
];

app.get("/lesson", function (request, response) {
    response.json(lesson);
});

let orders = [];
//Post route for orders
app.post("/orders", function (request, response) {
    var body = request.body;
    orders.push(body);
    const cart = request.body.cart
    console.log("Order received" + "\n Name: " + body.order.firstName + "\n Last Name: " + body.order.lastName + "\n Phone: " + body.order.phone);
    //For loop to extract the data from the cart array
    cart.forEach(function (item) {
        console.log(" ID: " + item.id + " | Subject: " + item.subject + " | Price: " + item.price);
    });
    response.json({message:"Order received!"});
});
//Get orders 
app.get("/orders", function(request,response) {
    response.json(orders);
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

