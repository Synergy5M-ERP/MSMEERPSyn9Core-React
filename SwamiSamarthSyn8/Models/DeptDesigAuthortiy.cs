namespace SwamiSamarthSyn8.Models
{
    public class DeptDesigAuthortiy
    {
        public HRM_DepartmentTbl Department { get; set; }
        public HRM_DesignationTbl Designation { get; set; }
        public HRM_AuthorityMatrixTbl AuthorityMatrix { get; set; }
        public string SelectedOption { get; set; }
        public int Id { get; set; }
        public List<HRM_DepartmentTbl> DepartmentName { get; set; }
        public List<HRM_DesignationTbl> DesignationsName { get; set; }
        public List<HRM_AuthorityMatrixTbl> AuthorityName { get; set; }
        public string Department_Name { get; set; }
        public int DeptId { get; set; }
        public string Designations_Name { get; set; }
        public int DesId { get; set; }
        public string Authority_Name { get; set; }
        public int AuthId { get; set; }
        public string OrgchartWithBudgetData { get; set; } // Placeholder for any specific data
    }
}
