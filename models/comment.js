const mongoose = require('mongoose');

/**
 * Prefix the schema and timestamp
 */
const Schema = mongoose.Schema
const Timestamp = require('../lib/timestamp')

/**
 * A trait for setting properties
 */
 const securable = require('../lib/securable')

/**
 * The model schema for defining fields
 */
const schema = new Schema({
    ...securable,
    text: String,
    thread_id: { type: Schema.Types.ObjectId, ref: 'Thread' },
    created_on: Timestamp
})


/**
 * A threads comment
 */
module.exports = mongoose.model("Comment", schema)