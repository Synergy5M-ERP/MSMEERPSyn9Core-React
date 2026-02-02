using System;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_AuthorityMatrix
    {
        [Key]
        public int AuthorityMatrixId { get; set; }   // PK

        public string AuthorityMatrixName { get; set; }

        public int AuthorityMatrixCode { get; set; }

        public bool IsSelected { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; }
    }
}
