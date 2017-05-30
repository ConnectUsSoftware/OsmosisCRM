angular.module("myApp.Services").service('LoginService', ["$http", function ($http) {
    var list = {};

    list.GetUserDetailsOnCustomerCodeAndInvitationCode = function (CustomerCode, InvitationCode) {
        return $http({
            method: "GET",
            url: "/api/Base/GetUserDetailsOnCustomerCodeAndInvitationCode?CustomerCode=" + CustomerCode + "&InvitationCode=" + InvitationCode,
            contentType: "application/json"
        });
    };

    list.SaveUserPassword = function (cindex, CustomerPassword, email, contactname) {
        return $http({
            method: "POST",
            url: "/api/Base/SaveUserPassword?cindex=" + cindex + "&CustomerPassword=" + CustomerPassword + "&email=" + email + "&contactname=" + contactname,
            contentType: "application/json"
        });
    };

    list.ConfirmAccount = function (id) {
        return $http({
            method: "POST",
            url: "/Account/ConfirmUser?id=" + id,
            contentType: "application/json"
        });
    };

    return list;

}]);
