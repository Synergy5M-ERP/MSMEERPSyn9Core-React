using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Accounts
{

    [Table("AccountTransportationGRN")]
    public class AccountTransportationGRN
    {
        [Key]
        public long TransporterGRNId { get; set; }

        public int? VendorId { get; set; }

        public string? InvoiceNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? InvoiceDate { get; set; }

        public int? TaxTypeId { get; set; }
        public decimal? TaxAmount { get; set; }
        public decimal? Qty { get; set; }
        public DateTime? Date { get; set; }

        public decimal? Price { get; set; }

        public decimal? NetAmount { get; set; }

        public decimal? TotalAmount { get; set; }

        public decimal? SGSTAmount { get; set; }

        public decimal? CGSTAmount { get; set; }

        public decimal? IGSTAmount { get; set; }
        public bool CheckTransportation { get; set; }
        public bool ApproveTransportation { get; set; }

        public int? CreatedBy { get; set; }
        public string? LedgerId { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        [Column(TypeName = "date")]
        public DateTime? UpdatedDate { get; set; }
        public DateTime? Payment_Due_Date { get; set; }
    }
}
