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

angular.module('myApp').directive('onlyNum', function () {
    return function (scope, element, attrs) {

        var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110];
        element.bind("keydown", function (event) {
            //console.log($.inArray(event.which, keyCode));
            if ($.inArray(event.which, keyCode) == -1) {
                scope.$apply(function () {
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
});