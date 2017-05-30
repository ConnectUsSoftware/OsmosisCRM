angular.module('myApp.Controllers').controller('CaseCntrl', ['$scope', '$rootScope', '$http', 'CaseService', '$window', function ($scope, $rootScope, $http, CaseService, $window) {

    $scope.showAddLeadPanel = false;

    $scope.GetCaseList = function () {
        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        CaseService.GetCaseList().then(
            function successCallback(result) {
                swal.close();
                $("#dtCaseList").dataTable().fnDestroy();

                if (result.data.status == 1) {
                    var table = $('#dtCaseList').DataTable({
                        "aaData": result.data.Caselist,
                        "aoColumns": [
                            { "data": "customercode" },
                            { "data": "machinecode" },
                            { "data": "casetype" },
                            {
                                "data": "caseid",
                                "mRender": function (data, type, full) {
                                    return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='EditCase (" + JSON.stringify(full) + ")' ><i class='fa fa-edit'></i> Edit </a>";
                                }
                            },
                            {
                                "data": "caseid",
                                "render": function (data, type, row) {
                                    return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='DeleteCase(" + data + ")' ><i class='fa fa-trash-o'></i> Delete </a>";
                                }
                            }
                        ]
                    });
                }
                else {
                    var table = $('#dtCaseList').DataTable();
                    table.clear().draw();
                }

            }, function errorCallback(response) {
            });
    }

    var date = new Date();
    var month = date.getMonth() + 1;
    var ld = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

    $scope.objCase = { caseid: 0, followup: 'yes', scheduledate: ld, completed: 'no' };
    $scope.SaveCase = function (obj) {
        $scope.Casesubmitted = true;

        if ($scope.fmcase.$valid) {
            swal({
                title: "Please Wait...",
                text: "We are processing your request",
                showCancelButton: false,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
            });
            swal.showLoading(); swal.enableLoading();

            var d = new Date(obj.scheduledate.split("/").reverse().join("-"));
            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yy = d.getFullYear();

            //var fdt = new Date(from[2], from[1], from[0]);
            obj.scheduledate = yy + "/" + mm + "/" + dd

            CaseService.SaveCase(obj).then(
               function successCallback(result) {
                   swal.close();

                   if (result.data.status) {
                       $scope.ClearCase();
                       $scope.GetCaseList();
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

    $scope.ClearCase = function () {
        $scope.showAddLeadPanel = false;
        $scope.objCase = { caseid: 0, followup: 'yes', scheduledate: ld, completed: 'no' };

        $scope.Casesubmitted = false;
        $scope.fmcase.$setPristine();
    }

    $scope.EditCase = function (obj) {
        $scope.showAddLeadPanel = true;
        $scope.objCase = obj;

        var date = new Date(obj.scheduledate);
        var month = date.getMonth() + 1;
        $scope.objCase.scheduledate = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

        var time = new Date(obj.time);
        var formatteddatestr = moment(time).format('hh:mm a');
        $scope.objCase.time = formatteddatestr;

        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.$apply();
    }

    $scope.DeleteCase = function (id) {
        $scope.ClearCase();

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {

            CaseService.DeleteCase(id).then(
            function successCallback(result) {
                if (result.data.status) {
                    $scope.ClearLead();
                    $scope.GetLeadList();
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

    $(document).ready(function () {
        $('#time').timepicker();

    });
}
]);

