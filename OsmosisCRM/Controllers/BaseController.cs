using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataLayer;
using BusinessLayer;
using System.Configuration;

namespace OsmosisCRM.Controllers
{
    public class BaseController : ApiController
    {
        private readonly UserBll _UserBll;

        public BaseController()
        {
            _UserBll = new UserBll(new DataLayer.OsmosisCRMEntities());
        }

        [HttpGet]
        public dynamic GetUserDetailsOnCustomerCodeAndInvitationCode(string CustomerCode, string InvitationCode)
        {
            try
            {
                return new { status = 1, UserList = _UserBll.GetUserDetailsOnCustomerCodeAndInvitationCode(CustomerCode, InvitationCode) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic SaveUserPassword(int cindex, string CustomerPassword, string email, string contactname)
        {
            try
            {
                if (_UserBll.SaveUserPassword(cindex, CustomerPassword, email, contactname))
                {
                    // Send Confirm password
                    EncryptController e = new EncryptController();
                    var EncID = e.EncryptValue(cindex.ToString());
                    var lstUser = _UserBll.GetUserList(cindex.ToString());

                    string Path = ConfigurationSettings.AppSettings["Path"];
                    string Html = System.IO.File.ReadAllText(System.Web.HttpContext.Current.Server.MapPath("~/EmailTemplate/ConfirmUser.html"));
                    Html = Html.Replace("#Name", lstUser.contactname);
                    Html = Html.Replace("#link", "<a href ='" + Path + "/Account/Index?type=c&id=" + EncID + "' class='btn-primary'>Confirm Account</a>");

                    bool bisSend = MailHelper.SendMail(lstUser.email, "", "Confirm Account for osmosis.com.hk", Html);

                    return new { status = 1, message = "Invalid data " };
                }
                else
                    return new { status = 0 };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

    }
}
