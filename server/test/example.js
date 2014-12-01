/* jshint expr:true */

var expect = require('chai').expect;

describe('How Mocha and Chai works', function() {
  it('can check that true is true', function() {
    expect(true).is.true;
  });

  it('can check for equality', function() {
    expect('foo').to.equal('foo');
  });

  it('can check for diversity', function() {
    expect('foo').to.not.equal('bar');
  });

  describe('Contexts can be nested', function() {
    it('can check if something is included in an Array', function() {
      expect(['a','b','c']).to.include('a');
    });
  });
});
