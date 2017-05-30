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
    public class MaintenanceController : ApiController
    {
        private readonly mainpackbll _mainpackbll;

        public MaintenanceController()
        {
            _mainpackbll = new mainpackbll(new DataLayer.OsmosisCRMEntities());
        }

        [HttpGet]
        public dynamic GetMaintenanceList()
        {
            try
            {
                return new { status = 1, MaintenanceList = _mainpackbll.GetMaintenanceList() };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic SaveMaintenance(mainpack objmainpack)
        {
            try
            {

                if (_mainpackbll.SaveMaintenance(objmainpack))
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
        public dynamic DeleteMaintenance(int mainid)
        {
            try
            {
                return new { status = _mainpackbll.DeleteMaintenance(mainid) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

    }
}
