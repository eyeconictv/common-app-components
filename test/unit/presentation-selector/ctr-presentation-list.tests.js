'use strict';
describe('controller: Presentation List', function() {
  beforeEach(module('risevision.common.components.presentation-selector'));
  beforeEach(module('risevision.common.components.presentation-selector.services'));
  beforeEach(module(function ($provide) {
    $provide.service('presentation',function(){
      return {
        list : function(search, cursor){
          apiCount++;
          var deferred = Q.defer();
          if(returnPresentations){
            deferred.resolve(result);
          }else{
            deferred.reject('ERROR; could not retrieve list');
          }
          return deferred.promise;
        }
      }
    });
    $provide.service('$loading',function(){
      return {
        start : function(spinnerKeys){
          return;
        },
        stop : function(spinnerKeys){
          return;
        }
      }
    });
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
  }));
  var $scope, $broadcastSpy, returnPresentations, apiCount, result, $loading,$loadingStartSpy, $loadingStopSpy;
  beforeEach(function(){

    result = {
      items: [],
      cursor: 'asdf'
    };
    for (var i = 1; i <= 40; i++) {
      result.items.push(i);
    }
    apiCount = 0;
    returnPresentations = true;

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $broadcastSpy = sinon.spy($rootScope, '$broadcast');
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $controller('PresentationListModalController', {
        $scope : $scope,
        $rootScope: $rootScope,
        presentation: $injector.get('presentation'),

        $loading: $loading
      });
      $scope.$digest();
    });
  });

  beforeEach(function(done) {
    setTimeout(function(){
      expect($scope.loadingPresentations).to.be.false;
      expect(apiCount).to.equal(1);
      expect($scope.error).to.not.be.ok;

      done();
    },10);
  });


  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.select).to.be.a('function');

    expect($scope.sortBy).to.be.a('function');
    expect($scope.doSearch).to.be.a('function');
    expect($scope.load).to.be.a('function');
  });

  it('should init the scope objects',function(){
    expect($scope.presentations).to.be.truely;
    expect($scope.presentations).to.have.property('list');
    expect($scope.presentations).to.have.property('add');
    expect($scope.presentations).to.have.property('clear');
    expect($scope.presentations).to.have.property('endOfList');

    expect($scope.search).to.be.truely;
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('count');
    expect($scope.search).to.have.property('reverse');
  });


  it('should load the list',function(){
    expect($scope.loadingPresentations).to.be.false;
    expect($scope.presentations).to.be.truely;
    expect($scope.presentations.list).to.have.length(40);
    expect($scope.presentations.cursor).to.be.truely;
    expect($scope.presentations.endOfList).to.be.false;

  });


  describe('list functions: ',function(){
    returnPresentations = true;

    describe('load: ',function(){
      it('should re-load if there are more items',function(done){
        result = {
          items: [21]
        };
        $scope.load();
        $scope.$digest();

        expect($scope.loadingPresentations).to.be.true;
        $loadingStartSpy.should.have.been.calledWith('presentation-list-loader');
        setTimeout(function(){
          expect($scope.loadingPresentations).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect($scope.presentations.list).to.have.length(41);
          expect($scope.presentations.cursor).to.not.be.truely;
          expect($scope.presentations.endOfList).to.be.true;
          $scope.$digest();
          $loadingStopSpy.should.have.been.calledWith('presentation-list-loader');
          done();
        },10);
      });

      it('should not re-load if there are no more items',function(done){
        result = {
          items: [41]
        };
        $scope.load();
        $scope.$digest();

        expect($scope.loadingPresentations).to.be.true;
        setTimeout(function(){
          $scope.load();

          expect($scope.loadingPresentations).to.be.false;

          done();
        },10);
      });
    });

    describe('sortBy: ',function(){
      it('should reset list and reverse sort by changeDate',function(done){
        $scope.sortBy('name');
        $scope.$digest();

        expect($scope.loadingPresentations).to.be.true;
        setTimeout(function(){
          expect($scope.loadingPresentations).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect($scope.presentations.list).to.have.length(40);

          expect($scope.search.sortBy).to.equal('name');
          expect($scope.search.reverse).to.be.true;

          done();
        },10);

      });

      it('should reset list and sort by name',function(done){
        $scope.sortBy('name');
        $scope.$digest();

        expect($scope.loadingPresentations).to.be.true;
        setTimeout(function(){
          expect($scope.loadingPresentations).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect($scope.presentations.list).to.have.length(40);

          expect($scope.search.sortBy).to.equal('name');
          expect($scope.search.reverse).to.be.true;

          done();
        },10);
      });
    });

    it('should reset list and doSearch',function(done){
      $scope.doSearch();
      $scope.$digest();

      expect($scope.loadingPresentations).to.be.true;
      setTimeout(function(){
        expect($scope.loadingPresentations).to.be.false;
        expect($scope.error).to.not.be.ok;
        expect(apiCount).to.equal(2);

        expect($scope.presentations.list).to.have.length(40);

        expect($scope.search.sortBy).to.equal('name');
        expect($scope.search.reverse).to.be.false;

        done();
      },10);
    });

    it('should set error if list fails to load',function(done){
      returnPresentations = false;
      $scope.doSearch();
      $scope.$digest();

      expect($scope.loadingPresentations).to.be.true;
      setTimeout(function(){
        expect($scope.loadingPresentations).to.be.false;
        expect($scope.error).to.be.ok;
        expect(apiCount).to.equal(2);
        expect($scope.presentations.list).to.have.length(0);

        done();
      },10);
    });
  });

});
