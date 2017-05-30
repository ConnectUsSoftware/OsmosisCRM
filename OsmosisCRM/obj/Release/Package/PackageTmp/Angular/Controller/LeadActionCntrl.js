angular.module('myApp.Controllers').controller('LeadActionCntrl', ['$scope', '$rootScope', '$http', 'LeadService', '$window', function ($scope, $rootScope, $http, LeadService, $window) {

    $scope.showAddLeadPanel = false;

    $scope.LeadList = [];
    $scope.GetLeadList = function () {
        LeadService.GetLeadList().then(
            function successCallback(result) {
                swal.close();
                if (result.data.status == 1) {
                    $scope.LeadList = result.data.LeadList;
                }
            }, function errorCallback(response) {
            });
    }


    $scope.GetLeadActionList = function () {
        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        LeadService.GetLeadActionList().then(
            function successCallback(result) {
                swal.close();
                $("#dtLeadActionList").dataTable().fnDestroy();

                if (result.data.status == 1) {
                    var table = $('#dtLeadActionList').DataTable({
                        "aaData": result.data.LeadActionList,
                        "aoColumns": [

                             { "data": "contactname" },
                           { "data": "actiontype" },
                           {
                               "data": "nextdate",
                               "mRender": function (data, type, full) {
                                   var d = new Date(data.split("/").reverse().join("-"));
                                   var dd = d.getDate();
                                   var mm = d.getMonth() + 1;
                                   var yy = d.getFullYear();

                                   mm = (mm.toString().length > 1 ? mm : "0" + mm)
                                   dd = (dd.toString().length > 1 ? dd : "0" + dd)

                                   return dd + "/" + mm + "/" + yy

                                   //return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='EditLeadAction (" + JSON.stringify(full) + ")' ><i class='fa fa-edit'></i> Edit </a>";
                               }
                           },
                           {
                               "data": "leadactionid",
                               "mRender": function (data, type, full) {
                                   return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='EditLeadAction (" + JSON.stringify(full) + ")' ><i class='fa fa-edit'></i> Edit </a>";
                               }
                           },
                           {
                               "data": "leadactionid",
                               "render": function (data, type, row) {
                                   return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='DeleteLeadAction(" + data + ")' ><i class='fa fa-trash-o'></i> Delete </a>";
                               }
                           }

                        ]
                    });
                }
                else {
                    var table = $('#dtLeadActionList').DataTable();
                    table.clear().draw();
                }

            }, function errorCallback(response) {
            });
    }

    var date = new Date();
    var month = date.getMonth() + 1;
    var ld = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

    $scope.objLead = { idlead: 0, customertype: 'home', nextdate: ld };
    $scope.SaveLeadAction = function (obj) {
        $scope.Leadsubmitted = true;

        if ($scope.fmLead.$valid) {
            swal({
                title: "Please Wait...",
                text: "We are processing your request",
                showCancelButton: false,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
            });
            swal.showLoading(); swal.enableLoading();

            var d = new Date(obj.nextdate.split("/").reverse().join("-"));
            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yy = d.getFullYear();

            //var fdt = new Date(from[2], from[1], from[0]);
            obj.nextdate = yy + "/" + mm + "/" + dd

            LeadService.SaveLeadAction(obj).then(
               function successCallback(result) {
                   swal.close();

                   if (result.data.status) {
                       $scope.ClearLeadAction();
                       $scope.GetLeadActionList();
                   }
                   else {
                       if (obj.idlead == 0)
                           swal('', 'Lead action details not add successfully.', 'error');
                       else
                           swal('', 'Lead action details not update successfully.', 'error');
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

    $scope.ClearLeadAction = function () {
        $scope.showAddLeadPanel = false;
        $scope.objLead = { leadactionid: 0 };

        $scope.Leadsubmitted = false;
        $scope.fmLead.$setPristine();
    }

    $scope.EditLeadAction = function (obj) {
        $scope.showAddLeadPanel = true;
        $scope.objLead = obj;

        var date = new Date(obj.nextdate);
        var month = date.getMonth() + 1;
        $scope.objLead.nextdate = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

        $("html, body").animate({ scrollTop: 0 }, "slow");

        $scope.$apply();
    }

    $scope.DeleteLeadAction = function (id) {
        $scope.ClearLeadAction();

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {

            LeadService.DeleteLeadAction(id).then(
            function successCallback(result) {
                if (result.data.status) {
                    $scope.ClearLeadAction();
                    $scope.GetLeadActionList();
                }
                else {
                    swal({
                        title: 'Lead action details Not Deleted ! ',
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

