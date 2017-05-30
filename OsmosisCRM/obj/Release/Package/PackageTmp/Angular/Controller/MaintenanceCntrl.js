angular.module('myApp.Controllers').controller('MaintenanceCntrl', ['$scope', '$rootScope', '$http', 'MaintenanceService', '$window', function ($scope, $rootScope, $http, MaintenanceService, $window) {

    $scope.showAddLeadPanel = false;

    $scope.GetMaintenanceList = function () {
        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        MaintenanceService.GetMaintenanceList().then(
            function successCallback(result) {
                swal.close();
                $("#dtMaintenanceList").dataTable().fnDestroy();

                if (result.data.status == 1) {
                    var table = $('#dtMaintenanceList').DataTable({
                        "aaData": result.data.Caselist,
                        "aoColumns": [
                            { "data": "customercode" },
                            { "data": "maincheck" },
                            { "data": "machineid" },
                            {
                                "data": "mainid",
                                "mRender": function (data, type, full) {
                                    return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='EditCase (" + JSON.stringify(full) + ")' ><i class='fa fa-edit'></i> Edit </a>";
                                }
                            },
                            {
                                "data": "mainid",
                                "render": function (data, type, row) {
                                    return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='DeleteCase(" + data + ")' ><i class='fa fa-trash-o'></i> Delete </a>";
                                }
                            }
                        ]
                    });
                }
                else {
                    var table = $('#dtMaintenanceList').DataTable();
                    table.clear().draw();
                }

            }, function errorCallback(response) {
            });
    }

    var date = new Date();
    var month = date.getMonth() + 1;
    var ld = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

    $scope.objmainpack = { mainid: 0, start: ld, end: ld };
    $scope.Savemaintenance = function (obj) {
        $scope.maintenancesubmitted = true;

        if ($scope.fmMainpack.$valid) {
            swal({
                title: "Please Wait...",
                text: "We are processing your request",
                showCancelButton: false,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
            });
            swal.showLoading(); swal.enableLoading();

            var d = new Date(obj.start.split("/").reverse().join("-"));
            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yy = d.getFullYear();

            obj.start = yy + "/" + mm + "/" + dd


            var ed = new Date(obj.end.split("/").reverse().join("-"));
            var edd = ed.getDate();
            var emm = ed.getMonth() + 1;
            var eyy = ed.getFullYear();

            obj.end = eyy + "/" + emm + "/" + edd

            MaintenanceService.SaveMaintenance(obj).then(
               function successCallback(result) {
                   swal.close();

                   if (result.data.status) {
                       $scope.ClearMaintenance();
                       $scope.GetMaintenanceList();
                   }
                   else {
                       if (obj.caseid == 0)
                           swal('', 'Case details not add successfully.', 'error');
                       else
                           swal('', 'Case details not update successfully.', 'error');
                   }

               }, function errorCallback(response) {
                   if (response.statusText == 'Unauthorized') {
                   }
               });

        }
        else {
            return false;
        }

        return false;
    }

    $scope.ClearMaintenance = function () {
        $scope.showAddLeadPanel = false;
        $scope.objmainpack = { mainid: 0, start: ld, end: ld };

        $scope.maintenancesubmitted = false;
        $scope.fmMainpack.$setPristine();
    }

    $scope.EditMaintenance = function (obj) {
        $scope.showAddLeadPanel = true;
        $scope.objmainpack = obj;

        var date = new Date(obj.start);
        var month = date.getMonth() + 1;
        $scope.objmainpack.start = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

        var date2 = new Date(obj.end);
        var month2 = date.getMonth() + 1;
        $scope.objmainpack.end = date2.getDate() + "/" + (month2.length > 1 ? month : "0" + month2) + "/" + date2.getFullYear();


        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.$apply();
    }

    $scope.DeleteMaintenance = function (id) {
        $scope.ClearMaintenance();

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {

            MaintenanceService.DeleteMaintenance(id).then(
            function successCallback(result) {
                if (result.data.status) {
                    $scope.ClearMaintenance();
                    $scope.GetMaintenanceList();
                }
                else {
                    swal({
                        title: 'Case details Not Deleted ! ',
                        text: "",
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok'
                    }).then(function () {
                    })
                }
            }, function errorCallback(response) {

            });
        })
    }


}
]);

