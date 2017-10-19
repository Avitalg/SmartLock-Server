var app = require("../"),
    request = request = require("supertest").agent(app.listen());

describe("error message api", function(){
    it("get error api message", function(done){
        request
            .get("/*")
            .expect(404)
            .expect(/error/)
            .end(done)
    })
});

describe("see api", function(){
    it("go to api", function(done){
        request
            .get("/api/*")
            .expect(404)
            .expect(/error/)
            .end(done)
    })
});


describe("see login", function(){
    it("go to login", function(done){
        request
            .get("/api/login")
            .expect(200)
            .expect(/success/)
            .end(done)
    })
});