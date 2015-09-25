'use strict';
describe('service: presentationFactory: ', function() {
  beforeEach(module('risevision.common.components.presentation-selector.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation',function () {
      return {
        _presentation: {
          id: 'presentationId',
          name: 'some presentation',
          revisionStatus: 0
        },
        get: function(presentationId) {
          var deferred = Q.defer();
          if(returnPresentation){
            apiCalls++;
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject('ERROR; could not get presentation');
          }
          return deferred.promise;
        }
      };
    });
  }));
  var presentationFactory, returnPresentation, apiCalls;
  beforeEach(function(){
    returnPresentation = true;
    apiCalls = 0;
    
    inject(function($injector){  
      presentationFactory = $injector.get('presentationFactory');
    });
  });

  it('should exist',function(){
    expect(presentationFactory).to.be.truely;
    
    expect(presentationFactory.getPresentationCached).to.be.truely;
    expect(presentationFactory.loadingPresentation).to.be.false;

    expect(presentationFactory.getPresentation).to.be.a('function');
  });
    
  describe('getPresentation: ', function(){
    it('should get the presentation',function(done){
      presentationFactory.getPresentation('presentationId')
      .then(function(presentation) {
        expect(presentation).to.be.truely;
        expect(presentation.name).to.equal('some presentation');

        setTimeout(function() {
          expect(presentationFactory.loadingPresentation).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done('error');
      })
      .then(null,done);
    });
    
    it('should handle failure to get presentation correctly',function(done){
      returnPresentation = false;
      
      presentationFactory.getPresentation()
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        expect(presentationFactory.apiError).to.be.truely;
        expect(presentationFactory.apiError).to.equal('ERROR; could not get presentation');

        setTimeout(function() {
          expect(presentationFactory.loadingPresentation).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });
  });
  
  describe('getPresentationCached: ', function() {
    it('should eventually get Presentation', function(done) {
      var presentation = presentationFactory.getPresentationCached('presentationId');
      
      expect(presentation).to.be.ok;
      expect(presentation.id).to.equal('presentationId');
      expect(presentation.name).to.not.be.ok;
      
      setTimeout(function() {
        expect(apiCalls).to.equal(1);
        expect(presentation.name).to.be.ok;
        expect(presentation.name).to.equal('some presentation');
        
        done();
      }, 10);
    });
    
    it('should only call API once', function(done) {
      presentationFactory.getPresentationCached('presentationId');
      
      setTimeout(function() {
        presentationFactory.getPresentationCached('presentationId');
        
        setTimeout(function() {
          expect(apiCalls).to.equal(1);
          
          done();
        }, 10);
      }, 10);
    });
  });

});
