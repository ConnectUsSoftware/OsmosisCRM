using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataLayer;
using BusinessLayer;
using System.Web.Configuration;

namespace OsmosisCRM.Controllers
{
    public class UserController : ApiController
    {
        private readonly UserBll _UserBll;

        //dsdsdsd chanve fdfdfd

        public UserController()
        {
            _UserBll = new UserBll(new DataLayer.OsmosisCRMEntities());
        }

        [HttpGet]
        public dynamic GetUserList()
        {
            try
            {
                return new { status = 1, UserList = _UserBll.GetUserList() };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpGet]
        public dynamic GetUserOnId(int cindex)
        {
            try
            {
                return new { status = 1, UserList = _UserBll.GetUserList(cindex.ToString()) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic SaveUser(customermain objUser)
        {
            try
            {
                bool IsAdd = false;
                if (objUser.cindex == 0)
                    IsAdd = true;

                if (objUser.cindex == 0)
                {
                    // Chekc Customer Code is duplicate or not
                    if (_UserBll.CheckCustomerCode(objUser.customercode))
                    {
                        return new { status = -1 };
                    }

                    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    Random random = new Random();
                    string sInvitationCode = new string(Enumerable.Repeat(chars, 5).Select(s => s[random.Next(s.Length)]).ToArray());
                    objUser.invitationcode = sInvitationCode;
                }

                if (_UserBll.SaveUser(objUser))
                {
                    //if (IsAdd)
                    //{
                    //    string Html = System.IO.File.ReadAllText(System.Web.HttpContext.Current.Server.MapPath("~/EmailTemplate/subscriptionLink.html"));
                    //    Html = Html.Replace("#Name", objUser.contactname);
                    //    Html = Html.Replace("#customerCode", objUser.customercode);
                    //    Html = Html.Replace("#invitationcode", objUser.invitationcode);


                    //    string sPath = WebConfigurationManager.AppSettings["Path"] + "/Account/Register?ccode=" + objUser.customercode + "&icode=" + objUser.invitationcode;
                    //    string sbtn = "<a href='" + sPath + "' class='btn-primary'> Click here to register here </a>";
                    //    Html = Html.Replace("#registerbtn", sbtn);

                    //    return new { status = MailHelper.SendMail(objUser.email, "", "Invitation Request", Html) };
                    //}
                    //else
                    return new { status = true };
                }
                else
                    return new { status = 0 };

            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic DeleteUser(int UserMasterID)
        {
            try
            {
                return new { status = _UserBll.DeleteUser(UserMasterID) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic SendInvitationEmail(int UserMasterID)
        {
            try
            {
                customermain objUser = _UserBll.GetUserList(UserMasterID.ToString());

                string Html = System.IO.File.ReadAllText(System.Web.HttpContext.Current.Server.MapPath("~/EmailTemplate/subscriptionLink.html"));
                Html = Html.Replace("#Name", objUser.contactname);
                Html = Html.Replace("#customerCode", objUser.customercode);
                Html = Html.Replace("#invitationcode", objUser.invitationcode);


                string sPath = WebConfigurationManager.AppSettings["Path"] + "/Account/Register?ccode=" + objUser.customercode + "&icode=" + objUser.invitationcode;
                string sbtn = "<a href='" + sPath + "' class='btn-primary'> Click here to register</a>";
                Html = Html.Replace("#registerbtn", sbtn);

                return new { status = MailHelper.SendMail(objUser.email, "", "Osmosis Invitation Request", Html) };

            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

    }
}
