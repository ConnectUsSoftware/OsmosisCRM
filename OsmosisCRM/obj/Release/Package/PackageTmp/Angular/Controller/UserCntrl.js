angular.module('myApp.Controllers').controller('UserCntrl', ['$scope', '$rootScope', '$http', 'UserService', '$window', function ($scope, $rootScope, $http, UserService, $window) {


    $scope.showAddUserPanel = false;

    $scope.GetUserList = function () {
        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        UserService.GetUserList().then(
            function successCallback(result) {
                swal.close();

                $("#dtUserList").dataTable().fnDestroy();

                if (result.data.status == 1) {
                    var table = $('#dtUserList').DataTable({

                        "aaData": result.data.UserList,
                        responsive: true,
                        "aoColumns": [
                            { "data": "contactname", "sWidth": "250px" },
                            { "data": "email", "sWidth": "150px" },
                            { "data": "customercode", "sWidth": "70px" },
                            { "data": "contactno", "sWidth": "250px" },
                            { "data": "mobile", "sWidth": "250px" },
                            { "data": "billingaddress", "sWidth": "250px" }
                            //{
                            //    "data": "cindex",
                            //    "sWidth": "100px",
                            //    "render": function (data, type, row) {
                            //        return "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='SendMail(" + data + ")' ><i class='fa fa-envelope'></i> Send Invitation </a>";
                            //    }
                            //},
                            //{
                            //    "data": "cindex",
                            //    "sWidth": "100px",
                            //    "mRender": function (data, type, full) {
                            //        var template = "<a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='EditUser(" + JSON.stringify(full) + ")' ><i class='fa fa-edit'></i> Edit </a>";
                            //        template = template + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a class='btn btn-outline btn-circle btn-sm purple' href='javascript:void(0)' onclick='DeleteUser(" + data + ")' ><i class='fa fa-trash-o'></i> Delete </a>";

                            //        return template;
                            //    }
                            //},

                        ]
                    });

                    $('#dtUserList tbody').on('dblclick', 'tr', function () {
                        var data = table.row(this).data();
                        var id = data.cindex;
                        window.location.href = '/Admin/EditUser?uid=' + id;

                    });
                }
                else {
                    var table = $('#dtUserList').DataTable();
                    table.clear().draw();


                }

            }, function errorCallback(response) {
            });
    }



    var date = new Date();
    var month = date.getMonth() + 1;
    var jd = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

    $scope.objUser = { cindex: 0, customer_type: 'home', joindate: jd };
    $scope.SaveUser = function (obj) {
        $scope.Usersubmitted = true;

        if ($scope.frmUser.$valid) {
            swal({
                title: "Please Wait...",
                text: "We are processing your request",
                showCancelButton: false,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
            });
            swal.showLoading(); swal.enableLoading();

            var d = new Date(obj.joindate.split("/").reverse().join("-"));
            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yy = d.getFullYear();

            //var fdt = new Date(from[2], from[1], from[0]);
            obj.joindate = yy + "/" + mm + "/" + dd

            UserService.AddUser(obj).then(
               function successCallback(result) {
                   swal.close();

                   if (result.data.status == -1) {
                       swal('', 'Customer code already exist with same name.', 'info');
                       return;
                   }
                   else if (result.data.status) {
                       if (obj.cindex == 0) {
                           $scope.ClearUser();
                           $scope.GetUserList();
                       }
                       else {
                           window.location.href = '/Admin/UserMaster';
                       }
                   }
                   else {
                       if (obj.cindex == 0)
                           swal('', 'User details not add successfully.', 'error');
                       else
                           swal('', 'User details not update successfully.', 'error');
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

    $scope.ClearUser = function () {
        $scope.showAddUserPanel = false;
        $scope.objUser = { cindex: 0, customer_type: 'home' };

        $scope.Usersubmitted = false;
        $scope.frmUser.$setPristine();
    }

    $scope.EditUser = function (obj) {

        var id = obj.cindex;
        window.location.href = '/Admin/EditUser?uid=' + id;

        return;
        $scope.showAddUserPanel = true;
        $scope.objUser = obj;

        var date = new Date(obj.joindate);
        var month = date.getMonth() + 1;
        $scope.objUser.joindate = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();

        $("html, body").animate({ scrollTop: 0 }, "slow");

        $scope.$apply();
    }

    $scope.DeleteUser = function (id) {
        $scope.ClearUser();

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {

            swal({
                title: "Please Wait...",
                text: "We are processing your request",
                showCancelButton: false,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
            });
            swal.showLoading(); swal.enableLoading();

            UserService.DeleteUser(id).then(
            function successCallback(result) {
                if (result.data.status) {
                    $scope.ClearUser();
                    $scope.GetUserList();
                }
                else {
                    swal({
                        title: 'User details Not Deleted ! ',
                        text: "",
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok'
                    }).then(function () {
                    })
                }
            }, function errorCallback(response) {
                if (response.statusText == 'Unauthorized') {
                    window.location.href = '/Unauthrize/Index'
                }
            });
        })


    }

    $scope.SendMail = function (id) {
        $scope.ClearUser();
        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        UserService.SendInvitationEmail(id).then(
        function successCallback(result) {
            swal.close();

            if (result.data.status) {
                swal('', 'Invitation email send successfully.', 'success');
            }
            else {
                swal({
                    title: 'Invitation email not send successfully ! ',
                    text: "",
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then(function () {
                })

            }
        }, function errorCallback(response) {
            if (response.statusText == 'Unauthorized') {
                window.location.href = '/Unauthrize/Index'
            }
        });

    }


    function getParameterByName(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $scope.GetUserdata = function () {
        var usid = 0;
        usid = getParameterByName("uid");

        if (usid !== null) {
            swal({
                title: "Please Wait...",
                text: "We are processing your request",
                showCancelButton: false,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
            });
            swal.showLoading(); swal.enableLoading();

            UserService.GetUserOnId(usid).then(
                function successCallback(result) {
                    swal.close();

                    if (result.data.status == 1) {
                        $scope.objUser = result.data.UserList;

                        var date = new Date(result.data.UserList.joindate);
                        var month = date.getMonth() + 1;
                        $scope.objUser.joindate = date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();
                    }
                    else {
                    }

                }, function errorCallback(response) {
                });
        }
    }

}
]);

