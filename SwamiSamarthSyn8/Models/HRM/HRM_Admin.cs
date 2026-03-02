using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_Admin
    {
        [Key]
        public int AdminId { get; set; }

        [Required]
        [StringLength(200)]
        public string Company_name { get; set; }

        [Required]
        [StringLength(150)]
        public string Contact_person { get; set; }

        [Required]
        [StringLength(150)]
        public string Email_id { get; set; }

        [Required]
        [StringLength(15)]
        public string Contact_no { get; set; }

        [Required]
        [StringLength(50)]
        public string Gst_no { get; set; }

        // ================= LOCATION =================
        public int CountryId { get; set; }
        public int StateId { get; set; }
        public int CityId { get; set; }

        // ================= ROLE INFO =================
        [Required]
        [StringLength(100)]
        public string Designation { get; set; }

        [Required]
        [StringLength(100)]
        public string Authority { get; set; }

        // ================= AUDIT =================
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; }
    }
}
