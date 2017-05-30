angular.module('myApp.Controllers').controller('UsageSummaryCntrl', ['$scope', '$rootScope', '$http', 'UsageSummaryService', '$window', function ($scope, $rootScope, $http, UsageSummaryService, $window) {

    $scope.GetCurretUser = function () {

        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();


        UsageSummaryService.GetCurrentUser().then(
            function successCallback(result) {
                swal.close();
                debugger;
                if (result.data.status == 1) {
                    debugger;
                    $scope.objUser = result.data.CurrentUser;
                    $scope.objMachine = result.data.UserMachines;

                    if ($scope.objMachine != null) {
                        var IDclient = $scope.objMachine.machineid;
                        var mac = $scope.objMachine.mac;

                        var _url = 'http://osmosishub.com/api/v1/loghour/?format=json&IDClient=' + IDclient + '&username=purifieruser&api_key=f3b937e2c60ccdecad8b5be716c40231983ce086&machinecode=' + mac + '&hours=8';

                        var jsonData = $.ajax({
                            url: _url,
                            dataType: 'json',
                        }).done(function (results) {
                            debugger;

                        });
                    }

                }
                else {
                }

            }, function errorCallback(response) {
            });

    }



}
]);

