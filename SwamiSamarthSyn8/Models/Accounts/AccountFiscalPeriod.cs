using System;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class AccountFiscalPeriod
    {
        [Key]
        public int AccountFiscalPeriodId { get; set; }

        [Required]
        public string FiscalPeriodName { get; set; }

        public DateTime FiscalPeriodStartDate { get; set; }

        public DateTime FiscalPeriodEndDate { get; set; }

        public string FiscalYear { get; set; }

        public bool IsActive { get; set; }
    }
}
