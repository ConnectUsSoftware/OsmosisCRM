angular.module('myApp.Controllers').controller('LoginCntrl', ['$scope', '$rootScope', '$http', 'LoginService', '$window', function ($scope, $rootScope, $http, LoginService, $window) {

    $scope.getParameterByName = function (name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $scope.User = {};
    $scope.objUser = { customercode: '', invitationcode: '' }

    $scope.Invalid = false;
    $scope.UserEnterData = false;
    $scope.ShowLoader = false;

    $scope.GetUserDetails = function () {
        var ccode = $scope.objUser.customercode;
        var icode = $scope.objUser.invitationcode;

        if (ccode != undefined && icode != undefined) {
            $scope.ShowLoader = true;
            LoginService.GetUserDetailsOnCustomerCodeAndInvitationCode(ccode, icode).then(
                function successCallback(result) {
                    $scope.ShowLoader = false;
                    if (result.data.status == 1) {
                        if (result.data.UserList.length > 0) {
                            $scope.objUser = result.data.UserList[0];
                            $scope.Invalid = false;
                            $scope.UserEnterData = true;
                        }
                        else {
                            $scope.Invalid = true;
                            $scope.UserEnterData = false;
                        }
                    }
                    else {
                        $scope.Invalid = true;
                        $scope.UserEnterData = false;
                    }

                }, function errorCallback(response) {
                });
        }
    }

    $scope.SignUp = function (obj) {
        $scope.Usersubmitted = true;

        if ($scope.loginform.$valid) {
            if ($scope.UserEnterData) {
                swal({
                    title: "Please Wait...",
                    text: "We are processing your request",
                    showCancelButton: false,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                });
                swal.showLoading(); swal.enableLoading();

                LoginService.SaveUserPassword(obj.cindex, obj.CustomerPassword, obj.email, obj.contactname).then(
                   function successCallback(result) {
                       swal.close();
                       if (result.data.status == 1) {

                           swal({
                               title: '',
                               text: "You are successfully registered, Please check your email for confirmation.",
                               type: 'success',
                               showCancelButton: false,
                               confirmButtonColor: '#3085d6',
                               confirmButtonText: 'Ok'
                           }).then(function () {
                               window.location.href = '/Account/Index';
                           })
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
            else
                return;
        }
        else {
            return false;
        }



    }

    $scope.Load = function () {
        var type = $scope.getParameterByName("type");
        if (type != null) {
            if (type == "c") {

                var id = $scope.getParameterByName("id");

                swal({
                    title: "Please Wait...",
                    text: "We are processing your request",
                    showCancelButton: false,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                });
                swal.showLoading(); swal.enableLoading();

                LoginService.ConfirmAccount(id).then(
                   function successCallback(result) {
                       debugger;
                       swal.close();

                       if (result.data == "True") {
                           swal('', 'Your account has been confirmed.', 'success');

                       }
                       else {
                           swal('', 'Your account has been not confirmed.', 'error');
                       }

                   }, function errorCallback(response) {
                       if (response.statusText == 'Unauthorized') {
                       }
                   });
            }

        }
    }

    $scope.GetRegisterDetails = function () {


        $scope.objUser.customercode = $scope.getParameterByName("ccode");
        $scope.objUser.invitationcode = $scope.getParameterByName("icode");

        $scope.GetUserDetails();
    }

}
]);

