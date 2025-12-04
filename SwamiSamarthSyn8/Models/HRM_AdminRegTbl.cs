using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace SwamiSamarthSyn8.Models
{
    [Table("HRM_AdminRegTbl")]
    public partial class HRM_AdminRegTbl
    {
        [Key]
        public int id { get; set; }

        public int? UserId { get; set; }

        [StringLength(50)]
        public string? CompanyName { get; set; }

        [StringLength(50)]
        public string? ContactPerson { get; set; }

        [StringLength(50)]
        public string? EmailId { get; set; }

        [StringLength(50)]
        public string? ContactNo { get; set; }

        [StringLength(50)]
        public string? GstNo { get; set; }

        [StringLength(50)]
        public string? Country { get; set; }

        [StringLength(50)]
        public string? State { get; set; }

        [StringLength(50)]
        public string? City { get; set; }

        [StringLength(255)]
        [Unicode(false)]
        public string? Source { get; set; }

        [StringLength(255)]
        [Unicode(false)]
        public string? Continent { get; set; }

        [StringLength(255)]
        public string? Authority { get; set; }

        [StringLength(255)]
        public string? Designation { get; set; }

        public bool IsActive { get; set; } = true;

      
    }
}
