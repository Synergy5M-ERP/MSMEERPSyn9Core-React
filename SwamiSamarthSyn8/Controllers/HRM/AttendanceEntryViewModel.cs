namespace SwamiSamarthSyn8.Controllers.HRM
{
    public class AttendanceEntryViewModel
    {
        public string SelectedDate { get; set; }
        public string Emp_Code { get; set; }
        public string FullName { get; set; }
        public string DepartmentName { get; set; }
        public int? DeptId { get; set; }
        public string DeptName { get; set; }   // ✅ ADD THIS
        public int EmployeeId { get; set; }

    }
}
