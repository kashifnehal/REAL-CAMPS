var mongoose  = require("mongoose"),
    campground = require("./models/campground"),
    Comment    = require("./models/comment")


var data = [
    {
        name:"camp 1",
        image:"https://farm4.staticflickr.com/3282/2770447094_2c64348643.jpg",
        description:"this is a camp..Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium, perferendis! Culpa in voluptatem vel ea labore qui esse beatae, consequatur asperiores temporibus quisquam voluptatum incidunt ratione aspernatur modi laborum! Ipsam?"
    },
    {
        name:"camp 1",
        image:"https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
        description:"this is a camp..Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium, perferendis! Culpa in voluptatem vel ea labore qui esse beatae, consequatur asperiores temporibus quisquam voluptatum incidunt ratione aspernatur modi laborum! Ipsam?"
    },
    {
        name:"camp 1",
        image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
        description:"lLorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium, perferendis! Culpa in voluptatem vel ea labore qui esse beatae, consequatur asperiores temporibus quisquam voluptatum incidunt ratione aspernatur modi laborum! Ipsam?"
    }
]

    function seeddb(){
        //Remove all campgrounds
        campground.deleteMany({},function(err){
            if(err){
                console.log(err)
            }else{
                console.log("campground removed")
                //adding a few campgrounds
                data.forEach(function(seed){       //seed is one object
                    campground.create(seed,function(err,campground){
                        if(err){
                            console.log(err)
                        }else{
                            console.log("added campground")
                            //create  a comment
                            Comment.create(
                                {
                                    text:"this is a title of comment",
                                    author:"this is the author"
                                },function(err,comment){
                                    if(err){
                                        console.log(err)
                                    }else{
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("comment created")
                                    }
                                })
                        }
                    })
                })
            }
        })
    }

    module.exports = seeddb;