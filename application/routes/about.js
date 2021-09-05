const express = require('express');
const router = express.Router();

const options = {
    "Adele": 0, 
    "Jeff": 1, 
    "Kris": 2, 
    "Jeffrey": 3,
    "Eddy": 4,
    "Jose": 5 
};

const person = [
    {
        first_name:"Adele",
        last_name: "Wu",
        image: "/developer_pics/adele.JPEG",
        github: "adele-wu",
        github_link: 'https://github.com/Adele-Wu',
        information: "Adele Wu is a senior at San Francisco State University studying Computer Science. Summer 2021, Adele worked as a QA Engineer at Zwift. Prior to SFSU, Adele recieved a degree in Mathematics from Skyline College. During her time at Skyline, Adele was an Engineering and Tech Scholar (ETS) and National Science Foundation (NSF) scholar. Adele interned with Strategic Energy Innovations (SEI) to develop a car counter prototype to track availablity of parking lots at Skyline College. Additionally, Adele worked as a bobarista at a family-owned boba shop."
    },
    {
        first_name : "Jeff",
        last_name:  "Fulmer Gardner",
        image: "/developer_pics/jeff.JPEG",
        github: "JeffreyFG",
        github_link: 'https://github.com/JeffreyFG',
        information: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras molestie felis dui, suscipit commodo ligula egestas ac. In sit amet magna vel est ullamcorper commodo sit amet non nulla. Nunc vulputate orci mauris, a aliquam ligula commodo et. Suspendisse potenti. Vestibulum in condimentum felis. Sed semper leo in neque elementum fringilla. Maecenas elementum ornare ipsum placerat mattis. Maecenas non porta arcu, eget suscipit felis. Aenean nec eros quis nisi pretium viverra. Quisque a rhoncus quam. "
    },
    {
        first_name : "Kris",
        last_name: "Byington",
        image: "/developer_pics/kris.jpg",
        github: "krisbyington",
        github_link: 'https://github.com/krisbyington',
        information: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras molestie felis dui, suscipit commodo ligula egestas ac. In sit amet magna vel est ullamcorper commodo sit amet non nulla. Nunc vulputate orci mauris, a aliquam ligula commodo et. Suspendisse potenti. Vestibulum in condimentum felis. Sed semper leo in neque elementum fringilla. Maecenas elementum ornare ipsum placerat mattis. Maecenas non porta arcu, eget suscipit felis. Aenean nec eros quis nisi pretium viverra. Quisque a rhoncus quam. "
    },
    {
        first_name : "Jeffrey",
        last_name: "Friedrich",
        image: "/developer_pics/jeffrey.png",
        github: "jeffreyfriedrich",
        github_link: 'https://github.com/JeffreyFriedrich',
        information: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras molestie felis dui, suscipit commodo ligula egestas ac. In sit amet magna vel est ullamcorper commodo sit amet non nulla. Nunc vulputate orci mauris, a aliquam ligula commodo et. Suspendisse potenti. Vestibulum in condimentum felis. Sed semper leo in neque elementum fringilla. Maecenas elementum ornare ipsum placerat mattis. Maecenas non porta arcu, eget suscipit felis. Aenean nec eros quis nisi pretium viverra. Quisque a rhoncus quam. "
    },
    {
        first_name : "Eddy",
        last_name : "Yun",
        image: "Smiley_Face.JPG",
        github: "eyun1988",
        github_link: 'https://github.com/eyun1988',
        information: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras molestie felis dui, suscipit commodo ligula egestas ac. In sit amet magna vel est ullamcorper commodo sit amet non nulla. Nunc vulputate orci mauris, a aliquam ligula commodo et. Suspendisse potenti. Vestibulum in condimentum felis. Sed semper leo in neque elementum fringilla. Maecenas elementum ornare ipsum placerat mattis. Maecenas non porta arcu, eget suscipit felis. Aenean nec eros quis nisi pretium viverra. Quisque a rhoncus quam. "
    },
    {
        first_name : "Jose",
        last_name : "Quintero",
        image: "/developer_pics/jose.jpg",
        github: "jaq19",
        github_link: 'https://github.com/jaq19',
        information: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras molestie felis dui, suscipit commodo ligula egestas ac. In sit amet magna vel est ullamcorper commodo sit amet non nulla. Nunc vulputate orci mauris, a aliquam ligula commodo et. Suspendisse potenti. Vestibulum in condimentum felis. Sed semper leo in neque elementum fringilla. Maecenas elementum ornare ipsum placerat mattis. Maecenas non porta arcu, eget suscipit felis. Aenean nec eros quis nisi pretium viverra. Quisque a rhoncus quam. "
    }
];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.locals.logged = true;
    res.render('about_us', { title: "About Page", person }); // can only pass an array
});

// route to page based on client choice
router.get('/:person', function(req, res, next) {
    // :person is the first name and is store into first_name // look at the href in about.hbs
    const first_name = req.params.person;
    // then we map through the options 
    if(first_name in options) 
        return res.render('about_me', {title: first_name, person: person[options[first_name]]});
    return res.redirect("/about")
});

module.exports = router;
