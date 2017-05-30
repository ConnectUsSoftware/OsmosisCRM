using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Web;
namespace OsmosisCRM.Controllers
{
    public static class MailHelper
    {
        public static String msSMTPUserName = ConfigurationSettings.AppSettings["SMTPUserName"];
        public static String msSMTPPassword = ConfigurationSettings.AppSettings["SMTPPassword"];
        public static string SMTP = ConfigurationSettings.AppSettings["SMTPServer"];

        public static bool SendMail(string mTo, string cc, string mSubject, string mMessage)
        {
            try
            {
                try
                {
                    MailMessage Msg = new MailMessage();
                    // Sender e-mail address.
                    Msg.From = new MailAddress(msSMTPUserName);
                    // Recipient e-mail address.
                    Msg.To.Add(mTo);
                    Msg.Subject = mSubject;
                    Msg.Body = mMessage;
                    Msg.IsBodyHtml = true;

                    // your remote SMTP server IP.
                    SmtpClient smtp = new SmtpClient();
                    //smtp.Host = "smtp.gmail.com";
                    // smtp.Host = "mocha7004.mochahost.com";
                    smtp.Host = SMTP;// "mocha7004.mochahost.com";

                    smtp.Port = 587;
                    //smtp.Port = 465;
                    smtp.EnableSsl = true;
                    //smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new System.Net.NetworkCredential(msSMTPUserName, msSMTPPassword);
                    //smtp.EnableSsl = true;
                    smtp.Send(Msg);

                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }

        }

    }
}