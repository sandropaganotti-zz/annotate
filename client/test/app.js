describe("annotable", function(){

  it('exist', function(){
    var annotable = document.createElement('nn-annotable');
    expect(annotable.PolymerBase).to.be.true;
  });

});
