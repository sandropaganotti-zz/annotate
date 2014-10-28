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

    it("should have a nid attribute once attached", function(){
      expect(function(){ annotable.attached(); }).to.throw(/Attribute missing: nid/);
      annotable.nid = 1234;
      expect(function(){ annotable.attached(); }).to.not.throw();
    });

    it("retrieves the current domain ", function(){
      expect(annotable.domain).to.be.equal(window.location.hostname);
    });

    describe('comments retrieval', function(){

      beforeEach(function(){
        setResponse([{user: 'sandro', body: 'nice!'}]);
        annotable.nid = 1234;
      });

      it("should retrieve the list of current comments", function(done){
        annotable.populateComments = function(evt){
          expect(evt.detail.response[0].body).to.be.equal('nice!');
          done();
        }
        annotable.attached();
      });

      it("displays the list of retrieved comments", function(done){
        document.body.appendChild(annotable);
        setTimeout(function(){
          expect(annotable.shadowRoot.querySelector('article').textContent).to.contain.text('nice!');
          done();
        }, 0);
      });

    });

  });

});
