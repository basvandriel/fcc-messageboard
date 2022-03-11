'use strict';

const multer = require('multer')

/**
 * Used for using form-data in requests
 */
const upload = multer()

module.exports = function (app) {

  app.route('/api/threads/:board').post(upload.none(), (request, response) => {
    // The required text and password
    const { text, delete_password } = request.body

    // The board we're adding
    const board = request.params.board
    const replies = []

    // Idk it's required
    const reported = false

    return response.json({ data: { text, delete_password, board, replies, reported }, ok: true })
  });
    
  app.route('/api/replies/:board');

};
