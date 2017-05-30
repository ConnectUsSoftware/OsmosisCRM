angular.module("myApp.Services").service('MachineService', ["$http", function ($http) {
    var list = {};

    list.SaveMachine = function (data) {
        return $http({
            method: "POST",
            url: "/api/Machine/SaveMachine",
            data: data,
            contentType: "application/json"
        });
    };

    list.GetMachineList = function () {
        return $http({
            method: "GET",
            url: "/api/Machine/GetMachineList",
            contentType: "application/json"
        });
    };

    list.DeleteMachine = function (mid) {

        return $http({
            method: "POST",
            url: "/api/Machine/DeleteMachine?mid=" + mid,
            contentType: "application/json"
        });
    };

    return list;

}]);
