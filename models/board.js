const mongoose = require('mongoose');

/**
 * Mongoose way of a simple timestamp
 */
const Timestamp = {
    type: Date,
    default: Date.now
}

/**
 * The model schema for defining fields
 */
const schema = new mongoose.Schema({
    text: String,
    reported: Boolean,
    delete_password: String,
    replies: Array,
    created_on: Timestamp,
    bumped_on: Timestamp,
})

module.exports = mongoose.model("Board", schema)