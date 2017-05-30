angular.module("myApp.Services").service('UserService', ["$http", function ($http) {
    var list = {};

    list.AddUser = function (data) {
        return $http({
            method: "POST",
            url: "/api/User/SaveUser",
            data: data,
            contentType: "application/json"
        });
    };

    list.GetUserList = function () {
        return $http({
            method: "GET",
            url: "/api/User/GetUserList",
            contentType: "application/json"
        });
    };

    list.GetUserOnId = function (cindex) {
        return $http({
            method: "GET",
            url: "/api/User/GetUserOnId?cindex=" + cindex,
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

    list.SendInvitationEmail = function (UserMasterID) {
        return $http({
            method: "POST",
            url: "/api/User/SendInvitationEmail?UserMasterID=" + UserMasterID,
            contentType: "application/json"
        });
    };


    list.GetEditUserOnId = function () {
        return $http({
            method: "GET",
            url: "/api/UserDashboard/GetUserOnId",
            contentType: "application/json"
        });
    };

    list.UpdateUser = function (data) {
        return $http({
            method: "POST",
            url: "/api/UserDashboard/UpdateUser",
            data: data,
            contentType: "application/json"
        });
    };

    return list;

}]);
