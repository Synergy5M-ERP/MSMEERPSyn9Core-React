using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using System.Net.Mail;
using System.Net;
using System.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;


namespace SwamiSamarthSyn8.Controllers
{
    public class OrgnizationMatrixController : Controller
    {
        private readonly SwamiSamarthDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;

        // Single constructor injecting all dependencies
        public OrgnizationMatrixController(
            SwamiSamarthDbContext db,
            IConfiguration configuration,
            IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }
        public IActionResult Index()
        {
            return View();
        }

        public ActionResult GetSource()
        {
            var source = _db.MergeTblDatas
                            .Select(i => i.src_name)
                            .Distinct()
                            .ToList();
            return Json(source);
        }

        public ActionResult GetContinent(string source)
        {
            var continent1 = _db.MergeTblDatas
                .Where(c => c.src_name == source)
                .Select(c => c.conti_name)
                .Distinct()
                .ToList();

            return Json(continent1);
        }

        public ActionResult GetCountry(string source, string continent)
        {
            var country = _db.MergeTblDatas
                .Where(c => c.src_name == source && c.conti_name == continent)
                .Select(c => c.Country_Name)
                .Distinct()
                .ToList();

            return Json(country);
        }

        public ActionResult GetState(string source, string continent, string country)
        {
            var state = _db.MergeTblDatas
                .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country)
                .Select(c => c.state_name)
                .Distinct()
                .ToList();

            return Json(state);
        }

        public ActionResult GetCity(string source, string continent, string country, string state)
        {
            var city1 = _db.MergeTblDatas
                .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country && c.state_name == state)
                .Select(c => c.city_name)
                .Distinct()
                .ToList();

