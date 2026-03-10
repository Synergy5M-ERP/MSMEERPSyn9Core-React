using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models.Masters
{
    [Keyless]
    public class LocationDto
    {
        public string? LocationCode { get; set; }

        public string? src_name { get; set; }
        public string? conti_name { get; set; }
        public string? country_name { get; set; }
        public string? state_name { get; set; }
        public string? city_name { get; set; }

        public int? src_id { get; set; }
        public int? conti_id { get; set; }
        public int? country_id { get; set; }
        public int? state_id { get; set; }
        public int? city_id { get; set; }
    }
}