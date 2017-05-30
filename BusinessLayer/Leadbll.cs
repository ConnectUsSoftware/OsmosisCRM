using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class Leadbll
    {
        private readonly OsmosisCRMEntities _context;

        public Leadbll(OsmosisCRMEntities context)
        {
            _context = context;
        }

        public dynamic SaveLead(lead objLead)
        {
            if (objLead.idlead == 0)
            {
                _context.leads.Add(objLead);
                _context.SaveChanges();

                return true;
            }
            else
            {
                var _user = _context.leads.Find(objLead.idlead);
                if (_user != null)
                {
                    _context.Entry(_user).CurrentValues.SetValues(objLead);
                    _context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
        }

        public IEnumerable<dynamic> GetLeadList()
        {


            return _context.leads.ToList();
        }

        public bool DeleteLead(int idlead)
        {
            var objLead = new lead { idlead = idlead };
            _context.leads.Attach(objLead);
            _context.leads.Remove(objLead);
            _context.SaveChanges();

            return true;
        }

        #region LeadAction
        public dynamic SaveLeadAction(leadaction objLeadAction)
        {
            if (objLeadAction.leadactionid == 0)
            {
                objLeadAction.createdate = DateTime.Now;
                _context.leadactions.Add(objLeadAction);
                _context.SaveChanges();

                return true;
            }
            else
            {
                var _user = _context.leadactions.Find(objLeadAction.leadactionid);
                if (_user != null)
                {
                    _context.Entry(_user).CurrentValues.SetValues(objLeadAction);
                    _context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
        }

        public IEnumerable<dynamic> GetLeadActionList()
        {
            var res = (from la in _context.leadactions
                       join l in _context.leads on la.leadid equals l.idlead
                       select new { la.memo, la.nextdate, la.actiontype, la.createdate, l.contactname }).OrderByDescending(o => o.createdate).ToList();
            return res;
        }

        public IEnumerable<dynamic> GetLeadActionOnId(int leadid)
        {
            var res = (from la in _context.leadactions
                       join l in _context.leads on la.leadid equals l.idlead
                       where la.leadid == leadid
                       select new { la.memo, la.nextdate, la.actiontype, la.createdate, l.contactname }).OrderByDescending(o => o.createdate).ToList();
            return res;
        }

        public bool DeleteLeadAction(int ileadactionid)
        {
            var objLeadAction = new leadaction { leadactionid = ileadactionid };
            _context.leadactions.Attach(objLeadAction);
            _context.leadactions.Remove(objLeadAction);
            _context.SaveChanges();

            return true;
        }
        #endregion

    }
}
