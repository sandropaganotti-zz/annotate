/* global setResponse: false */
/* jshint expr:true */

describe('annotable', function(){

  xit('exist', function(){
    var annotable = document.createElement('nn-annotable');
    expect(annotable.PolymerBase).to.be.true;
  });

  xdescribe('it works as expected', function(){
    var annotable;

    beforeEach(function(){
      annotable = document.createElement('nn-annotable');
    });

    xit('enrich the content with the comments section', function(){
      expect(annotable.shadowRoot.querySelector('h3')).to.exist;
    });

    xit('should have a nid attribute once attached', function(){
      expect(function(){ annotable.attached(); }).to.throw(/Attribute missing: nid/);
      annotable.nid = 1234;
      expect(function(){ annotable.attached(); }).to.not.throw();
    });

    xit('retrieves the current domain ', function(){
      expect(annotable.domain).to.be.equal(window.location.hostname);
    });

    xdescribe('business logic', function(){

      beforeEach(function(){
        setResponse([{user: 'sandro', text: 'nice!'}]);
        annotable.nid = 1234;
      });

      xit('should retrieve the list of current comments', function(done){
        annotable.populateComments = function(evt){
          expect(evt.detail.response[0].text).to.be.equal('nice!');
          done();
        };
        annotable.attached();
      });


      xit('retrieves data from the form and translate it into JSON', function(){
        var newComment = annotable.shadowRoot.querySelector('#new_comment');
        annotable.text = 'some text';
        annotable.author = 'sandro.paganotti@gmail.com';
        expect(newComment.params).to.be.equal(JSON.stringify({
          author: annotable.author,
          text: annotable.text
        }));
      });

      xit('dont send a new comment if author or text is not present', function(){
        setResponse({});
        annotable.newComment({preventDefault: function(){}});
        expect(annotable.message).to.be.equal('completa tutti i campi');
      });

      xit('does send a new comment if author and text is present', function(done){
        setResponse({});
        annotable.resetForm = function(){ done(); };
        annotable.text = 'some text';
        annotable.author = 'sandro.paganotti@gmail.com';
        annotable.newComment({preventDefault: function(){}});
      });

    });

    xdescribe('template building', function(){

      beforeEach(function(done){
        setResponse([{author: 'sandro', text: 'nice!'}]);
        annotable.nid = 1234;
        annotable.connect = false;
        document.body.appendChild(annotable);
        setTimeout(done, 200);
      });

      xit('displays the list of retrieved comments', function(){
        expect(annotable.shadowRoot.querySelector('dd').textContent).to.contain('nice!');
      });

      xit('displays a new comment when receiving a socket ping', function(done){
        var websocket = annotable.shadowRoot.querySelector('#websocket');
        websocket._onMessage({
          author: 'someone',
          text: 'text from websocket'
        });
        setTimeout(function(){
          expect(annotable.shadowRoot.querySelector('.row:last-child dd').textContent).to.contain('websocket');
          done();
        }, 200);
      });

      afterEach(function(){
        document.body.removeChild(annotable);
      });

    });

  });

});
