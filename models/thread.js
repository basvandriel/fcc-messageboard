const mongoose = require('mongoose');


/**
 * Prefix the schema and timestamp
 */
const Schema = mongoose.Schema
const Timestamp = require('../lib/timestamp');

/**
 * The model schema for defining fields
 */
const schema = new Schema({
    board: String,
    text: String,
    reported: Boolean,
    delete_password: String,
    replies : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    created_on: Timestamp,
    bumped_on: Timestamp,
})

module.exports = mongoose.model("Thread", schema)