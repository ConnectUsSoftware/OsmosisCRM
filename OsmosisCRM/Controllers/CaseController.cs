using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataLayer;
using BusinessLayer;

namespace OsmosisCRM.Controllers
{
    public class CaseController : ApiController
    {
        private readonly CaseBll _CaseBll;
        public CaseController()
        {
            _CaseBll = new CaseBll(new DataLayer.OsmosisCRMEntities());
        }

        [HttpGet]
        public dynamic GetCaseList()
        {
            try
            {
                return new { status = 1, Caselist = _CaseBll.GetCaseList() };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic SaveCase(@case objCase)
        {
            try
            {

                if (_CaseBll.SaveCash(objCase))
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

        [HttpPost]
        public dynamic DeleteCase(int caseid)
        {
            try
            {
                return new { status = _CaseBll.DeleteCase(caseid) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

    }
}
