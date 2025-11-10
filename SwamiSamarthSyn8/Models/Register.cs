using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class Register
    {

        public int id { get; set; }

        [Required(ErrorMessage = "Company Name is required.")]
        public string company_name { get; set; }

        [Required(ErrorMessage = "Contact Person is required.")]
        public string contact_person { get; set; }

        [Required(ErrorMessage = "Email ID is required.")]
        [EmailAddress(ErrorMessage = "Enter a valid email address.")]
        public string email_id { get; set; }

        [Required(ErrorMessage = "Contact Number is required.")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Contact Number must be 10 digits.")]
        public string contact_no { get; set; }

        [Required(ErrorMessage = "GST Number is required.")]
        public string gst_no { get; set; }

        [Required(ErrorMessage = "Source is required.")]
        public string source { get; set; }

        [Required(ErrorMessage = "Continent is required.")]
        public string continent { get; set; }

        [Required(ErrorMessage = "Country is required.")]
        public string country { get; set; }

        [Required(ErrorMessage = "State is required.")]
        public string state { get; set; }

        [Required(ErrorMessage = "City is required.")]
        public string city { get; set; }

        [Required(ErrorMessage = "Authority is required.")]
        public string authority { get; set; }

        [Required(ErrorMessage = "Designation is required.")]
        public string designation { get; set; }

        [DataType(DataType.Password)]
        public string password { get; set; }

        [DataType(DataType.Password)]
        public string comfirmpassword { get; set; }

    }
}
