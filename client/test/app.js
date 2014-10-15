describe("annotable", function(){

  it('exist', function(){
    var annotable = document.createElement('nn-annotable');
    expect(annotable.PolymerBase).to.be.true;
  });

  describe("it works as expected", function(){
    var annotable;

    beforeEach(function(){
      annotable = document.createElement('nn-annotable');
    });

    it("enrich the content with the comments section", function(){
      expect(annotable.shadowRoot.querySelector('h2')).to.exist;
    });

  });

});
