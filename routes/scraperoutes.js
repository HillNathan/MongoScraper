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

module.exports = router
