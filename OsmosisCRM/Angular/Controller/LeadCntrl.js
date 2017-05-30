angular.module('myApp.Controllers').controller('LeadCntrl', ['$scope', '$rootScope', '$http', 'LeadService', '$window', function ($scope, $rootScope, $http, LeadService, $window) {

    $scope.showAddLeadPanel = false;

    $scope.GetLeadList = function () {
        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        LeadService.GetLeadList().then(
            function successCallback(result) {
                swal.close();
                $("#dtLeadList").dataTable().fnDestroy();

                if (result.data.status == 1) {
                    var table = $('#dtLeadList').DataTable({
                        "aaData": result.data.LeadList,
                        "aoColumns": [
                            { "data": "contactname" },
                            { "data": "email" },
                            { "data": "mobile" },
                            {
                                "data": "idlead",
                                "mRender": function (data, type, full) {
                                    return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='EditLead (" + JSON.stringify(full) + ")' ><i class='fa fa-edit'></i> Edit </a>";
                                }
                            },
                            {
                                "data": "idlead",
                                "render": function (data, type, row) {
                                    return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='DeleteLead(" + data + ")' ><i class='fa fa-trash-o'></i> Delete </a>";
                                }
                            }
                        ]
                    });
                }
                else {
                    var table = $('#dtLeadList').DataTable();
                    table.clear().draw();


                }

            }, function errorCallback(response) {
            });
    }

    var date = new Date();
    var month = date.getMonth() + 1;
    var ld = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

    $scope.objLead = { idlead: 0, customertype: 'home', leaddate: ld };
    $scope.SaveLead = function (obj) {
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

            var d = new Date(obj.leaddate.split("/").reverse().join("-"));
            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yy = d.getFullYear();

            //var fdt = new Date(from[2], from[1], from[0]);
            obj.leaddate = yy + "/" + mm + "/" + dd

            LeadService.SaveLead(obj).then(
               function successCallback(result) {
                   swal.close();

                   if (result.data.status) {
                       $scope.ClearLead();
                       $scope.GetLeadList();
                   }
                   else {
                       if (obj.idlead == 0)
                           swal('', 'Lead details not add successfully.', 'error');
                       else
                           swal('', 'Lead details not update successfully.', 'error');
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

    $scope.ClearLead = function () {
        $scope.showAddLeadPanel = false;
        $scope.objLead = { idlead: 0, customertype: 'home' };

        $scope.Leadsubmitted = false;
        $scope.fmLead.$setPristine();
    }

    $scope.EditLead = function (obj) {
        $scope.showAddLeadPanel = true;
        $scope.objLead = obj;

        var date = new Date(obj.leaddate);
        var month = date.getMonth() + 1;
        $scope.objLead.leaddate = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

        $("html, body").animate({ scrollTop: 0 }, "slow");

        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        LeadService.GetLeadActionOnId(obj.idlead).then(
           function successCallback(result) {
               swal.close();
               $("#dtLeadActionList").dataTable().fnDestroy();

               if (result.data.status == 1) {
                   debugger;
                   var table = $('#dtLeadActionList').DataTable({
                       "aaData": result.data.LeadActionList,
                       "aoColumns": [
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
                            { "data": "memo" }
                       ]
                   });
               }
               else {
                   var table = $('#dtLeadActionList').DataTable();
                   table.clear().draw();
               }

           }, function errorCallback(response) {
           });

        $scope.$apply();
    }

    $scope.DeleteLead = function (id) {
        $scope.ClearLead();

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {

            LeadService.DeleteLead(id).then(
            function successCallback(result) {
                if (result.data.status) {
                    $scope.ClearLead();
                    $scope.GetLeadList();
                }
                else {
                    swal({
                        title: 'Lead details Not Deleted ! ',
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

