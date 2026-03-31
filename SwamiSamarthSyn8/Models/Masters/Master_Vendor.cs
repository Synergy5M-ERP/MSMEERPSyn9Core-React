using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_Vendor
    {
        [Key]
        public int VendorId { get; set; }

        public int VendorCategoryId { get; set; }

        public int IndustryId { get; set; }

        public int CategoryId { get; set; }

        public int SubCategoryId { get; set; }

        public int SourceId { get; set; }

        public string? VendorCode { get; set; }

        public string? ManualVendorCode { get; set; }

        public string? VendorName { get; set; }

        public int PaymentTermsId { get; set; }

        public int DeliveryTermsid { get; set; }

        public string? ContactPerson { get; set; }

        public string? Email { get; set; }

        public string? ContactNo { get; set; }

        public string? LandlineNo { get; set; }

        public string? GSTNo { get; set; }

        public string? Website { get; set; }

        public string? CINNo { get; set; }

        public string? PanNo { get; set; }

        public string? MSMENo { get; set; }

        public string? StateCode { get; set; }

        public string? STDPaymentDays { get; set; }

        public string? BajajVendor { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public int? DeletedBy { get; set; }

        public DateTime? DeletedDate { get; set; }

        public string? LedgerId { get; set; }

        public string? GLCode { get; set; }
        public bool IsActive { get; set; }
    }
}

