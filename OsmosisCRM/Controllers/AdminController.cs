using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OsmosisCRM.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        //
        // GET: /Admin/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult UserMaster()
        {
            return View();
        }

        public ActionResult LeadMaster()
        {
            return View();
        }

        public ActionResult LeadAction()
        {
            return View();
        }

        public ActionResult CaseMaster()
        {
            return View();
        }

        public ActionResult machineMaster()
        {
            return View();
        }

        public ActionResult maintenance()
        {
            return View();
        }

        public ActionResult EditUser()
        {
            return View();
        }


    }
}
