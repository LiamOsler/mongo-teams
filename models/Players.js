const mongoose = require("mongoose")

// {
//     "_id": {
//       "$oid": "64a2316ec348d68c6635112c"
//     },
//     "fname925": "Liam",
//     "lname925": "Osler",
//     "phone925": "1-555-555-5555",
//     "preference925": [
//       "red",
//       "green",
//       "blue"
//     ]
//   }

const schema = mongoose.Schema({
    fname925: String,
    lname925: String,
    phone925: String,
    preference925: [String]
})

module.exports = mongoose.model("players925", schema)