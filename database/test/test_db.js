const assert = require('chai').assert;

describe('This is a test', function(){
    describe('Testing this is an actual test', function(){
        it('This should be correct', function(){
            assert.isTrue(true, 'This is true');
        });
    });
});

describe('hello again', function(){
    it('now this is in the same file', function(){
        assert.isTrue(false, 'This should be true now');
    });
});