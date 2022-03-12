const mongoose = require('mongoose');

/**
 * Prefix the schema and timestamp
 */
const Schema = mongoose.Schema
const Timestamp = require('../lib/timestamp')

/**
 * The model schema for defining fields
 */
const schema = new Schema({
    text: String,
    delete_password: String,
    reported: Boolean,
    reply_id: String,
    thread_id: { type: Schema.Types.ObjectId, ref: 'Thread' },
    created_on: Timestamp
})


/**
 * A threads comment
 */
module.exports = mongoose.model("Comment", schema)