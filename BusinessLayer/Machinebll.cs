using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer;

namespace BusinessLayer
{
    public class Machinebll
    {
        private readonly OsmosisCRMEntities _context;

        public Machinebll(OsmosisCRMEntities context)
        {
            _context = context;
        }

        public dynamic SaveMachine(machine objMachine)
        {
            if (objMachine.mid == 0)
            {
                _context.machines.Add(objMachine);
                _context.SaveChanges();

                return true;
            }
            else
            {
                var _user = _context.machines.Find(objMachine.mid);
                if (_user != null)
                {
                    _context.Entry(_user).CurrentValues.SetValues(objMachine);
                    _context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
        }

        public IEnumerable<dynamic> GetMachineList()
        {
            return _context.machines.ToList();
        }

        public machine GetMachineOncustomercode(string customerCode)
        {
            return _context.machines.Where(c => c.customercode == customerCode).SingleOrDefault();
        }

        public bool DeleteMachine(int mid)
        {
            var objMachine = new machine { mid = mid };
            _context.machines.Attach(objMachine);
            _context.machines.Remove(objMachine);
            _context.SaveChanges();

            return true;
        }

    }
}