            return Json(city1);
        }

        [HttpPost]
        public JsonResult GetStates(string countryCode)
        {
            if (string.IsNullOrEmpty(countryCode))
                return Json(new List<SelectListItem>()); // fail-safe

            var states = _db.StateTbls
                .Where(s => s.Country_Code == countryCode)
                .Select(s => new SelectListItem
                {
                    Value = s.state_code.ToString(),
                    Text = s.state_name
                })
                .ToList();

            return Json(states);
        }


        [HttpPost]
        public JsonResult GetCities(string stateCode)
        {
            var cities = _db.CityTbl1
                .Where(c => c.state_code == stateCode)
                .Select(c => new SelectListItem
                {
                    Value = c.city_code.ToString(),
                    Text = c.city_name
                })
                .Distinct()
                .ToList();

            return Json(cities);
        }
        public ActionResult Create(string selectedOption, string msg)
        {
            var model = new DeptDesigAuthortiy
            {
                Department = new HRM_DepartmentTbl(),
                Designation = new HRM_DesignationTbl(),
                AuthorityMatrix = new HRM_AuthorityMatrixTbl()
            };
            ViewBag.SelectedOption = selectedOption;
            ViewBag.SuccessMessage = msg;
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(DeptDesigAuthortiy model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.SelectedOption))
                {
                    return Json(new { success = false, message = "⚠ Please select a valid option." });
                }

                if (model.SelectedOption == "Department")
                {
                    if (string.IsNullOrWhiteSpace(model.Department?.DepartmentName))
                        return Json(new { success = false, message = "⚠ Department name is required." });

                    if (_db.HRM_DepartmentTbl.Any(d => d.DepartmentName.Trim().ToLower() == model.Department.DepartmentName.Trim().ToLower()))
                        return Json(new { success = false, message = "⚠ Department already exists!" });

                    var existingDeptCodes = _db.HRM_DepartmentTbl
                                              .Select(d => d.Department_code)
                                              .ToList()
                                              .Select(c => int.TryParse(c, out var num) ? num : 0)
                                              .Where(num => num > 0)
                                              .OrderBy(num => num)
                                              .ToList();

                    int nextDeptCode = 1;
                    int maxCode = existingDeptCodes.Any() ? existingDeptCodes.Max() : 0;
                    for (int i = 1; i <= maxCode; i++)
                    {
                        if (!existingDeptCodes.Contains(i))
                        {
                            nextDeptCode = i;
                            break;
                        }
                    }
                    if (nextDeptCode == 1 && existingDeptCodes.Contains(1))
                        nextDeptCode = maxCode + 1;

                    model.Department.Department_code = nextDeptCode.ToString("D2");
                    _db.HRM_DepartmentTbl.Add(model.Department);
                }
                else if (model.SelectedOption == "Designation")
                {
                    if (string.IsNullOrWhiteSpace(model.Designation?.DesignationName))
                        return Json(new { success = false, message = "⚠ Designation name is required." });

                    if (_db.HRM_DesignationTbl.Any(d => d.DesignationName.Trim().ToLower() == model.Designation.DesignationName.Trim().ToLower()))
                        return Json(new { success = false, message = "⚠ Designation already exists!" });

                    var existingDesigCodes = _db.HRM_DesignationTbl
                                               .Select(d => d.Designation_code)
                                               .ToList()
                                               .Select(c => int.TryParse(c, out var num) ? num : 0)
                                               .Where(num => num > 0)
                                               .OrderBy(num => num)
                                               .ToList();

                    int nextDesigCode = 1;
                    int maxDesigCode = existingDesigCodes.Any() ? existingDesigCodes.Max() : 0;
                    for (int i = 1; i <= maxDesigCode; i++)
                    {
                        if (!existingDesigCodes.Contains(i))
                        {
                            nextDesigCode = i;
                            break;
                        }
                    }
                    if (nextDesigCode == 1 && existingDesigCodes.Contains(1))
                        nextDesigCode = maxDesigCode + 1;

                    model.Designation.Designation_code = nextDesigCode.ToString("D2");
                    _db.HRM_DesignationTbl.Add(model.Designation);
                }
                else if (model.SelectedOption == "AuthorityMatrix")
                {
                    if (string.IsNullOrWhiteSpace(model.AuthorityMatrix?.AuthorityName))
                        return Json(new { success = false, message = "⚠ Authority name is required." });

                    if (_db.HRM_AuthorityMatrixTbl.Any(a => a.AuthorityName.Trim().ToLower() == model.AuthorityMatrix.AuthorityName.Trim().ToLower()))
                        return Json(new { success = false, message = "⚠ Authority already exists!" });

                    if (string.IsNullOrEmpty(model.AuthorityMatrix.IsSelected))
                        model.AuthorityMatrix.IsSelected = "No";

                    var existingCodes = _db.HRM_AuthorityMatrixTbl
                                          .Select(a => a.Authority_code)
                                          .ToList()
                                          .Select(c => int.TryParse(c, out var num) ? num : 0)
                                          .Where(num => num > 0)
                                          .OrderBy(num => num)
                                          .ToList();

                    int nextAuthCode = 1;
                    int maxCode = existingCodes.Any() ? existingCodes.Max() : 0;
                    for (int i = 1; i <= maxCode; i++)
                    {
                        if (!existingCodes.Contains(i))
                        {
                            nextAuthCode = i;
                            break;
                        }
                    }
                    if (nextAuthCode == 1 && existingCodes.Contains(1))
                        nextAuthCode = maxCode + 1;

                    model.AuthorityMatrix.Authority_code = nextAuthCode.ToString("D2");
                    _db.HRM_AuthorityMatrixTbl.Add(model.AuthorityMatrix);
                }
                else if (model.SelectedOption == "OrganizationBuild")
                {
                    return Json(new { success = true, redirectUrl = Url.Action("OrgchartwithBudget", "OrgnizationMatrix") });
                }
                else
                {
                    return Json(new { success = false, message = "⚠ Please select a valid option." });
                }

                _db.SaveChanges();
                return Json(new { success = true, message = $"{model.SelectedOption} added successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "❌ Something went wrong: " + ex.Message });
            }
        }

        public ActionResult List(string selectedOption)
        {
            var viewModel = new DeptDesigAuthortiy();

            switch (selectedOption)
            {
                case "Department":
                    viewModel.DepartmentName = _db.HRM_DepartmentTbl.ToList();
                    break;
                case "Designation":
                    viewModel.DesignationsName = _db.HRM_DesignationTbl.ToList();
                    break;
                case "AuthorityMatrix":
                    viewModel.AuthorityName = _db.HRM_AuthorityMatrixTbl.ToList();
                    break;
                default:
                    break;
            }

            return Json(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteRecord(int id, string selectedOption)
        {
            try
            {
                switch (selectedOption)
                {
                    case "Department":
                        var Dep = _db.HRM_DepartmentTbl.Find(id);
                        if (Dep != null)
                        {
                            _db.HRM_DepartmentTbl.Remove(Dep);
                            _db.SaveChanges();
                        }
                        break;
                    case "Designation":
                        var Des = _db.HRM_DesignationTbl.Find(id);
                        if (Des != null)
                        {
                            _db.HRM_DesignationTbl.Remove(Des);
                            _db.SaveChanges();
                        }
                        break;
                    case "AuthorityMatrix":
                        var Auth = _db.HRM_AuthorityMatrixTbl.Find(id);
                        if (Auth != null)
                        {
                            _db.HRM_AuthorityMatrixTbl.Remove(Auth);
                            _db.SaveChanges();
                        }
                        break;
                    default:
                        break;
                }
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Json(new { success = false, message = "An error occurred while deleting the record." });
            }
        }
        public ActionResult Employee()
        {
            using (var dbentities = new SwamiSamarthDbContext())
            {
                // Retrieve departments and designations
                List<HRM_DepartmentTbl> departments = dbentities.HRM_DepartmentTbl.ToList();
                List<HRM_DesignationTbl> designations = dbentities.HRM_DesignationTbl.ToList();
                List<CountryTbl> countries = dbentities.CountryTbl.ToList();

                var authorities = dbentities.HRM_AuthorityMatrixTbl
      .Where(a => a.AuthorityName.ToLower() != "chief admin"  // Exclude CHIEF ADMIN
               && a.IsSelected.Trim().ToLower() != "yes")     // Exclude IsSelected = Yes
      .Select(a => new SelectListItem
      {
          Value = a.Id.ToString(),
          Text = a.AuthorityName
      })
      .ToList();


                // **Ensure ViewBag.Authorities is not null**
                ViewBag.Authorities = authorities.Any()
                    ? new SelectList(authorities, "Value", "Text")
                    : new SelectList(new List<SelectListItem>(), "Value", "Text"); // Empty list fallback

                if (!authorities.Any())
                {
                    TempData["ErrorMessage"] = "No authorities found or all are marked as selected.";
                }

                // Assign Departments and Designations
                ViewBag.Departments = new SelectList(departments, "Id", "DepartmentName");
                ViewBag.Designations = new SelectList(designations, "Id", "DesignationName");

                // Assign Countries
                var countryList = countries
                    .Select(c => new SelectListItem
                    {
                        Value = c.Country_Code.ToString(),
                        Text = c.country_name
                    })
                    .ToList();
                ViewBag.CountryList = new SelectList(countryList, "Value", "Text");

                // Assign Positions
                var positions = dbentities.HRM_OganizationTbl
                    .Select(j => j.Position)
                    .Distinct()
                    .Select(p => new SelectListItem
                    {
                        Value = p,
                        Text = p
                    })
                    .ToList();
                ViewBag.Positions = new SelectList(positions, "Value", "Text");

                // Assign Departments
                var departmentList = dbentities.HRM_OganizationTbl
                    .Select(j => j.Department)
                    .Distinct()
                    .Select(p => new SelectListItem
                    {
                        Value = p,
                        Text = p
                    })
                    .ToList();
                ViewBag.Department = new SelectList(departmentList, "Value", "Text");

                // Initialize Employee model
                Employee EmpModel = new Employee();

                return View(EmpModel);
            }
        }
        [HttpGet]
        public JsonResult GetDepartmentCodeByDepartment(string departmentName)
        {
            try
            {
                if (string.IsNullOrEmpty(departmentName))
                {
                    return Json(new { success = false, message = "Invalid department name." });
                }

                // Fetch the department details based on the department name
                var department = _db.HRM_OganizationTbl
                                   .Where(j => j.Department == departmentName)
                                   .FirstOrDefault();  // Get the first matching department (or null if not found)

                if (department != null)
                {
                    // Return the department code, filled status, and vacant status if found
                    return Json(new
                    {
                        success = true,
                        Department_Code = department.Department_Code,
                        Filled = department.Status,
                        Vacant = department.Status
                    });
                }

                // If no department found, return an error message
                return Json(new { success = false, message = "Department not found." });
            }
            catch (Exception ex)
            {
                // Log error if needed
                Console.WriteLine("Error fetching department code: " + ex.Message);
                return Json(new { success = false, message = "An error occurred while fetching department code." });
            }
        }
        [HttpGet]
        public JsonResult GetPositionCodeEMP(string positionName)
        {
            try
            {
                if (string.IsNullOrEmpty(positionName))
                {
                    return Json(new { success = false, message = "Invalid position name." }
                    );
                }

                // Fetch the position code based on the position name
                var position = _db.HRM_OganizationTbl
                    .Where(j => j.Position == positionName)
                    .Select(j => new { j.Position_Code, j.Position })
                    .FirstOrDefault();

                if (position != null)
                {
                    // Return both position name and code
                    return Json(new
                    {
                        success = true,
                        positionCode = position.Position_Code,
                        positionName = position.Position
                    });
                }

                return Json(new { success = false, message = "Position not found." });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching position code: " + ex.Message);
                return Json(new { success = false, message = "An error occurred while fetching position code." });
            }
        }


        public JsonResult GetPositionsByDepartment(string department)
        {
            // Filter vacant positions by department and where the status indicates vacant positions
            var positions = _db.HRM_OganizationTbl
        .Where(d => d.Department == department && (d.Status == null || d.Status == "Vacant")) // Assuming "Vacant" as status for vacant positions
                .Select(d => new SelectListItem
                {
                    Value = d.Position, // Position name used as value
                    Text = d.Position   // Display the position name in the dropdown
                })
                .ToList();

            return Json(positions);
        }


        [HttpPost]
        public ActionResult UpdatePositionStatus(string positionCode)
        {
            using (var dbentities = new SwamiSamarthDbContext())
            {
                var position = dbentities.HRM_OganizationTbl
                    .FirstOrDefault(p => p.Position_Code == positionCode);

                if (position != null)
                {
                    position.Status = "Filled";  // Update the status to "Filled"
                    dbentities.SaveChanges();

                    return Json(new { success = true });
                }

                return Json(new { success = false });
            }
        }

        [HttpPost]
        public ActionResult Employee(Employee emp, string adhaarFile)
        {


            using (var dbentities = new SwamiSamarthDbContext())
            {
                System.Diagnostics.Debug.WriteLine($"DepartmentId: {emp.DepartmentId}");
                var HRM_OganizationTbl = dbentities.HRM_OganizationTbl.ToList();
                System.Diagnostics.Debug.WriteLine($"HRM_OganizationTbl count: {HRM_OganizationTbl.Count}");

                // Check if job details have any data
                foreach (var job in HRM_OganizationTbl)
                {
                    System.Diagnostics.Debug.WriteLine($"Position: {job.Position}, Position_Code: {job.Position_Code}");
                }

                // Retrieve departments and designations from the database
                List<HRM_DesignationTbl> designations = dbentities.HRM_DesignationTbl.ToList();
                List<HRM_AuthorityMatrixTbl> authorities = dbentities.HRM_AuthorityMatrixTbl.ToList();
                List<CountryTbl> countries = dbentities.CountryTbl.ToList();
                //List<JobDetail> departments = dbentities.HRM_OganizationTbl.ToList();
                //List<JobDetail> position = dbentities.HRM_OganizationTbl.ToList();

                ViewBag.Department = dbentities.HRM_OganizationTbl
      .Select(d => new SelectListItem
      {
          Value = d.Id + "|" + d.Department_Code, // Concatenate Id and Department_Code
          Text = d.Department
      })
      .ToList();
                ViewBag.Positions = dbentities.HRM_OganizationTbl
    .Select(d => new SelectListItem
    {
        Value = d.Id + "|" + d.Position_Code, // Concatenate Id and Department_Code
        Text = d.Position
    })
    .ToList();
                string UploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "HRFile");
                string AdharPanFilePath = "";
                var countrie = dbentities.CountryTbl.Select(c => new SelectListItem
                {
                    Value = c.country_id.ToString(),
                    Text = c.country_name
                }).ToList();

                ViewBag.SelectedCountryId = countrie;
                HRM_EmpInfoTbl empInfo = new HRM_EmpInfoTbl();
                // Generate Employee Code
                int maxId = dbentities.HRM_EmpInfoTbl.Max(e => (int?)e.Id) ?? 0;
                int nextId = maxId + 1;
                if (emp.Date_Of_Joing != DateTime.MinValue)
                {
                    string yearOfJoining = emp.Date_Of_Joing?.ToString("yy"); // Get last two digits of the year
                    empInfo.Emp_Code = $"{yearOfJoining}/{nextId:D5}";
                }
                else
                {
                    empInfo.Emp_Code = "N/A"; // Handle the case where Date_Of_Joining is not valid
                }
                // Check if AdhaarFile is provided and save it
                emp.Emp_Code = empInfo.Emp_Code;
                if (!string.IsNullOrEmpty(emp.Name) && !string.IsNullOrEmpty(emp.Surname))
                {
                    empInfo.FullName = emp.Name + " " + emp.Surname;
                }
                else
                {
                    empInfo.FullName = "N/A"; // Or handle the null case as appropriate
                }
                // Check if AdhaarFile is provided and save it
                string Empcode = empInfo.Emp_Code;
                if (emp.AdhaarFile != null && emp.AdhaarFile.Length > 0)
                {
                    // Generate the file name
                    string AdharpanFileName = $"{Empcode}-AadharPanCard{Path.GetExtension(emp.AdhaarFile.FileName)}";
                    string localFilePath = Path.Combine(UploadPath, Empcode, AdharpanFileName);

                    // Ensure the directory exists
                    string directoryPath = Path.GetDirectoryName(localFilePath);
                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }

                    // Save the file locally
                    using (var stream = new FileStream(localFilePath, FileMode.Create))
                    {
                        emp.AdhaarFile.CopyTo(stream);
                    }

                    try
                    {
                        // Upload file to Azure Blob Storage
                        string uploadedUrl = UploadToAzure(emp.AdhaarFile, Empcode, "AadharPanCard");
                        // Extract just the file name for Azure storage
                        string azureFileName = Path.GetFileName(uploadedUrl); // Assuming uploadedUrl is the full URL from Azure

                        // Save the Azure file name to the database
                        empInfo.Adhaarcard_PanCard = azureFileName;
                    }
                    catch (Exception ex)
                    {
                        ModelState.AddModelError("", "Error uploading file to Azure: " + ex.Message);
                        return View(emp);
                    }
                }
                if (string.IsNullOrEmpty(emp.Email))
                {
                    emp.Email = "hrm@synergy5m.com";
                }
                empInfo.Email = emp.Email;

                // Map properties from Employee model to EmployeeInfo model
                empInfo.Name = emp.Name;
                empInfo.Surname = emp.Surname;
                empInfo.Middle_Name = emp.Middle_Name;
                empInfo.Gender = emp.Gender;
                empInfo.DOB = emp.DOB.HasValue ? DateOnly.FromDateTime(emp.DOB.Value)
                             : null;
                empInfo.Blood_Group = emp.Blood_Group;
                empInfo.Email = emp.Email;
                empInfo.Contact_NO = emp.Contact_NO;
                empInfo.Married_Status = emp.Married_Status;
                empInfo.Quallification = emp.Quallification;
                empInfo.Address = emp.Address;
                empInfo.permanent_Address = emp.Permanent_Address;
                empInfo.AdharNO = emp.AdharNO;
                empInfo.PanNo = emp.PanNo;
                empInfo.BankName = emp.BankName;
                empInfo.BankAccountNo = emp.BankAccountNo;
                empInfo.IFSC_Code = emp.IFSC_Code;
                empInfo.Past_Experience = emp.Past_Experience;
                empInfo.Date_Of_Joing = emp.Date_Of_Joing.HasValue ? DateOnly.FromDateTime(emp.Date_Of_Joing.Value)
                            : null;

                empInfo.Notices_Period = emp.Notices_Period;
                //empInfo.Relieving_Date = emp.Relieving_Date;
                empInfo.Joining_CTC_Breakup = emp.Joining_CTC_Breakup;
                empInfo.Country = emp.SelectedCountryName;
                empInfo.State = emp.SelectedStateName;
                empInfo.City = emp.SelectedCityName;
                empInfo.Department = emp.Department;
                //empInfo.DepartmentCode = emp.DepartmentCode;
                empInfo.Joining_Designation = emp.Position;
                empInfo.Monthly_Gross_Salary = emp.Monthly_Gross_Salary;
                empInfo.Monthly_Salary = emp.Month_ofSalary;
                empInfo.Basic_Salary = emp.Basic_Salary;
                empInfo.House_rent_Allownce = emp.House_rent_Allownce;
                empInfo.Medical_Allownce = emp.Medical_Allownce;
                empInfo.Leave_travel_Allowance = emp.Leave_travel_Allowance;
                empInfo.Additional_Benefits = emp.Additional_Benefits;
                empInfo.Performance_Incentive = emp.Performance_Incentive;
                empInfo.PF_Conrtibution = emp.PF_Conrtibution;
                empInfo.EST_Conrtibution = emp.EST_Conrtibution;
                empInfo.Stock_Option = emp.Stock_Option;
                empInfo.car = emp.Car;
                empInfo.Telephone = emp.Telephone;
                empInfo.Total_Month = emp.Total_Month;
                empInfo.Annual_CTC_Rs_ = emp.Annual_CTC_Rs_;
                empInfo.Nominee = emp.Nominee;
                empInfo.Relation = emp.Relation;
                empInfo.UAN = emp.UAN;
                empInfo.EPFO_A_C_NO = emp.EPFO_A_C_NO;
                empInfo.Professional_Tax = emp.Professional_Tax;
                empInfo.Status = "Vacant";
                empInfo.SalaryStatus = emp.SalaryStatus;
                empInfo.Salary_Increment = emp.Salary_Increment;
                empInfo.Date_Of_Increment=emp.Date_Of_Increment.HasValue ? DateOnly.FromDateTime(emp.Date_Of_Increment.Value)
                              : null;
                empInfo.Previous_Industry_Title = emp.Previous_Industry_Title;
                empInfo.Weekly_Off = emp.Weekly_Off;
                empInfo.DOL = emp.DOL.HasValue
                              ? DateOnly.FromDateTime(emp.DOL.Value)
                              : null;
                empInfo.Shift_Hours = emp.Shift_Hours;
                empInfo.Currency = emp.Currency;
                empInfo.Title = emp.Title;
                empInfo.OT_calculation = emp.OT_calculation;
                empInfo.ESIC = emp.ESIC;
                empInfo.PFContri = emp.PFContri;
                empInfo.Relieving_Date = emp.Relieving_Date.HasValue ? DateOnly.FromDateTime(emp.Relieving_Date.Value) : null;


                //empInfo.PTax = decimal.TryParse(emp.PTax, out var val) ? val : (decimal?)null;
                empInfo.Daily_Salary = emp.Daily_Salary;
                empInfo.Hourly_Salary = emp.Hourly_Salary;
                empInfo.Annual_Increment = emp.Annual_Increment;
                empInfo.DA = emp.DA;
                empInfo.Total_Deduction = emp.Total_Deduction;
                empInfo.Annual_Inc_Date = emp.Annual_Inc_Date.HasValue ? DateOnly.FromDateTime(emp.Annual_Inc_Date.Value) : null;

                empInfo.PF_No = emp.PF_No;
                empInfo.ESIC_No = emp.ESIC_No;
                empInfo.OT_Daily = emp.OT_Daily;
                empInfo.OT_Hourly = emp.OT_Hourly;
                empInfo.Professional_Tax = emp.Professional_Tax;

                //empInfo.Adhaarcard_PanCard = emp.// Save the file path to the database

                if (emp.SelectedCTC == "joining")
                {
                    empInfo.Joining_CTC_Breakup = " Joining CTC Breakup"; // or set to a specific value
                }
                else if (emp.SelectedCTC == "current")
                {
                    empInfo.Current_CTC_Breakup = " Current CTC Breakup"; // or set to a specific value
                }

                // Fetch the department code based on the department name
                var department = dbentities.HRM_OganizationTbl
                                           .FirstOrDefault(d => d.Department == emp.Department);

                if (department != null)
                {
                    empInfo.DepartmentCode = department.Department_Code;  // Assign the Department_Code
                }
                else
                {
                    ModelState.AddModelError("", "Department not found.");
                    return View(emp);
                }
                var selectdept = dbentities.HRM_OganizationTbl
                .FirstOrDefault(d => d.Department_Code == empInfo.DepartmentCode);

                if (selectdept != null)
                {
                    // Set Filled to true and Vacant to false to mark the department as filled and not vacant
                    selectdept.Status = "Filled";

                    try
                    {
                        // Save changes to the database
                        dbentities.SaveChanges();
                        Console.WriteLine("Department status updated successfully.");
                    }
                    catch (Exception ex)
                    {
                        // Handle any exceptions that might occur during SaveChanges
                        Console.WriteLine("Error saving changes: " + ex.Message);
                    }
                }
                else
                {
                    // Handle the case where the department is not found
                    Console.WriteLine("Department not found.");
                }


                System.Diagnostics.Debug.WriteLine($"Searching for Position: '{emp.Position}'");

                var selectedDesignation = dbentities.HRM_OganizationTbl
                    .FirstOrDefault(d => d.Position != null && d.Position.Equals(emp.Position, StringComparison.OrdinalIgnoreCase));

                if (selectedDesignation != null)
                {
                    System.Diagnostics.Debug.WriteLine($"Found Position: {selectedDesignation.Position}, Position_Code: {selectedDesignation.Position_Code}");
                    empInfo.Joining_Designation = selectedDesignation.Position;
                    empInfo.DesignationCode = selectedDesignation.Position_Code;
                }
                else

                {
                    System.Diagnostics.Debug.WriteLine("Position not found in HRM_OganizationTbl.");
                    ModelState.AddModelError("", "Position not found in HRM_OganizationTbl.");
                    return View(emp);  // Return the view with the error message
                }

                // Now update the JobDetail entry with the selected department and position status
                var selectedDepartment = dbentities.HRM_OganizationTbl
                    .FirstOrDefault(d => d.Department == emp.Department);

                if (selectedDepartment != null)
                {
                    // Update the status of the department and position
                    selectedDepartment.Status = "Filled";
                    selectedDepartment.Employee_Name = empInfo.FullName; // Assuming HRM_OganizationTbl has an EmployeeName column
                    selectedDepartment.Emp_Code = empInfo.Emp_Code; // Assuming HRM_OganizationTbl has an EmployeeName column

                    // Save the changes to the HRM_OganizationTbl table
                    dbentities.SaveChanges();

                    // Call the UpdatePositionStatus method to update the status for the selected position
                    UpdatePositionStatus(selectedDepartment.Position_Code);
                }



                List<int> authorityIds = new List<int>();

                var selectedAuthority = dbentities.HRM_AuthorityMatrixTbl.Find(emp.JoiningAuthorityId);
                if (selectedAuthority != null)
                {
                    empInfo.Joining_AuthorityLevel = selectedAuthority.AuthorityName;
                    empInfo.AuthorityCode = selectedAuthority.Authority_code;

                    authorityIds.Add(emp.JoiningAuthorityId);
                }

                var selectedCurrentAuthority = dbentities.HRM_AuthorityMatrixTbl.Find(emp.CurrentAuthorityId);
                if (selectedCurrentAuthority != null)
                {
                    empInfo.Current_Authoritylevel = selectedCurrentAuthority.AuthorityName;
                    empInfo.AuthorityCode = selectedCurrentAuthority.Authority_code;
                    authorityIds.Add(emp.CurrentAuthorityId);
                }




                UpdateUserAuthority(emp.Email, authorityIds, emp.Emp_Code);


                dbentities.HRM_EmpInfoTbl.Add(empInfo);
                sendmail(emp.Email, emp.Emp_Code, empInfo.FullName);

                // Save changes to EmployeeInfo table
                dbentities.SaveChanges();
                // Now update the JobDetail entry with the selected department
                // Find the selected department based on DepartmentId

                TempData["Message"] = "Employee Data Added Successfully!!"; // Use TempData for persistence
                                                                            // Redirect to the Employee action in the OrgnizationMatrix controller
                return RedirectToAction("Employee", "OrgnizationMatrix");


            }

        }


        private void UpdateUserAuthority(string email, List<int> authorityIds, string empcode)
        {
            using (var dbentities = new SwamiSamarthDbContext())
            {
                var user = dbentities.HRM_UserTbl.FirstOrDefault(u => u.username == email);

                user = new HRM_UserTbl
                {
                    username = email,
                    Emp_Code = empcode,
                };

                dbentities.HRM_UserTbl.Add(user);


                // Reset all authority flags to false
                user.CHIEF_ADMIN = false;
                user.SUPERADMIN = false;
                user.DEPUTY_SUPERADMIN = false;
                user.ADMIN = false;
                user.DEPUTY_ADMIN = false;
                user.USER = false;

                // **Define priority order for roles**
                var rolePriority = new Dictionary<int, string>
 {
     { 1, "CHIEF_ADMIN" },
     { 2, "SUPERADMIN" },
     { 3, "DEPUTY_SUPERADMIN" },
     { 4, "ADMIN" },
     { 5, "DEPUTY_ADMIN" },
     { 6, "USER" }
 };

                string selectedRole = null;

                // **Find the highest-priority role**
                foreach (var authorityId in authorityIds.OrderBy(id => id)) // Order ensures highest priority is selected
                {
                    if (rolePriority.ContainsKey(authorityId))
                    {
                        selectedRole = rolePriority[authorityId];
                        break; // Stop after selecting the first (highest-ranked) role
                    }
                }

                // **Set only one role flag to true**
                switch (selectedRole)
                {
                    case "CHIEF_ADMIN":
                        user.CHIEF_ADMIN = true;
                        break;
                    case "SUPERADMIN":
                        user.SUPERADMIN = true;
                        break;
                    case "DEPUTY_SUPERADMIN":
                        user.DEPUTY_SUPERADMIN = true;
                        break;
                    case "ADMIN":
                        user.ADMIN = true;
                        break;
                    case "DEPUTY_ADMIN":
                        user.DEPUTY_ADMIN = true;
                        break;
                    case "USER":
                        user.USER = true;
                        break;
                }

                // **Save the highest-ranked role in UserRole column**
                user.UserRole = selectedRole;

                dbentities.SaveChanges();
            }
        }

