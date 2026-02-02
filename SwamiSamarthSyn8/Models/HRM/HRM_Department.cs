using System;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_Department
    {
        [Key]
        public int DeptId { get; set; }          // PK

        public string DeptName { get; set; }

        public int DeptCode { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; }
    }
}
