var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    localstratergy =require("passport-local"),
    comment    = require("./models/comment"),
    user       = require("./models/user"),
    campground = require("./models/campground"),
    seeddb     =require("./seed")


mongoose.connect("mongodb://localhost:27017/yelpcamp_v6", { useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
seeddb();

app.use(require("express-session")({
    secret:"once again rusty is best",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentuser = req.user;
    next();
})


app.get("/",function(req,res)
{
    res.render("landing");
});

app.get("/campgrounds",function(req,res)
{    
    console.log(req.user);
    //Get all campgrounds from DB
    campground.find({},function(err,allcampgrounds){
        if(err){
            console.log("error hai");   
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds: allcampgrounds});                
        }
    // res.render("campgrounds",{campgrounds: campgrounds});

    });
});

app.post("/campgrounds",function(req,res)
{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newcamp = {name:name , image:image, description:desc};
    // campgrounds.push(newcamp);
    //using database
    campground.create(newcamp,function(err,cats){
        if(err){
            console.log("error hai");
            console.log(err);
        }else{
            //redirecting to campgrounds
            res.redirect("/campgrounds");
        }
    })

    // res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res)
{    
    res.render("campgrounds/new");
});

//SHOW==
// foundcampground is whatever we find with id
app.get("/campgrounds/:id",function(req,res)
{    
    campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if (err){
            console.log("there is an error");
        }else{
            res.render("campgrounds/show",{campground:foundcampground});

        }
    })
    
});

//===============================================
//COMMENTS ROUTES
//===============================================

app.get("/campgrounds/:id/comments/new",isloggedin,function(req,res){
    //find campground using id
    campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{campground:campground})
        }
    })
})

app.post("/campgrounds/:id/comments",isloggedin,function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else{
            comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+ campground._id);
                }
                
            })
        }
    })
})
//============================
//AUTH ROUTES
//============================

//show sign up form
app.get("/register",function(req,res){
    res.render("register")
})

// handling user sign up
app.post("/register",function(req,res){
    req.body.username;
    req.body.password;
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate('local')(req,res, function(){
            res.redirect("/campgrounds");
        })
    })
})

//LOGIN ROUTES
//render login form
app.get("/login",function(req,res){
    res.render("login")
})
//LOGIN logic
// Middleware
app.post("/login", passport.authenticate("local",{    //this is called Middleware
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req,res){
});

//Logout
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/campgrounds");
})

function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

app.listen(3000,function()
{
    console.log("port started")
});