public string UploadToAzure(IFormFile FileToUpload, string empcode, string type)
        {
            string result = "";
            try
            {
                empcode = empcode.ToLower();

                // Get the storage connection string from your configuration (web.config or appsettings.json)
                string _storageConnection = _configuration.GetConnectionString("StorageConnectionString");

                // Create a BlobServiceClient using the connection string
                BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnection);

                // Get a reference to the container (ensure it's created in Azure)
                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("digitalmarketingtool");
                containerClient.CreateIfNotExists(); // Create the container if it doesn't exist

                // Set the container's access level (optional)
                containerClient.SetAccessPolicy(PublicAccessType.Blob);

                // Generate a unique file name using the empcode and current timestamp
                string _imageName = DateTime.Now.ToString("yyyyMMddHHmmss") + "-" + type + Path.GetExtension(FileToUpload.FileName);

                // Get a reference to the blob within the container
                BlobClient blobClient = containerClient.GetBlobClient(empcode + "/" + _imageName);

                // Upload the file stream to Azure Blob Storage
                using (var stream = FileToUpload.OpenReadStream())
                {
                    blobClient.Upload(stream, overwrite: true);
                }
                

                // Return the blob URL or any other required information
                string url = blobClient.Uri.ToString();
                result = _imageName;
            }
            catch (Exception ex)
            {
                // Handle any exceptions (e.g., log them)
                throw;
            }

            return result;
        }


        private void sendmail(string email, string Emp_Code, string FullName)
        {
            // Configure the SMTP client
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.EnableSsl = true;
            smtpClient.Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd");

            // Create the email message
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("hrm@synergy5m.com");
            mailMessage.To.Add(email);
            mailMessage.CC.Add("ab@synergy5m.com");
            mailMessage.Subject = "Welcome to Synergy5M - Create Your Password";

            // Define the link
            //string link = $"https://synergy5m-shripaderp8-bvgth5fuf2a4drgq.centralindia-01.azurewebsites.net/OrgnizationMatrix/EmployeeRegistrationForm";
            string link = $"https://synergy5m-shripaderp8-bvgth5fuf2a4drgq.centralindia-01.azurewebsites.net/OrgnizationMatrix/EmployeeRegistrationForm?Emp_Code={Emp_Code}";

            // Define the email body with the Emp_Code, link, and message
            string paragraph = "<p style=\"border:0px solid rgb(217,217,227);box-sizing:border-box;margin:0px 0px 1.25em;color:rgb(55,65,81);font-family:Söhne,ui-sans-serif,system-ui,-apple-system,&quot;Segoe UI&quot;,Roboto,Ubuntu,Cantarell,&quot;Noto Sans&quot;,sans-serif,&quot;Helvetica Neue&quot;,Arial,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;,&quot;Noto Color Emoji&quot;;font-size:16px;background-color:rgb(247,247,248)\">";
            string mailbody = "<html><head></head><body>";

            mailbody += paragraph + $"Mr/Mrs:<strong>{FullName}</strong>.</p>\n";
            mailbody += paragraph + $"We are thrilled to welcome you to Synergy5M!</p>\n";
            mailbody += paragraph + $" We are confident that your skills and enthusiasm will be a great addition to our team.</p>\n";
            mailbody += paragraph + $"Your Employee Code is: <strong>{Emp_Code}</strong>.</p>\n";
            mailbody += paragraph + $"To complete your registration and create your password, please click the link below:</p>\n";
            mailbody += paragraph + $"<a href=\"{link}\" style=\"color:blue;text-decoration:underline;\">Create Your Password</a></p>\n";
            mailbody += paragraph + "If you have any questions or need any assistance, feel free to reach out to us at info@synergy5m.com.</p>\n";

            mailbody += paragraph + "Best regards,</p>\n";
            mailbody += paragraph + "S S Biradar</p>\n";
            mailbody += paragraph + "CEO</p>\n";
            mailbody += paragraph + "<p>Shirpad Polymers Pvt. Ltd.</p>\n";
            mailbody += paragraph + "Email:srbiradar@shripadploymers.com</p>\n";

            mailbody += "</body></html>\n";

            // Set the email body and specify that it is HTML
            mailMessage.Body = mailbody;
            mailMessage.IsBodyHtml = true;

            try
            {
                // Send the email
                smtpClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                // Handle any errors
                Console.WriteLine("Error sending email: " + ex.Message);
            }
        }

        public ActionResult EmpList()
        {
            using (SwamiSamarthDbContext dbentities =new SwamiSamarthDbContext())
            {
                var emplist = dbentities.HRM_EmpInfoTbl
                    .Where(x => x.Resign == 0 || x.Resign == null)
                    .ToList();

                return View(emplist);
            }
        }
        public ActionResult Download(string name, string empcode)
        {
            try
            {
                // Get the storage connection string from your configuration (web.config or appsettings.json)
                string _storageConnection = _configuration.GetConnectionString("StorageConnectionString");

                // Create a BlobServiceClient using the connection string
                BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnection);

                // Get a reference to the container (ensure it's created in Azure)
                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("digitalmarketingtool");

                // Get a reference to the blob
                BlobClient blobClient = containerClient.GetBlobClient(empcode.ToLower() + "/" + name);

                // Open the blob as a stream
                Stream blobStream = blobClient.OpenRead();

                // Get the blob properties to access the content type
                var blobProperties = blobClient.GetProperties().Value;

                // Return the file as a result
                return File(blobStream, blobProperties.ContentType, name);
            }
            catch (Exception ex)
            {
                // Handle any exceptions (e.g., log them)
                return RedirectToAction("EmpList");
            }
        }


        public ActionResult OrgnizationEmpList()
        {
            using (SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext())
            {
                List<HRM_OrganizationDataTbl> infolist = dbentities.HRM_OrganizationDataTbl.Distinct().ToList();

                // Populate ViewBag.userlist with SelectListMASTER_ItemTbl fetched from Employees table
                ViewBag.userlist = GetUserList(dbentities);

                return View(infolist);
            }
        }
        public ActionResult GetEmployeeInfo()
        {
            var Emp_Name = _db.HRM_EmpInfoTbl
                            .Select(i => new
                            {
                                FullName = i.Name + " " + i.Surname
                            })
                            .Distinct()
                            .ToList();
            return Json(Emp_Name);
        }
        public ActionResult GetReportingInfo()
        {
            var Rep_Name = _db.HRM_EmpInfoTbl
                            .Select(i => new
                            {
                                FullName = i.Name + " " + i.Surname
                            })
                            .Distinct()
                            .ToList();
            return Json(Rep_Name);
        }

        private IEnumerable<SelectListItem> GetUserList(SwamiSamarthDbContext dbentities)
        {
            // Fetch the employees from the database and create SelectListMASTER_ItemTbl
            var users = dbentities.HRM_EmpInfoTbl
                .Select(e => new SelectListItem
                {
                    Text = e.Name, // Adjust property names as per your Employee model
                    Value = e.Id.ToString() // Assuming Id is the primary key
                })
                .ToList();

            return users;
        }


    }
}
