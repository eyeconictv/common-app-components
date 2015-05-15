"use strict";
describe("controller: scrolling list", function() {
  beforeEach(module("risevision.common.components.scrolling-list"));
  beforeEach(module(function ($provide) {
    $provide.service("$location",function(){
      return {
        _path : "",
        path : function(path){
          if (path){
            this._path = path;
          }
          return this._path;
        },
        search: function() {
          return {};
        }
      }
    });
  }));
  var $scope, $location, returnItems, companyId, apiCount, scrollEvent, result;
  beforeEach(function(){
    scrollEvent = {target: {scrollHeight: 20, clientHeight: 20, scrollTop: 20}};
    result = {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      cursor: "asdf"
    };
    apiCount = 0;
    companyId = "some_company_id";
    returnItems = true;
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $location = $injector.get("$location");
      $scope.listService = function(search, cursor){
        apiCount++;
        var deferred = Q.defer();
        if(returnItems){
          deferred.resolve(result);
        }else{
          deferred.reject("ERROR; could not retrieve list");
        }
        return deferred.promise;
      };
      
      $controller("scrollingListCtrl", {
        $scope : $scope,
        $location : $location,
        $log : $injector.get("$log")});
      $scope.$digest();  
    });
  });

  it("should exist",function(){
    expect($scope).to.be.truely;

    expect($scope.sortBy).to.be.a("function");
    expect($scope.doSearch).to.be.a("function");
    expect($scope.handleScroll).to.be.a("function");
    expect($scope.navigate).to.be.a("function");
  });

  it("should init the scope objects",function(){
    expect($scope.listItems).to.be.truely;
    expect($scope.listItems).to.have.property("list");
    expect($scope.listItems).to.have.property("add");
    expect($scope.listItems).to.have.property("clear");
    expect($scope.listItems).to.have.property("endOfList");
    
    expect($scope.search).to.be.truely;
    expect($scope.search).to.have.property("sortBy");
    expect($scope.search).to.have.property("count");
    expect($scope.search).to.have.property("reverse");
  });
  
  beforeEach(function(done) {
    setTimeout(function(){
      expect($scope.loadingItems).to.be.false;
      expect(apiCount).to.equal(1);
      expect($scope.error).to.not.be.ok;
      
      done();
    },10);
  });
  
  it("should load the list",function(){
    expect($scope.loadingItems).to.be.false;
    expect($scope.listItems).to.be.truely;
    expect($scope.listItems.list).to.have.length(20);
    expect($scope.listItems.cursor).to.be.truely;
    expect($scope.listItems.endOfList).to.be.false;

  });
  
  describe("list functions: ",function(){
    returnItems = true;
    
    describe("handleScroll: ",function(){
      it("should re-load if there are more items",function(done){
        result = {
          items: [21],
        };
        $scope.handleScroll(scrollEvent, true);
        $scope.$digest();
        
        expect($scope.loadingItems).to.be.true;
        setTimeout(function(){
          expect($scope.loadingItems).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.listItems.list).to.have.length(21);
          expect($scope.listItems.cursor).to.not.be.truely;
          expect($scope.listItems.endOfList).to.be.true;
          
          done();
        },10);
      });
      
      it("should not re-load if there are no more items",function(done){
        result = {
          items: [21],
        };
        $scope.handleScroll(scrollEvent, true);
        $scope.$digest();
        
        expect($scope.loadingItems).to.be.true;
        setTimeout(function(){
          $scope.handleScroll(scrollEvent, true);
          
          expect($scope.loadingItems).to.be.false;
                    
          done();
        },10);
      });
    });
    
    describe("sortBy: ",function(){
      it("should reset list and reverse sort by name",function(done){
        $scope.sortBy("name");
        $scope.$digest();
        
        expect($scope.loadingItems).to.be.true;
        setTimeout(function(){
          expect($scope.loadingItems).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.listItems.list).to.have.length(20);

          expect($scope.search.sortBy).to.equal("name");
          expect($scope.search.reverse).to.be.true;
          
          done();
        },10);
      
      });
      
      it("should reset list and sort by status",function(done){
        $scope.sortBy("status");
        $scope.$digest();
        
        expect($scope.loadingItems).to.be.true;
        setTimeout(function(){
          expect($scope.loadingItems).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.listItems.list).to.have.length(20);
          
          expect($scope.search.sortBy).to.equal("status");
          expect($scope.search.reverse).to.be.false;
          
          done();
        },10);
      });
    });

    it("should reset list and doSearch",function(done){
      $scope.doSearch();
      $scope.$digest();
      
      expect($scope.loadingItems).to.be.true;
      setTimeout(function(){
        expect($scope.loadingItems).to.be.false;
        expect($scope.error).to.not.be.ok;
        expect(apiCount).to.equal(2);
        
        expect($scope.listItems.list).to.have.length(20);
        
        expect($scope.search.sortBy).to.equal("name");
        expect($scope.search.reverse).to.be.false;
        
        done();
      },10);
    });
    
    it("should set error if list fails to load",function(done){
      returnItems = false;
      $scope.doSearch();
      $scope.$digest();
      
      expect($scope.loadingItems).to.be.true;
      setTimeout(function(){
        expect($scope.loadingItems).to.be.false;
        expect($scope.error).to.be.ok;
        expect(apiCount).to.equal(2);
        expect($scope.listItems.list).to.have.length(0);
        
        done();
      },10);
    });
  });

});
