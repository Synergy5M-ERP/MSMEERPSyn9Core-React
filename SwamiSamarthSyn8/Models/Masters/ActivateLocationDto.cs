namespace SwamiSamarthSyn8.Models.Masters
{
    public class ActivateLocationDto
    {
        public string Type { get; set; }
        public int? SourceId { get; set; }
        public int? ContinentId { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public int? CityId { get; set; }
    }
}
