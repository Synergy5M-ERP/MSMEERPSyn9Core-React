namespace SwamiSamarthSyn8.Models.Masters
{
    public class LocationDeleteModel
    {
        public string deleteType { get; set; }

        public int? sourceId { get; set; }
        public int? continentId { get; set; }
        public int? countryId { get; set; }
        public int? stateId { get; set; }
        public int? cityId { get; set; }
    }
}
