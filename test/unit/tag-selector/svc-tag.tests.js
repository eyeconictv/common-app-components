"use strict";
describe("service: tag:", function() {
  beforeEach(module("risevision.common.components.tag-selector.services"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("userState",function(){
      return {
        getSelectedCompanyId : function(){
          return "TEST_COMP_ID";
        }
      }
    });

    $provide.service("storageApiLoader",function () {
      return function(){
        var deferred = Q.defer();
                
        deferred.resolve({
          tagdef: {
            list: function(obj){
              expect(obj).to.be.ok;

              var def = Q.defer();
              if (returnList) {
                def.resolve({
                  result : {
                    nextPageToken : 1,
                    items : [{
                      name: "tag1",
                      values: [
                        "value1",
                        "value2"
                      ],
                      type: "LOOKUP"
                    },
                    {
                      name: "tag2",
                      type: "FREEFORM"
                    }]
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            }
          }
        });
        return deferred.promise;
      };
    });

  }));
  var tag, returnList;
  beforeEach(function(){
    returnList = true;
    
    inject(function($injector){  
      tag = $injector.get("tag");
    });
  });

  it("should exist",function(){
    expect(tag).to.be.truely;
    expect(tag.list).to.be.a("function");
  });
  
  describe("list:",function(){
    it("should return a list of tags",function(done){
      tag.list({})
      .then(function(result){
        expect(result).to.be.truely;
        expect(result.items).to.be.an.array;
        expect(result.items).to.have.length(2);
        done();
      })
      .then(null,done);
    });
    
    it("should handle failure to get list correctly",function(done){
      returnList = false;
      
      tag.list()
      .then(function(displays) {
        done(displays);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal("API Failed");
        done();
      })
      .then(null,done);
    });
  });

  describe("flatList:",function(){
    it("should flatten the tags list",function(done){
      tag.flatList()
      .then(function(result){
        expect(result).to.be.truely;
        expect(result).to.be.an.array;
        expect(result).to.have.length(2);
        done();
      })
      .then(null,done);
    });
  });

  
});
