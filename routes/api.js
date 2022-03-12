'use strict';

const multer = require('multer')
const Thread = require('../models/thread')
const Comment = require('../models/comment')

/**
 * Used for using form-data in requests
 */
const upload = multer()

module.exports = function (app) {

  app.route('/api/threads/:board').post(upload.none(), async (request, response) => {
    // The required text and password
    const { text, delete_password } = request.body

    // The board we're adding
    const board = request.params.board
    const replies = []

    // Idk it's required
    const reported = false;

    const model = Thread({ name: board, text, delete_password, replies, reported });
    await model.save()

    return response.json({ data: { text, delete_password, board, replies, reported }, ok: true })
  });
  

  // You can send a POST request to /api/replies/{board} with form data including text, delete_password, & thread_id.
  // This will update the bumped_on date to the comment's date. 
  // In the thread's replies array, an object will be saved with at least the properties _id, text, created_on, delete_password, & reported.
  app.route('/api/replies/:board').post(upload.none(), async (request, response) => {
    const { text, delete_password, thread_id } = request.body
    const thread = await Thread.findById(thread_id)

    /**
     * Yes
     */
    if (!thread) return response.json("Thread not found")

    const comment = Comment({ text, delete_password, thread_id })
    await comment.save(); 

    thread.replies.push(comment);

    console.log(comment.created_on);
    thread.bumped_on = new Date(comment.created_on);

    await thread.save()
      
    return response.json('ok')
  });

};
