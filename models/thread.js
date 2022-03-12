const mongoose = require('mongoose');


/**
 * Prefix the schema and timestamp
 */
const Schema = mongoose.Schema
const Timestamp = require('../lib/timestamp');

/**
 * A trait for setting properties
 */
const securable = require('../lib/securable')

/**
 * The model schema for defining fields
 */
const schema = new Schema({
    ...securable,
    board: String,
    text: String,
    replies : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    created_on: Timestamp,
    bumped_on: Timestamp,
})

module.exports = mongoose.model("Thread", schema)