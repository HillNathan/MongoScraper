const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true,
    },
    saved: Boolean,
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
})

module.exports = mongoose.model("Article", ArticleSchema)
