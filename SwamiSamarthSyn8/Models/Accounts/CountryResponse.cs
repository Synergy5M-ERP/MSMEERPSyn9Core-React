namespace SwamiSamarthSyn8.Models.Accounts
{
    public class CountryResponse
    {
        public Name Name { get; set; }
        public string Cca2 { get; set; } // 2-letter country code (e.g. "US")
        public string Cca3 { get; set; } // 3-letter country code (e.g. "USA")
        public string Region { get; set; }
        public string Flag { get; set; }
    }

    public class Name
    {
        public string Common { get; set; }
        public string Official { get; set; }
    }

}
