using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class Master_Parameter
    {
        [Key]
        public int ParameterId { get; set; }
        public string? Parameter { get; set; }
        public int UOMId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsActive { get; set; }
    }
}
