using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using DataLayer;


namespace BusinessLayer
{
    public class UserBll
    {
        private readonly OsmosisCRMEntities _context;

        public UserBll(OsmosisCRMEntities context)
        {
            _context = context;
        }

        public dynamic SaveUser(customermain objUserMaster)
        {
            if (objUserMaster.cindex == 0)
            {
                _context.customermains.Add(objUserMaster);
                _context.SaveChanges();

                return true;
            }
            else
            {
                var _user = _context.customermains.Find(objUserMaster.cindex);
                if (_user != null)
                {
                    _context.Entry(_user).CurrentValues.SetValues(objUserMaster);
                    _context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
        }

        public IEnumerable<dynamic> GetUserList()
        {
            return _context.customermains.ToList();
        }

        public customermain GetUserList(string cindex)
        {
            int iindex = 0;
            int.TryParse(cindex, out iindex);

            return _context.customermains.Where(c => c.cindex == iindex).SingleOrDefault();
        }

        public bool DeleteUser(int UserMasterID)
        {
            var objUser = new customermain { cindex = UserMasterID };
            _context.customermains.Attach(objUser);
            _context.customermains.Remove(objUser);
            _context.SaveChanges();

            return true;
        }

        public bool CheckCustomerCode(string code)
        {
            var lst = _context.customermains.Where(c => c.customercode == code).ToList();
            if (lst.Count > 0)
                return true;
            else
                return false;
        }

        public IEnumerable<dynamic> GetUserDetailsOnCustomerCodeAndInvitationCode(string CustomerCode, string InvitationCode)
        {
            return _context.customermains.Where(u => u.customercode == CustomerCode && u.invitationcode == InvitationCode).ToList();
        }

        public dynamic SaveUserPassword(int cindex, string CustomerPassword, string email, string contactname)
        {
            var objdata = _context.customermains.Where(x => x.cindex == cindex).FirstOrDefault();
            if (objdata != null)
            {
                objdata.CustomerPassword = CustomerPassword;
                objdata.email = email;
                objdata.contactname = contactname;
                _context.SaveChanges();

                return true;
            }
            else
                return false;
        }

        public bool ConfirmUser(int cindex)
        {
            var objdata = _context.customermains.Where(x => x.cindex == cindex).FirstOrDefault();
            if (objdata != null)
            {
                objdata.IsConfirm = true;
                _context.SaveChanges();

                return true;
            }
            else
                return false;
        }

        public bool UserIsConfirm(int cindex)
        {
            var objdata = _context.customermains.Where(x => x.cindex == cindex && x.IsConfirm == true).FirstOrDefault();
            if (objdata != null)
                return true;
            else
                return false;
        }


    }
}
