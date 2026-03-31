using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_VendorAddresses
    {
        [Key]
        public int VendorAddressId { get; set; }

        public int VendorId { get; set; }

        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public int Pincode { get; set; }
        public int ContinentId { get; set; }
        public int CountryId { get; set; }
        public int StateId { get; set; }
        public string? Zone {  get; set; }
        public int CityId { get; set; }

        public bool IsActive { get; set; }
    }
}
