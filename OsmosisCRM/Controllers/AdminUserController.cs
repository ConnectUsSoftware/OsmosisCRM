using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace OsmosisCRM.Controllers
{
    [Authorize(Roles = "User")]
    public class AdminUserController : Controller
    {
        //
        // GET: /AdminUser/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Logout()
        {
            var AutheticationManager = HttpContext.GetOwinContext().Authentication;
            AuthenticationManager.SignOut();

            return RedirectToAction("Index", "Account");
        }

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        public ActionResult Usage()
        {
            



            return View();
        }
    }
}
