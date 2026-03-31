using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountNonGRNDetails
    {
        [Key]
        public int NonGRNDetailsId { get; set; }

        public int NonGrnId { get; set; }

        public int LedgerId { get; set; }

        public string Itemname { get; set; }

        public decimal? Qty { get; set; }

        public decimal? BasicAmt { get; set; }

        public string? TaxRate { get; set; }

        public decimal? CGSTAmt { get; set; }

        public decimal? SGSTAmt { get; set; }

        public decimal? IGSTAmt { get; set; }

        public decimal? Totaltax { get; set; }

        public decimal? TotalItemValue { get; set; }

        public string? TaxType { get; set; }
    }
}
