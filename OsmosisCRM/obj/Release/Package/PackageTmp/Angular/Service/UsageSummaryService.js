angular.module("myApp.Services").service('UsageSummaryService', ["$http", function ($http) {
    var list = {};
   
    list.GetChartData = function () {
        return $http({
            method: "GET",
            url: "/api/UserDashboard/GetChartData",
            contentType: "application/json"
        });
    };

    list.GetHistory = function () {
        return $http({
            method: "GET",
            url: "/api/UserDashboard/GetHistory",
            contentType: "application/json"
        });
    };


    return list;

}]);
