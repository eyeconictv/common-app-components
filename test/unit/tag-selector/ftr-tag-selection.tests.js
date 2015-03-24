/*jshint expr:true */
"use strict";

describe("filter: Tag Selection", function() {
  beforeEach(module("risevision.common.components.tag-selector"));
  var tagSelection;
  var tags = [
    {
      name: "tag1",
      value: "value1"
    },
    {
      name: "tag2",
      value: "value2"
    },
    {
      name: "tag3",
      value: "value3"
    }
  ];

  beforeEach(function(){
    inject(function($filter){
      tagSelection = $filter("tagSelection");
    });
  });

  it("should exist",function(){
    expect(tagSelection).to.be.truely;
  });

  it("should handle empty lists",function(){
    var result = tagSelection([]);
    
    expect(result).to.have.length(0);
  });
    
  it("should return tags list",function() {
    var result = tagSelection(tags, [])
    
    expect(result).to.have.length(3);
  });
  
  it("should remove tags from list",function() {
    var result = tagSelection(tags, [tags[1], tags[2]])
    
    expect(result).to.have.length(1);
    expect(result[0]).to.deep.equal(tags[0]);
  });

});
