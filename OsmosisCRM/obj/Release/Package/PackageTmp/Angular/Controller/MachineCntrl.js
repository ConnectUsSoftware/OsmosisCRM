angular.module('myApp.Controllers').controller('MachineCntrl', ['$scope', '$rootScope', '$http', 'MachineService', 'UserService', '$window', function ($scope, $rootScope, $http, MachineService, UserService, $window) {

    $scope.showAddLeadPanel = false;

    $scope.UserList = [];
    $scope.GetUserList = function () {
        UserService.GetUserList().then(
            function successCallback(result) {
                swal.close();
                if (result.data.status == 1) {
                    $scope.UserList = result.data.UserList;
                }
                else {
                }

            }, function errorCallback(response) {
            });
    }


    $scope.GetMachineList = function () {
        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        MachineService.GetMachineList().then(
            function successCallback(result) {
                swal.close();
                $("#dtMachineList").dataTable().fnDestroy();

                if (result.data.status == 1) {
                    var table = $('#dtMachineList').DataTable({
                        "aaData": result.data.MachineList,
                        "aoColumns": [
                            { "data": "machineid" },
                            { "data": "customercode" },
                            { "data": "machinetype" },
                            {
                                "data": "mid",
                                "mRender": function (data, type, full) {
                                    return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='EditMachine(" + JSON.stringify(full) + ")' ><i class='fa fa-edit'></i> Edit </a>";
                                }
                            },
                            {
                                "data": "mid",
                                "render": function (data, type, row) {
                                    return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='DeleteMachinee(" + data + ")' ><i class='fa fa-trash-o'></i> Delete </a>";
                                }
                            }
                        ]
                    });
                }
                else {
                    var table = $('#dtMachineList').DataTable();
                    table.clear().draw();
                }

            }, function errorCallback(response) {
            });
    }

    var date = new Date();
    var month = date.getMonth() + 1;
    var ld = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

    $scope.objMachine = { mid: 0, installdate: ld, nextdate: ld };
    $scope.SaveMachine = function (obj) {
        $scope.machinesubmitted = true;

        if ($scope.fmMachine.$valid) {
            swal({
                title: "Please Wait...",
                text: "We are processing your request",
                showCancelButton: false,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
            });
            swal.showLoading(); swal.enableLoading();

            debugger;
            var d = new Date(obj.installdate.split("/").reverse().join("-"));
            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yy = d.getFullYear();

            obj.installdate = yy + "/" + mm + "/" + dd;

            var nd = new Date(obj.nextdate.split("/").reverse().join("-"));
            var ndd = nd.getDate();
            var nmm = nd.getMonth() + 1;
            var nyy = nd.getFullYear();

            obj.nextdate = nyy + "/" + nmm + "/" + ndd;

            MachineService.SaveMachine(obj).then(
               function successCallback(result) {
                   swal.close();

                   if (result.data.status) {
                       $scope.ClearMachine();
                       $scope.GetMachineList();
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

    $scope.ClearMachine = function () {
        $scope.showAddLeadPanel = false;
        $scope.objMachine = { mid: 0, installdate: ld, nextdate: ld };

        $scope.machinesubmitted = false;
        $scope.fmMachine.$setPristine();
    }

    $scope.EditMachine = function (obj) {
        $scope.showAddLeadPanel = true;
        $scope.objMachine = obj;

        var date = new Date(obj.installdate);
        var month = date.getMonth() + 1;
        $scope.objMachine.installdate = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

        var ndate = new Date(obj.nextdate);
        var nmonth = ndate.getMonth() + 1;
        $scope.objMachine.nextdate = ndate.getDate() + "/" + (nmonth.length > 1 ? nmonth : "0" + nmonth) + "/" + ndate.getFullYear();

        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.$apply();
    }

    $scope.DeleteMachinee = function (id) {
        $scope.ClearMachine();

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {

            MachineService.DeleteMachine(id).then(
            function successCallback(result) {
                if (result.data.status) {
                    $scope.ClearMachine();
                    $scope.GetMachineList();
                }
                else {
                    swal({
                        title: 'Machine details Not Deleted ! ',
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

