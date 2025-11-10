namespace SwamiSamarthSyn8.Models
{
    public class RegistrationForm
    {
        public int id { get; set; }
        public Nullable<int> userid { get; set; }
        public string company_name { get; set; }
        public string contact_person { get; set; }
        public string email_id { get; set; }
        public string contact_no { get; set; }
        public string gst_no { get; set; }
        public string country { get; set; }
        public string state { get; set; }
        public string city { get; set; }
        public string industry { get; set; }
        public string industry_category { get; set; }
        public string industry_subcategory { get; set; }
        public string source { get; set; }
        public string continent { get; set; }
    }
}
