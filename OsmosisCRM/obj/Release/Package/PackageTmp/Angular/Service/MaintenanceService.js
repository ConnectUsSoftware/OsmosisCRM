angular.module("myApp.Services").service('MaintenanceService', ["$http", function ($http) {
    var list = {};

    list.SaveMaintenance = function (data) {
        return $http({
            method: "POST",
            url: "/api/Maintenance/SaveMaintenance",
            data: data,
            contentType: "application/json"
        });
    };

    list.GetMaintenanceList = function () {
        return $http({
            method: "GET",
            url: "/api/Maintenance/GetMaintenanceList",
            contentType: "application/json"
        });
    };

    list.DeleteMaintenance = function (mainid) {
        return $http({
            method: "POST",
            url: "/api/Maintenance/DeleteMaintenance?mainid=" + mainid,
            contentType: "application/json"
        });
    };

    return list;

}]);
