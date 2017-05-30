using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer;

namespace BusinessLayer
{
    public class CaseBll
    {
        private readonly OsmosisCRMEntities _context;

        public CaseBll(OsmosisCRMEntities context)
        {
            _context = context;
        }

        public dynamic SaveCash(@case objCase)
        {
            if (objCase.caseid == 0)
            {
                _context.cases.Add(objCase);
                _context.SaveChanges();

                return true;
            }
            else
            {
                var _user = _context.cases.Find(objCase.caseid);
                if (_user != null)
                {
                    _context.Entry(_user).CurrentValues.SetValues(objCase);
                    _context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
        }

        public IEnumerable<dynamic> GetCaseList()
        {
            return _context.cases.ToList();
        }

        public IEnumerable<dynamic> GetCaseList(string CustomerCode)
        {
            return _context.cases.Where(c => c.customercode == CustomerCode).ToList();
        }

        public bool DeleteCase(int caseid)
        {
            var objCase = new @case { caseid = caseid };
            _context.cases.Attach(objCase);
            _context.cases.Remove(objCase);
            _context.SaveChanges();

            return true;
        }


    }
}
