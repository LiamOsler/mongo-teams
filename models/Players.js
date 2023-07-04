const mongoose = require("mongoose")

const schema = mongoose.Schema({
    fname925: String,
    lname925: String,
    phone925: String,
    preference925: [String]
})

module.exports = mongoose.model("players925", schema)