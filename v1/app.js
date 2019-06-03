var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser")

app.use(bodyparser.urlencoded({extended: true}));

// app.use(express.static("public"));
app.set("view engine","ejs");
var campgrounds = [
    {name: "camp1", image:"https://s3-media4.fl.yelpcdn.com/bphoto/vfiVtX9r8kkK8aS-wAEgIg/ls.jpg"},
    {name: "camp2", image:"https://s3-media4.fl.yelpcdn.com/bphoto/PDQMnVPDK1QfQfZjwYI9eQ/ls.jpg"},
    {name: "camp3", image:"https://s3-media3.fl.yelpcdn.com/bphoto/4rFTNElcBfCYE2szMpR3bA/ls.jpg"},   
    {name: "camp4", image:"https://s3-media3.fl.yelpcdn.com/bphoto/4rFTNElcBfCYE2szMpR3bA/ls.jpg"}, 
    {name: "camp5", image:"https://s3-media3.fl.yelpcdn.com/bphoto/4rFTNElcBfCYE2szMpR3bA/ls.jpg"},
    {name: "camp7", image:"https://s3-media4.fl.yelpcdn.com/bphoto/PDQMnVPDK1QfQfZjwYI9eQ/ls.jpg"},   
    {name: "camp8", image:"https://s3-media4.fl.yelpcdn.com/bphoto/PDQMnVPDK1QfQfZjwYI9eQ/ls.jpg"}  
];


app.get("/",function(req,res)
{
    res.render("landing");
    
});

app.get("/campgrounds",function(req,res)
{    
    res.render("campgrounds",{campgrounds: campgrounds});
});

app.post("/campgrounds",function(req,res)
{
    var name = req.body.name;
    var image = req.body.image;
    var newcamp = {name:name , image:image};
    campgrounds.push(newcamp);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res)
{    
    res.render("new");
});

app.listen(3000,function()
{
    console.log("port started")
});