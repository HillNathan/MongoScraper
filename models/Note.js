const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoteSchema = new Schema({
    title: String,
    note: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Note", NoteSchema)
