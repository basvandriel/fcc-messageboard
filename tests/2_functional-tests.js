const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Thread = require('../models/thread');
const Comment = require('../models/comment');

chai.use(chaiHttp);


suite('Functional Tests', function() {
    // this.enableTimeouts(false)

    test("app.route('/api/threads/:board').post: creating a thread", async () => {
        const result = await chai.request(server).post("/api/threads/fcc_testing").send({
            text: "testText",
            delete_password: "validpassword"
        })

        assert.equal(result.status, 200)
        assert.isTrue(result.body.ok)
    })

    test("app.route('/api/threads/:board').get", async () => {
        const result = await chai.request(server).get("/api/threads/fcc_testing");
        assert.equal(result.status, 200)
        assert.isArray(result.body)
    })
    
    test("app.route('/api/replies/:board').get", async () => {
        const thread = await Thread.findOne({ board: "fcc_testing" });
        const result = await chai.request(server).get(`/api/replies/fcc_testing?thread_id=${thread ._id.toString()}`);

        assert.equal(result.status, 200);
    })

    test("app.route('/api/replies/:board').post", async () =>{
        const thread = await Thread.findOne({ board: "fcc_testing" });

        const result = await chai.request(server).post(`/api/replies/fcc_testing`).send({
            text: "idk",
            delete_password: "validpassword",
            thread_id: thread._id.toString()
        })
        assert.equal(result.status, 200)
    })

    test('app.route("/api/threads/:board").delete', async () => {
        const thread = await Thread.findOne({ board: "fcc_testing" });

        const result = await chai.request(server).delete(`/api/replies/fcc_testing`).send({
            delete_password: "validpassword",
            thread_id: thread._id.toString()
        })

        assert.equal(result.status, 200)
    })

    test('app.route("/api/replies/:board").delete', async () => {
        const thread = await Thread.findOne({ board: "fcc_testing" });
        
        const comment = new Comment({ 
            delete_password: 'valid_password',
            text: 'idk whoknows',
            reported: false,
            thread_id: thread._id.toString(),
        })
        await comment.save()

        thread.replies.push(comment);
        await thread.save();

        // Fire the event
        const result = await chai.request(server).delete(`/api/replies/fcc_testing`).send({
            delete_password: "validpassword",
            thread_id: thread._id.toString(),
            reply_id: comment._id.toString()
        })

        assert.equal(result.status, 200)
    })

    test('app.route("/api/threads/:board").put - reports a thread', async () => {
        const thread = await Thread.findOne({ board: "fcc_testing" });

        const result = await chai.request(server).put(`/api/threads/fcc_testing`).send({
            report_id: thread._id.toString(),
        })
        assert.equal(result.status, 200);
    });

    test('app.route("/api/replies/:board").put', async () => {
        const thread = await Thread.findOne({ board: "fcc_testing" });
        const comment = await Comment.findOne({
            thread_id: thread._id.toString()
        });

        const result = await chai.request(server).put(`/api/threads/fcc_testing`).send({
            thread_id: thread._id.toString(),
            reply_id: comment._id.toString(),
        })

        assert.equal(result.status, 200)
    })

    test("app.route('/b/:board/').get", async () => {
        const result = await chai.request(server).get(`/b/fcc_testing`);
        assert.equal(result.status, 200)
    });

    test("app.route('/b/:board/:threadid').get", async () => {
        const thread = await Thread.findOne({ board: "fcc_testing" });
        const thread_id = thread._id.toString()

        const result = await chai.request(server).get("/b/fcctesting/" + thread_id)

        assert.equal(result.status, 200)
    })
});
