
namespace SwamiSamarthSyn8.Models
{
    public class Register
    {
        public string company_name { get; set; }
        public string contact_person { get; set; }
        public string email_id { get; set; }
        public string contact_no { get; set; }
        public string gst_no { get; set; }

        public string source { get; set; }
        public string continent { get; set; }

        // 🔥 CHANGE THESE FROM int → string
        public int CountryId { get; set; }
        public int StateId { get; set; }
        public int CityId { get; set; }

        public int authority { get; set; }
        public int designation { get; set; }

        public string Password { get; set; }
    }

}
