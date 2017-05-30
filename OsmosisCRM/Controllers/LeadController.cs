using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataLayer;
using BusinessLayer;
using Microsoft.AspNet.Identity;
using OsmosisCRM.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Web;


namespace OsmosisCRM.Controllers
{
    public class LeadController : ApiController
    {
        private readonly Leadbll _LeadBll;

        public LeadController()
        {
            _LeadBll = new Leadbll(new DataLayer.OsmosisCRMEntities());
        }


        [HttpGet]
        public dynamic GetLeadList()
        {
            try
            {
                string strCurrentUserId = User.Identity.GetUserId();
                ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());

                return new { status = 1, LeadList = _LeadBll.GetLeadList() };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic SaveLead(lead objLead)
        {
            try
            {
                return new { status = _LeadBll.SaveLead(objLead) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic DeleteLead(int idlead)
        {
            try
            {
                return new { status = _LeadBll.DeleteLead(idlead) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpGet]
        public dynamic GetLeadActionList()
        {
            try
            {
                return new { status = 1, LeadActionList = _LeadBll.GetLeadActionList() };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpGet]
        public dynamic GetLeadActionOnId(int ileadid)
        {
            try
            {
                return new { status = 1, LeadActionList = _LeadBll.GetLeadActionOnId(ileadid) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic SaveLeadAction(leadaction objLeadAction)
        {
            try
            {
                return new { status = _LeadBll.SaveLeadAction(objLeadAction) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic DeleteLeadAction(int ileadactionid)
        {
            try
            {
                return new { status = _LeadBll.DeleteLeadAction(ileadactionid) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }


    }


}
