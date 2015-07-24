'use strict';
describe('controller: Edit Distribution Modal', function() {
  beforeEach(module("risevision.common.components.distribution-selector"));
  beforeEach(module("risevision.common.components.distribution-selector.services"));
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

    $provide.value('distribution', distributionValue);

    $provide.value('distributeToAll', toAll);
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, distributionValue, toAll, distribution, distributeToAll;

  describe('distribution empty and distribute to all false' ,function () {
    beforeEach(function(){
      distributionValue = [];
      toAll = false;
      inject(function($injector, $rootScope, $controller){
        $scope = $rootScope.$new();
        $modalInstance = $injector.get('$modalInstance');
        $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
        $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
        distribution = $injector.get('distribution');
        distributeToAll = $injector.get('distributeToAll');
        $controller('selectDistributionModal', {
          $scope : $scope,
          $modalInstance : $modalInstance,
          distribution: distribution,
          distributeToAll: distributeToAll
        });
        $scope.$digest();
      });
    });

    it('should exist',function(){
      expect($scope).to.be.truely;

      expect($scope.apply).to.be.a('function');
      expect($scope.dismiss).to.be.a('function');

      expect($scope.parameters).to.be.a('object');
      expect($scope.parameters.distribution).to.be.empty;
      expect($scope.parameters.distributeToAll).to.be.false;

    });

    it('should close modal when clicked on apply',function(){
      $scope.apply();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith([distribution, distributeToAll]);
    });

    it('should dismiss modal when clicked on close with no action',function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });

  describe('distribution not empty and distribute to all false' ,function () {
    beforeEach(function(){
      distributionValue = ['display1', 'display2'];
      toAll = false;
      inject(function($injector, $rootScope, $controller){
        $scope = $rootScope.$new();
        $modalInstance = $injector.get('$modalInstance');
        $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
        $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
        distribution = $injector.get('distribution');
        distributeToAll = $injector.get('distributeToAll');
        $controller('selectDistributionModal', {
          $scope : $scope,
          $modalInstance : $modalInstance,
          distribution: distribution,
          distributeToAll: distributeToAll
        });
        $scope.$digest();
      });
    });

    it('should exist',function(){
      expect($scope).to.be.truely;

      expect($scope.apply).to.be.a('function');
      expect($scope.dismiss).to.be.a('function');

      expect($scope.parameters).to.be.a('object');
      expect($scope.parameters.distribution).to.contain('display1', 'display2');
      expect($scope.parameters.distributeToAll).to.be.false;

    });

    it('should close modal when clicked on apply',function(){
      $scope.apply();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith([distribution, distributeToAll]);
    });

    it('should dismiss modal when clicked on close with no action',function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });

  describe('distribution empty and distribute to all true' ,function () {
    beforeEach(function(){
      distributionValue = [];
      toAll = true;
      inject(function($injector, $rootScope, $controller){
        $scope = $rootScope.$new();
        $modalInstance = $injector.get('$modalInstance');
        $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
        $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
        distribution = $injector.get('distribution');
        distributeToAll = $injector.get('distributeToAll');
        $controller('selectDistributionModal', {
          $scope : $scope,
          $modalInstance : $modalInstance,
          distribution: distribution,
          distributeToAll: distributeToAll
        });
        $scope.$digest();
      });
    });

    it('should exist',function(){
      expect($scope).to.be.truely;

      expect($scope.apply).to.be.a('function');
      expect($scope.dismiss).to.be.a('function');

      expect($scope.parameters).to.be.a('object');
      expect($scope.parameters.distribution).to.be.empty;
      expect($scope.parameters.distributeToAll).to.be.true;

    });

    it('should close modal when clicked on apply',function(){
      $scope.apply();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith([distribution, distributeToAll]);
    });

    it('should dismiss modal when clicked on close with no action',function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });

  describe('distribution undefined and distribute to all true' ,function () {
    beforeEach(function(){
      distributionValue = undefined;
      toAll = true;
      inject(function($injector, $rootScope, $controller){
        $scope = $rootScope.$new();
        $modalInstance = $injector.get('$modalInstance');
        $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
        $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
        distribution = $injector.get('distribution');
        distributeToAll = $injector.get('distributeToAll');
        $controller('selectDistributionModal', {
          $scope : $scope,
          $modalInstance : $modalInstance,
          distribution: distribution,
          distributeToAll: distributeToAll
        });
        $scope.$digest();
      });
    });

    it('should exist',function(){
      expect($scope).to.be.truely;

      expect($scope.apply).to.be.a('function');
      expect($scope.dismiss).to.be.a('function');

      expect($scope.parameters).to.be.a('object');
      expect($scope.parameters.distribution).to.be.empty;
      expect($scope.parameters.distributeToAll).to.be.true;

    });

    it('should close modal when clicked on apply',function(){
      $scope.apply();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith([[], distributeToAll]);
    });

    it('should dismiss modal when clicked on close with no action',function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });
});
