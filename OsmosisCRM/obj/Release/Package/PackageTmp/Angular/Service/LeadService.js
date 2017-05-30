angular.module("myApp.Services").service('LeadService', ["$http", function ($http) {
    var list = {};

    list.SaveLead = function (data) {
        return $http({
            method: "POST",
            url: "/api/Lead/SaveLead",
            data: data,
            contentType: "application/json"
        });
    };

    list.GetLeadList = function () {
        return $http({
            method: "GET",
            url: "/api/Lead/GetLeadList",
            contentType: "application/json"
        });
    };

    list.DeleteLead = function (idlead) {
        return $http({
            method: "POST",
            url: "/api/Lead/DeleteLead?idlead=" + idlead,
            contentType: "application/json"
        });
    };




    list.SaveLeadAction = function (data) {
        return $http({
            method: "POST",
            url: "/api/Lead/SaveLeadAction",
            data: data,
            contentType: "application/json"
        });
    };

    list.GetLeadActionList = function () {
        return $http({
            method: "GET",
            url: "/api/Lead/GetLeadActionList",
            contentType: "application/json"
        });
    };

    list.GetLeadActionOnId = function (ileadid) {
        return $http({
            method: "GET",
            url: "/api/Lead/GetLeadActionOnId?ileadid=" + ileadid,
            contentType: "application/json"
        });
    };

    list.DeleteLeadAction = function (idlead) {
        return $http({
            method: "POST",
            url: "/api/Lead/DeleteLeadAction?idlead=" + idlead,
            contentType: "application/json"
        });
    };




    return list;

}]);
