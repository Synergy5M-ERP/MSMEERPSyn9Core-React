using System;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_Designation
    {
        [Key]
        public int DesignationId { get; set; }   // PK

        public string DesignationName { get; set; }

        public int DesignationCode { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; }
    }
}
