angular.module("myApp.Services").service('CaseService', ["$http", function ($http) {
    var list = {};

    list.SaveCase = function (data) {
        return $http({
            method: "POST",
            url: "/api/Case/SaveCase",
            data: data,
            contentType: "application/json"
        });
    };

    list.GetCaseList = function () {
        return $http({
            method: "GET",
            url: "/api/Case/GetCaseList",
            contentType: "application/json"
        });
    };

    list.DeleteCase = function (caseid) {
        return $http({
            method: "POST",
            url: "/api/Case/DeleteCase?caseid=" + caseid,
            contentType: "application/json"
        });
    };

    return list;

}]);
