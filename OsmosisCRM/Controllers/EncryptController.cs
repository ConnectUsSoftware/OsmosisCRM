using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Http;

namespace OsmosisCRM.Controllers
{
    public class EncryptController : ApiController
    {
        [HttpGet]
        public string EncryptValue(String strtoEncrypt)
        {
            strtoEncrypt = strtoEncrypt.ToLower();
            string encrypted = "";
            string strkey = "4g6WGvm_9iGezMb_-NjEXVydE";
            //string strkey = "INDIAISGREAT";
            try
            {
                TripleDESCryptoServiceProvider objDESCrypto = new TripleDESCryptoServiceProvider();
                MD5CryptoServiceProvider objHasmd5 = new MD5CryptoServiceProvider();

                byte[] byteHash, byteBuff;
                string strTempkey = strkey;

                byteHash = objHasmd5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(strTempkey));
                objHasmd5 = null;
                objDESCrypto.Key = byteHash;
                objDESCrypto.Mode = CipherMode.ECB;

                byteBuff = ASCIIEncoding.ASCII.GetBytes(strtoEncrypt);

                encrypted = Convert.ToBase64String(objDESCrypto.CreateEncryptor().TransformFinalBlock(byteBuff, 0, byteBuff.Length));

            }
            catch
            {
            }
            return encrypted;
        }

        [HttpGet]
        public string DecryptValue(string strtoEncryptd)
        {
            strtoEncryptd = strtoEncryptd.Replace(' ', '+');
            string strDecrypted = "";
            string strkey = "4g6WGvm_9iGezMb_-NjEXVydE";
            try
            {
                TripleDESCryptoServiceProvider objDESCrypto = new TripleDESCryptoServiceProvider();
                MD5CryptoServiceProvider objHasmd5 = new MD5CryptoServiceProvider();
                byte[] byteHash, byteBuff;
                string strTempkey = strkey;
                byteHash = objHasmd5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(strTempkey));
                objHasmd5 = null;
                objDESCrypto.Key = byteHash;
                objDESCrypto.Mode = CipherMode.ECB;
                byteBuff = Convert.FromBase64String(strtoEncryptd);
                strDecrypted = ASCIIEncoding.ASCII.GetString(objDESCrypto.CreateDecryptor().TransformFinalBlock(byteBuff, 0, byteBuff.Length));
                objDESCrypto = null;
            }
            catch
            {

            }
            return strDecrypted;
        }

        public string Left(string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value))
                return value;
            maxLength = Math.Abs(maxLength);
            return (value.Length <= maxLength ? value : value.Substring(0, maxLength));
        }

        public string Right(string sValue, int iMaxLength)
        {
            //Check if the value is valid
            if (string.IsNullOrEmpty(sValue))
            {
                //Set valid empty string as string could be null
                sValue = string.Empty;
            }
            else if (sValue.Length > iMaxLength)
            {
                //Make the string no longer than the max length
                sValue = sValue.Substring(sValue.Length - iMaxLength, iMaxLength);
            }

            //Return the string
            return sValue;
        }

        public string cripta(DateTime data, int id)
        {
            string functionReturnValue = null;

            string[] arr_pwd = new string[] { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };


            if (data == null)
            {
                functionReturnValue = "0000";
            }
            else {
                string Year = String.Format("{0:yyyy}", data);
                string month = String.Format("{0:MM}", data);
                string Day = String.Format("{0:dd}", data);

                string anno = Right(Year, 2);
                int mese = Convert.ToInt32(month) + 10;
                int giorno = Convert.ToInt32(Day) + 10;

                string contatore1 = Left(Convert.ToString(id), 2);
                string contatore2 = Right(Convert.ToString(id), Convert.ToString(id).Length - 2);

                while (contatore1.Length < 4)
                {
                    contatore1 = "0" + contatore1;
                }
                //functionReturnValue = anno + contatore1 + arr_pwd(mese) + Strings.Ucase(arr_pwd(giorno)) + contatore2;
                functionReturnValue = anno + contatore1 + arr_pwd[mese].ToUpper() + arr_pwd[giorno].ToUpper() + contatore2;
            }
            return functionReturnValue;
        }
    }
}
