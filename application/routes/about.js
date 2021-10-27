/**************************************************************
 * Class: CSC-648-02 Fall 2021
 * Name: Edward Yun, Jeffrey Fullmer Gradner, Adele Wu, Jeff Friedrich,
 *  Kris Byington, Jose Quinteros
 * Project: 648 Final Project
 *
 * File: about.js
 *
 * Description: About us page that serves a static object.
 **************************************************************/
const express = require("express");
const router = express.Router();

// Creating a look up table to find the index of our team member via name
const options = {
  Adele: 0,
  Jeff: 1,
  Kris: 2,
  Jeffrey: 3,
  Eddy: 4,
  Jose: 5,
};

const person = [
  {
    first_name: "Adele",
    last_name: "Wu",
    image: "developer_pics/adele.JPEG",
    github: "adele-wu",
    github_link: "https://github.com/Adele-Wu",
    role: "Front-end Lead",
    information:
      "Adele Wu is a senior at San Francisco State University studying Computer Science. Summer 2021, Adele worked as a QA Engineer at Zwift. Prior to SFSU, Adele recieved a degree in Mathematics from Skyline College. During her time at Skyline, Adele was an Engineering and Tech Scholar (ETS) and National Science Foundation (NSF) scholar. Adele interned with Strategic Energy Innovations (SEI) to develop a car counter prototype to track availablity of parking lots at Skyline College. Additionally, Adele worked as a bobarista at a family-owned boba shop.",
  },
  {
    first_name: "Jeff",
    last_name: "Fulmer Gardner",
    image: "/developer_pics/jeff.png",
    github: "JeffreyFG",
    github_link: "https://github.com/JeffreyFG",
    role: "Team Lead / Github Master",
    information:
      "Hey my name is Jeff I am a senior Student at SFSU. I am currently a TA and a grader .  I love programing , biking, and working on my car.",
  },
  {
    first_name: "Kris",
    last_name: "Byington",
    image: "/developer_pics/kris.jpg",
    github: "krisbyington",
    github_link: "https://github.com/krisbyington",
    role: "Database",
    information:
      "Kris Byington is a Junior at San Francisco State University studying Computer Science with plans to be a Software devoloper after graduating in late 2022. He is a fitness and outdoor enthusiast who loves to camp off the grid. When in the city he spends his off time at farmers markets, bars with pooltables, reading, playing tabletop and video games.",
  },
  {
    first_name: "Jeffrey",
    last_name: "Friedrich",
    image: "/developer_pics/jeffrey.png",
    github: "jeffreyfriedrich",
    github_link: "https://github.com/JeffreyFriedrich",
    role: "Database Lead",
    information:
      "Jeffrey Friedrich is a senior at San Francisco State University majoring in Computer Science with a minor in Mathematics. Prior to SFSU, Jeffrey was a paratrooper Combat Medic Specialist in the U.S. Army and an Information Technology Specialist in the California National Guard. Additionally, during COVID, Jeffrey worked as an Administrative Assistant at a sub-contractor doing data entry. In his free time, Jeffrey likes to play sports such as soccer, play video games such as Age of Empires, and find new everyday uses for Google Sheets.",
  },
  {
    first_name: "Eddy",
    last_name: "Yun",
    image: "developer_pics/eddy.JPEG",
    github: "eyun1988",
    github_link: "https://github.com/eyun1988",
    role: "Back-end Lead",
    information:
      "Eddy Yun is a student at San Francisco State University who is aspiring to be a Software Engineer, or work in the field of cyber security. He has had prior experience working as a Front-end Engineer at Prizm-Labs, now called Table-Top Games. He plans to graduate at Spring of 2021 with a Bachelor's degree in Computer Science. His hobbies are shooting, hiking, taste testing different scotches, and is a former avid runner. Random fact: I finished the SF half marathon and won a 'green belt' award at Coding Dojo.",
  },
  {
    first_name: "Jose",
    last_name: "Quinteros",
    image: "/developer_pics/jose.jpg",
    github: "jaq19",
    github_link: "https://github.com/jaq19",
    role: "Front-end / Document Master",
    information:
      "Jose Andres Quinteros is a senior at San Francisco State University studying Computer Science. During the Summer of 2021, he interned with the Dreamers in Tech.  Conducted deep research into 15+ top careers in tech to facilitate resources for undocumented students.",
  },
];

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.locals.logged = true;
  res.render("about_us", { title: "About Page", person }); // can only pass an array
});

// route to page based on client choice
router.get("/:person", function (req, res, next) {
  // :person is the first name and is store into first_name // look at the href in about.hbs
  const first_name = req.params.person;
  // then we map through the options
  if (first_name in options)
    return res.render("about_me", {
      title: first_name,
      person: person[options[first_name]],
    });
  return res.redirect("/about");
});

module.exports = router;
