var express = require("express");

var cors = require("cors");
var app = express();

app.use(cors());

app.use(function (request, response) {
    console.log("In comes a request to:  " + request.url);
    response.json(lesson);
});

let lesson = [
    { id: 1, subject: "Math", location: "Hendon", price: "100£", availabilty: 5, img: "images/mathimg.png" },
    { id: 2, subject: "English", location: "Wembley", price: "150£", availabilty: 5, img: "images/English.png" },
    { id: 3, subject: "Art", location: "Camden", price: "30£", availabilty: 5, img: "images/Art.png" },
];

app.listen(3000, function () {
    console.log("App started on port 3000");
});

