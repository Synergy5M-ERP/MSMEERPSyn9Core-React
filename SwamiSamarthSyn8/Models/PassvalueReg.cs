using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class PassvalueReg
    {
        public string company_name { get; set; }
        public string contact_person { get; set; }
        public string email_id { get; set; }
        public string contact_no { get; set; }
        [Required(ErrorMessage = "GST number is required")]
        [StringLength(15, MinimumLength = 15, ErrorMessage = "GST number must be exactly 15 characters")]
        [RegularExpression(@"^[a-zA-Z0-9]*$", ErrorMessage = "GST number must contain only alphanumeric characters")]
        public string gst_no { get; set; }
        public string country { get; set; }
        public string state { get; set; }
        public string city { get; set; }
        public string industry { get; set; }
        public string industry_category { get; set; }
        public string industry_subcategory { get; set; }
        public string password { get; set; }
        public string comfirmpassword { get; set; }

    }
}
