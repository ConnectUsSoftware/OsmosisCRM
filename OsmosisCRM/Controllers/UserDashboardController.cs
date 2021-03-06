﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using DataLayer;
using BusinessLayer;
using System.Web.Configuration;
using Microsoft.AspNet.Identity.Owin;
using System.Web;
using OsmosisCRM.Models;

namespace OsmosisCRM.Controllers
{
    public class UserDashboardController : ApiController
    {
        private readonly UserBll _UserBll;
        private readonly Machinebll _Machinebll;
        private readonly CaseBll _CaseBll;

        public UserDashboardController()
        {
            _UserBll = new UserBll(new DataLayer.OsmosisCRMEntities());
            _Machinebll = new Machinebll(new DataLayer.OsmosisCRMEntities());
            _CaseBll = new CaseBll(new DataLayer.OsmosisCRMEntities());
        }

        [HttpGet]
        public dynamic GetChartData()
        {
            try
            {
                string strCurrentUserId = User.Identity.GetUserId();
                ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());
                string scindex = Convert.ToString(user.cindex);

                customermain _customermain = _UserBll.GetUserList(scindex);
                machine _machine = _Machinebll.GetMachineOncustomercode(_customermain.customercode);

                if (_machine != null)
                {
                    string IDclient = _machine.machineid;
                    string mac = _machine.mac;

                    if (!string.IsNullOrEmpty(mac))
                    {
                        string _HoursData = "";
                        string _Hoursurl = "http://osmosishub.com/api/v1/loghour/?format=json&IDClient=" + IDclient + "&username=purifieruser&api_key=f3b937e2c60ccdecad8b5be716c40231983ce086&machinecode=" + mac + "&hours=8";
                        string _Dailyurl = "http://osmosishub.com/api/v1/logdaily/?format=json&IDClient=" + IDclient + "&username=purifieruser&api_key=f3b937e2c60ccdecad8b5be716c40231983ce086&machinecode=" + mac + "&days=7";
                        using (var client = new WebClient())
                        {
                            client.Headers.Add("content-type", "application/json");//
                            _HoursData = client.DownloadString(_Hoursurl);
                        }

                        string _DailyData = "";
                        using (var client = new WebClient())
                        {
                            client.Headers.Add("content-type", "application/json");//
                            _DailyData = client.DownloadString(_Dailyurl);
                        }

                        return new { status = 1, HoursData = _HoursData, DailyData = _DailyData };
                    }
                    else
                        return new { status = 0, msg = "no data" };
                }
                else
                    return new { status = 0, msg = "no data" };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpGet]
        public dynamic GetHistory()
        {
            try
            {
                string strCurrentUserId = User.Identity.GetUserId();
                ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());
                string sCode = Convert.ToString(user.cindex);
                customermain _customermain = _UserBll.GetUserList(sCode);

                return new { status = 1, Caselist = _CaseBll.GetCaseList(_customermain.customercode) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpGet]
        public dynamic GetUserOnId()
        {
            try
            {
                string strCurrentUserId = User.Identity.GetUserId();
                ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());
                string scindex = Convert.ToString(user.cindex);

                return new { status = 1, UserList = _UserBll.GetUserList(scindex) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic UpdateUser(customermain objUser)
        {
            try
            {

                if (_UserBll.SaveUser(objUser))
                {
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



    }
}
