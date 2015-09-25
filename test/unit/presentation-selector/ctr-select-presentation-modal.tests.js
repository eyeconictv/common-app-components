'use strict';
describe('controller: Edit Presentation Modal', function() {
  beforeEach(module('risevision.common.components.presentation-selector'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(action){
          return;
        }
      }
    });
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy;
  beforeEach(function(){
    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $controller('selectPresentationModal', {
        $scope : $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.dismiss).to.be.a('function');
  });

  it('should close modal when clicked on a presentation',function(){
    var presentationId = 'presentationId';
    var presentationName = 'presentationName';
    $scope.$broadcast('risevision.common.components.presentation-selector.presentation-selected',
      presentationId, presentationName);

    $modalInstanceCloseSpy.should.have.been.calledWith([presentationId, presentationName]);
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstanceDismissSpy.should.have.been.called;
  });

});
