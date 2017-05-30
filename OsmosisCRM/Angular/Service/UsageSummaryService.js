angular.module("myApp.Services").service('UsageSummaryService', ["$http", function ($http) {
    var list = {};

    list.AddUser = function (data) {
        return $http({
            method: "POST",
            url: "/api/User/SaveUser",
            data: data,
            contentType: "application/json"
        });
    };

    list.GetCurrentUser = function () {
        return $http({
            method: "GET",
            url: "/api/UserDashboard/GetCurrentUser",
            contentType: "application/json"
        });
    };

    list.Getdata = function () {
        return $http({
            method: "GET",
            url: "http://osmosishub.com/api/v1/loghour/?format=json&IDClient=5CYQKF39&username=purifieruser&api_key=f3b937e2c60ccdecad8b5be716c40231983ce086&machinecode=f3e21a840b6c&hours=8",
            contentType: "application/json"
        });
    };

    list.DeleteUser = function (UserMasterID) {
        return $http({
            method: "POST",
            url: "/api/User/DeleteUser?UserMasterID=" + UserMasterID,
            contentType: "application/json"
        });
    };

    return list;

}]);
