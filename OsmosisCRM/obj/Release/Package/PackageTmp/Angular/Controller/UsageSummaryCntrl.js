angular.module('myApp.Controllers').controller('UsageSummaryCntrl', ['$scope', '$rootScope', '$http', 'UsageSummaryService', '$window', function ($scope, $rootScope, $http, UsageSummaryService, $window) {

    $scope.GetChartData = function () {

        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        UsageSummaryService.GetChartData().then(
            function successCallback(result) {
                swal.close();
                if (result.data.status == 1) {
                    $scope.ShownChart = true;


                    var data = JSON.parse(result.data.HoursData);
                    if (data != null) {

                        var hdata = [];

                        for (var i = 0; i < data.objects.length; i++) {
                            var time = new Date(data.objects[i].delta_liters);
                            var formatteddatestr = moment(time).format('hh:mm a');

                            hdata.push({ hour: formatteddatestr, delta_liters: data.objects[i].delta_liters });
                        }

                        if (data.objects.length > 0) {
                            $scope.ShowHourse = true;

                            var morris_Area = Morris.Area({
                                element: 'morris-area-chart',
                                data: hdata,
                                xkey: 'hour',
                                ykeys: ['delta_liters'],
                                labels: ['delta_liters'],
                                pointSize: 3,
                                fillOpacity: 0,
                                pointStrokeColors: ['#fdc006'],
                                behaveLikeLine: true,
                                gridLineColor: '#e0e0e0',
                                lineWidth: 1,
                                hideHover: 'auto',
                                lineColors: ['#fdc006'],
                                resize: true
                            });

                            setTimeout(function () { morris_Area.redraw(); }, 200);
                        }
                        else
                            $scope.ShowHourse = false;
                        var table = $('#dtHoursData').DataTable({
                            "aaData": hdata,
                            "aoColumns": [
                                { "data": "hour" },
                                { "data": "delta_liters" },
                            ]
                        });
                    }

                    var DailyDatadata = JSON.parse(result.data.DailyData);
                    if (DailyDatadata != null) {
                        var ddata = [];
                        for (var i = 0; i < DailyDatadata.objects.length; i++) {
                            ddata.push({ day: DailyDatadata.objects[i].day, delta_liters: DailyDatadata.objects[i].delta_liters });
                        }

                        if (DailyDatadata.objects.length > 0) {

                            $scope.ShowHDaily = true;

                            var morris_bar = Morris.Bar({
                                element: 'morris-bar-chart',
                                data: ddata,
                                xkey: 'day',
                                ykeys: ['delta_liters'],
                                labels: ['delta_liters'],
                                barColors: ['#b8edf0'],
                                hideHover: 'auto',
                                gridLineColor: '#eef0f2',
                                resize: true
                            });

                            setTimeout(function () { morris_bar.redraw(); }, 200);
                        }
                        else
                            $scope.ShowHDaily = false;

                        var table = $('#dtDailyData').DataTable({
                            "aaData": ddata,
                            "aoColumns": [
                                { "data": "day" },
                                { "data": "delta_liters" },
                            ]
                        });
                    }
                }
                else {
                    $scope.ShownChart = false;
                }

            }, function errorCallback(response) {
            });
    }

    $scope.GetHistory = function () {
        swal({
            title: "Please Wait...",
            text: "We are processing your request",
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
        });
        swal.showLoading(); swal.enableLoading();

        UsageSummaryService.GetHistory().then(
            function successCallback(result) {
                swal.close();
                $("#dtCaseList").dataTable().fnDestroy();

                if (result.data.status == 1) {
                    var table = $('#dtCaseList').DataTable({
                        "aaData": result.data.Caselist,
                        responsive: true,
                        "aoColumns": [
                            { "data": "machinecode", responsivePriority: 0 },
                            { "data": "casetype", responsivePriority: 1 },
                            { "data": "filterpack", responsivePriority: 2 },
                            {
                                "data": "scheduledate",
                                "mRender": function (data, type, full) {
                                    var d = new Date(data.split("/").reverse().join("-"));
                                    var dd = d.getDate();
                                    var mm = d.getMonth() + 1;
                                    var yy = d.getFullYear();

                                    mm = (mm.toString().length > 1 ? mm : "0" + mm)
                                    dd = (dd.toString().length > 1 ? dd : "0" + dd)

                                    return dd + "/" + mm + "/" + yy
                                }
                                , responsivePriority: 1
                            },
                            { "data": "problem", responsivePriority: 3 },
                            { "data": "suggest", responsivePriority: 4 },
                            { "data": "remarks", responsivePriority: 5 },
                            { "data": "completed", responsivePriority: 6 }
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

}
]);

