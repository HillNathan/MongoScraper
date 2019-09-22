const express = require('express')
const router = express.Router()
const db = require('../models');

const mongoose = require('mongoose')
const mongojs = require('mongojs')
const axios = require('axios')
const cheerio = require('cheerio')

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";
let theUrl = "https://news.ycombinator.com/"

console.log('Routes Loaded...')

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

router.get ("/scrape", (req,res) => {
    axios.get( theUrl )
        .then(scrape => {
            const $ = cheerio.load(scrape.data)
            $(".title").each( function(i, element) {
                let newArticle = {}
                newArticle.title = $(this)
                    .children("a")
                    .text();
                newArticle.href = $(this)
                    .children("a")
                    .attr("href");
                newArticle.saved = false;

                db.Article.create(newArticle)
                    .then( response => {
                        console.log(response)
                    })
                    .catch (err => {
                        console.log(err)
                    })
            })
            res.send("Scrape Complete.")
        })
        .catch(err => {
            console.log(err)
        })
    })

router.get("/foo", function(req, res) {
    // Find all Users
    db.Article.find({})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.json(err.message)
        })
    });

router.get("/article/:id", function(req, res) {
    db.Article.findOne({ _id: mongojs.ObjectId(req.params.id)})
        .populate("notes")
        .then( response => {
            res.json(response)
            })
        .catch( err => {
            res.json(err)
            })
    });

router.post("/addnote", (req, res) => {
    let {note} = req.body
    console.log (note)
    db.Note.create({note})
      .then( newNote => {
        return db.Article.findOneAndUpdate(
            { _id: mongojs.ObjectID(req.body._id) }, 
            {$push: {notes: newNote._id} }, 
            {new: true} )
      })
      .then(updatedArticle => {
          res.json(updatedArticle)
      })
      .catch(err => {
          res.json(err)
      })
    res.redirect("/")
})

router.post("/delete-note", (req,res) => {
    // console.log(req.body.id)
    db.Note.findOneAndDelete({ _id: mongojs.ObjectId(req.body.id)})
    .then( response => {
    res.json(response)
    })
    .catch( err => {
    res.json(err)
    }) 
})

router.get("/saved", function(req, res) {
    // Find all Users
    db.Article.find({ saved: true })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.json(err.message)
        })
    });

router.post("/update-saved", (req,res) => {
    console.log(req.body)
    let {saved} = req.body
    db.Article.findOneAndUpdate({ _id: mongojs.ObjectId(req.body.id) }, {saved})
        .then(updatedArticle => {
            res.json(updatedArticle)
        })
        .catch(err => {
            res.json(err)
        })
    })


module.exports = router
