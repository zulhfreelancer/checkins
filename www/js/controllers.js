angular.module('app.controllers', ['nl2br', 'uuid'])

.run(function($rootScope, Session){
	$rootScope.Session = Session;
})

.controller('myCheckinsCtrl', function($scope, $timeout) {
	$scope.removeCheckin = function(checkin) {
		console.log(checkin);
		$scope.Session.checkins.splice($scope.Session.checkins.indexOf(checkin), 1);
	}
})
  
.controller('checkinCtrl', function(
	$scope,
	$ionicLoading,
	$timeout,
	$cordovaGeolocation,
	$ionicPlatform,
	$http,
	reverseGeocoder,
	$state,
	uuid4
) {
	$scope.latitude    = '';
	$scope.longitude   = '';
	$scope.address     = '';
	$scope.description = '';
	$scope.map         = '';

	$ionicLoading.show({
		template: "Getting your location..."
	});
	$ionicPlatform.ready(function(){
		console.log("ready");
		$cordovaGeolocation.getCurrentPosition({
			timeout: 20000,
			enableHighAccuracy: false
		}).then(function(position){
			$scope.latitude	= position.coords.latitude.toFixed(5);
			$scope.longitude = position.coords.longitude.toFixed(5);
			console.log($scope.latitude);
			console.log($scope.longitude);
			reverseGeocoder.getAddress($scope.latitude, $scope.longitude)
				.then(function(address){
					$scope.address = address.text;
					$scope.map = address.map;
					$ionicLoading.hide();
				}, function(){
					$ionicLoading.show({
						template: "Error getting address"
					});
					$timeout(function(){
						$ionicLoading.hide();
					}, 1000);
				});
		});
	});

	$scope.save = function() {
		console.log($scope);
		// unshift = add new items to the beginning of an array
		$scope.Session.checkins.unshift({
			id: uuid4.generate(),
			latitude: $scope.latitude,
			longitude: $scope.longitude,
			address: $scope.address,
			description: $scope.description,
			map: $scope.map
		});
		$state.go('myCheckins');
	};

})
   
.controller('locationCtrl', function($scope, $stateParams) {
    $scope.checkin = $scope.Session.checkins.reduce(function(carry, checkin){
		console.group("carry");
		console.log(carry);
		console.groupEnd();

		console.group("checkin");
		console.log(checkin);
		console.groupEnd();

		if (checkin.id == $stateParams.id) {
			carry = checkin;
		}
	return carry;
    }, {});
    console.log($scope.checkin, $stateParams);
});
 