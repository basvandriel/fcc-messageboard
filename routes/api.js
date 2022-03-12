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

    const model = Thread({ board, text, delete_password, replies, reported });
    await model.save()

    return response.json({ data: { text, delete_password, board, replies, reported }, ok: true })
  });
  
  app.route('/api/threads/:board').get(async (request, response) => {
    const board = request.params.board

    // The 10 threads to find with the most recent bumped comments 
    const threads = await Thread.find({ board }, { reported: 0, delete_password: 0})
        .populate({
          path: 'replies',
          options: { limit: 3, sort: { created_on: -1 }, select: '-reported -delete_password'}
        })
        .sort({ bumped_on: -1 })
        .limit(10)

    return response.json(threads)
  })

  // You can send a GET request to /api/replies/{board}?thread_id={thread_id}. 
  // Returned will be the entire thread with all its replies, also excluding the same fields from the client as the previous test.
  app.route('/api/replies/:board').get(async (request, response) => {
    const board = request.params.board
    const thread_id = request.query.thread_id;

    if (!board || !thread_id) {
      return response.json("board or thread_id param not found")
    }

    const thread = await Thread.findById(thread_id, { reported: 0, delete_password: 0})
        .populate({
          path: 'replies',
          options: { select: '-reported -delete_password'}
        })
        .sort({ bumped_on: -1 })

    return response.json(thread)
  })

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

    const reported = false
    const comment = Comment({ text, delete_password, reported, thread_id })
    await comment.save(); 

    thread.replies.push(comment);

    console.log(comment.created_on);
    thread.bumped_on = new Date(comment.created_on);

    await thread.save()
      
    return response.json('ok')
  });

  // You can send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password to delete the thread.
  //  Returned will be the string incorrect password or success.
  app.route("/api/threads/:board").delete(upload.none(), async (request, response) => {
    const board = request.params.board
    const { thread_id, delete_password } = request.body

    if(!thread_id || !delete_password || !board) {
      return response.json("thread_id || delete_password || board not found")
    }
    
    const payload = await Thread.findOneAndDelete({ _id: thread_id, delete_password, board });

    return response.send(!payload ? "incorrect password" : "success");
  })

  // You can send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password to delete the thread.
  //  Returned will be the string incorrect password or success.
  app.route("/api/replies/:board").delete(upload.none(), async (request, response) => {
    const board = request.params.board
    const { thread_id, reply_id, delete_password } = request.body

    if(!thread_id || !reply_id || !delete_password || !board) {
      return response.json("thread_id || reply_id || delete_password || board not found")
    }
    
    const payload = await Comment.findOneAndUpdate({ _id: reply_id, thread_id, delete_password, board }, {
      _id: "[deleted]"
    })
    // const payload = await Thread.findOneAndDelete({ _id: thread_id, delete_password, board });

    return response.send(!payload ? "incorrect password" : "success");
  })
};
