// declare a main-angular module and submodule
var myApp = angular.module('myApp',
    [
        "ngSanitize",
        "myApp.Controllers",
        "myApp.Services"
    ])

//Sub modules
angular.module("myApp.Controllers", []);
angular.module("myApp.Services", []);
angular.module("myApp.config", []);

//angular.module("myApp").run(function ($rootScope) {
//    $rootScope.Name = 'Pithiya';
//});

//Initialize variable when dom is ready
angular.module("myApp").run(["$rootScope", "$http", "$cacheFactory", "$anchorScroll",
    function ($rootScope, $http, $cacheFactory, $anchorScroll) {
        $rootScope.$safeApply = function ($scope, fn) {
            fn = fn || function () { };
            if ($scope.$$phase) {
                fn();
            }
            else {
                $scope.$apply(fn);
            }
        };
    }
]);

angular.module('myApp').directive('ngOnFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.broadcastEventName ? attr.broadcastEventName : 'ngRepeatFinished');
                });
            }
        }
    };
});



