using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountNonGRN
    {
        [Key]
        public int NonGrnId { get; set; }

        public string VendorName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string VendorCode { get; set; }
        public string GstNo { get; set; }

        public string ContactPerson { get; set; }
        public string ContactNumber { get; set; }
        public string EmailID { get; set; }

        public string BankName { get; set; }
        public string Branch { get; set; }
        public string AcctNo { get; set; }
        public string IfscCode { get; set; }

        public string InvoiceNo { get; set; }
        public DateTime? InvoiceDate { get; set; }

        public bool? CheckNonGRN { get; set; }
        public bool? ApprovedGRN { get; set; }
        public bool? IsActive { get; set; }
    }
}
