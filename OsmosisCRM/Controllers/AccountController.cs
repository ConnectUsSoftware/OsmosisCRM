using System.Globalization;
using OsmosisCRM.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using BusinessLayer;
using Microsoft.AspNet.Identity;

namespace OsmosisCRM.Controllers
{
    public class AccountController : Controller
    {
        //
        // GET: /Account/
        public AccountController()
        {
        }


        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        [AllowAnonymous]
        public ActionResult Index(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        private ApplicationSignInManager _signInManager;

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set { _signInManager = value; }
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // This doen't count login failures towards lockout only two factor authentication
            // To enable password failures to trigger lockout, change to shouldLockout: true
            var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: false);
            switch (result)
            {
                case SignInStatus.Success:
                    {
                        string userId = SignInManager.AuthenticationManager.AuthenticationResponseGrant.Identity.GetUserId();

                        if (await UserManager.IsInRoleAsync(userId, "Admin")) //<= Checking Role and redirecting accordingly.
                            return RedirectToAction("Index", "Admin");
                        else
                            return RedirectToAction("Index", "AdminUser");

                        //var userIdentity = (ClaimsIdentity)User.Identity;
                        //var claims = userIdentity.Claims;
                        //var roleClaimType = userIdentity.RoleClaimType;
                        //var roles = claims.Where(c => c.Type == ClaimTypes.Role).ToList();

                        //if (roles[0].Value == "Admin")
                        //    return RedirectToAction("Index", "Admin");
                        //else if (roles[0].Value == "User")
                        //    return RedirectToAction("Index", "AdminUser");
                        //else
                        //    return RedirectToLocal(returnUrl);
                    }
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl });
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid login attempt.");
                    return View(model);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Index", "Account");
        }

        public ActionResult Register()
        {
            return View();
        }

        public ActionResult UserMaster()
        {
            return View();
        }

        public ActionResult AdminDashboard()
        {
            return View();
        }

        [HttpPost]
        public async Task<dynamic> ConfirmUser(string id)
        {

            EncryptController e = new EncryptController();
            var DecID = e.DecryptValue(id);
            if (string.IsNullOrEmpty(DecID))
            {
                return false;
            }
            else
            {
                UserBll _userbll = new UserBll(new DataLayer.OsmosisCRMEntities());
                customermain objUser = _userbll.GetUserList(DecID);
                if (objUser != null)
                {
                    int iid = 0;
                    int.TryParse(DecID, out iid);

                    bool isConfirm = false;
                    if (!string.IsNullOrEmpty(Convert.ToString(objUser.IsConfirm)))
                        isConfirm = objUser.IsConfirm.Value;


                    if (isConfirm)
                    {
                        return true;
                    }
                    else
                    {
                        var user = new ApplicationUser { UserName = objUser.email, Email = objUser.email, cindex = iid };
                        var result = await UserManager.CreateAsync(user, objUser.CustomerPassword);
                        if (result.Succeeded)
                        {
                            // Add User Role As a User
                            var currentUser = UserManager.FindByName(user.UserName);
                            var roleresult = UserManager.AddToRole(currentUser.Id, "User");


                            // Now Update status to confirm
                            _userbll.ConfirmUser(iid);

                            return true;
                            //return new { status = 1 };
                        }
                        else
                            return false;
                        //return new { status = 0 };
                    }
                }
                else
                    return false;
            }
        }


        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("AdminDashboard", "Account");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}
