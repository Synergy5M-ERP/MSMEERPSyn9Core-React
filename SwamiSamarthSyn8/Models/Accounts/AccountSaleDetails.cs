using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountSaleDetails
    {
        public int AccountSaleDetailedId { get; set; }
        public int AccountSaleId { get; set; }

        [ValidateNever]   // ✅ THIS IS THE FIX
        public virtual AccountSale AccountSale { get; set; }

        public int ItemId { get; set; }
        public string? Grade { get; set; }
        public string ItemCode { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal ApprovedQty { get; set; }
        public decimal DamagedQty { get; set; }
        public decimal CGST { get; set; }
        public decimal SGST { get; set; }
        public decimal IGST { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal GrandAmount { get; set; }
        public bool CheckSale { get; set; }
        public bool ApprovedSale { get; set; }

        // ✅ Add this temporary property for frontend binding
        [NotMapped] // optional if using EF Core
        public List<int>? ItemIds { get; set; }
    }
}
