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
    public class MachineController : ApiController
    {
        private readonly Machinebll _Machinebll;

        public MachineController()
        {
            _Machinebll = new Machinebll(new DataLayer.OsmosisCRMEntities());
        }

        [HttpGet]
        public dynamic GetMachineList()
        {
            try
            {
                return new { status = 1, MachineList = _Machinebll.GetMachineList() };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic SaveMachine(machine objMachine)
        {
            try
            {
                return new { status = _Machinebll.SaveMachine(objMachine) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }

        [HttpPost]
        public dynamic DeleteMachine(int mid)
        {
            try
            {
                return new { status = _Machinebll.DeleteMachine(mid) };
            }
            catch (Exception ex)
            {
                return new { status = 0, message = ex.Message };
            }
        }


    }
}
