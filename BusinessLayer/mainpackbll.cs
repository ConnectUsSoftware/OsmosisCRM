using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer;

namespace BusinessLayer
{
    public class mainpackbll
    {
        private readonly OsmosisCRMEntities _context;

        public mainpackbll(OsmosisCRMEntities context)
        {
            _context = context;
        }

        public dynamic SaveMaintenance(mainpack objMainPack)
        {
            if (objMainPack.mainid == 0)
            {
                _context.mainpacks.Add(objMainPack);
                _context.SaveChanges();

                return true;
            }
            else
            {
                var _user = _context.mainpacks.Find(objMainPack.mainid);
                if (_user != null)
                {
                    _context.Entry(_user).CurrentValues.SetValues(objMainPack);
                    _context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
        }

        public IEnumerable<dynamic> GetMaintenanceList()
        {
            return _context.mainpacks.ToList();
        }

        public bool DeleteMaintenance(int mainid)
        {
            var objMaint = new mainpack { mainid = mainid };
            _context.mainpacks.Attach(objMaint);
            _context.mainpacks.Remove(objMaint);
            _context.SaveChanges();

            return true;
        }

    }
}
