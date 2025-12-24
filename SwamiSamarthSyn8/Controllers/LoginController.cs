//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.EntityFrameworkCore;
//using SwamiSamarthSyn8.Models;
//using System.Net.Mail;
//using System.Net;
//using Microsoft.AspNetCore.Http;

//using SwamiSamarthSyn8.Data;
//using Register = SwamiSamarthSyn8.Models.Register;

//namespace SwamiSamarthSyn8.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class LoginController : Controller
//    {
//        private string _storageConnectionString;
//        private readonly SwamiSamarthDbContext _context;

//        public IActionResult Index()
//        {
//            return View();
//        }
//        public LoginController(SwamiSamarthDbContext context)
//        {
//            _context = context;
//        }

//        // Action method to display the contact form hgfdg
//        //public ActionResult Contact_Us()
//        //{
//        //    string videoFileName = UploadVideo(_storageConnectionString);

//        //    // Pass the video file name to the Contact_Us view
//        //    ViewBag.VideoFileName = videoFileName;
//        //    return DisplayVideo(videoFileName);
//        //}

//        //// Action method to handle form submission and video upload
//        //[HttpPost]
//        //[ValidateAntiForgeryToken]
//        //public ActionResult Contact_Us(HRM_ContactusTbl model, HttpPostedFileBase videoFile)
//        //{
//        //    if (ModelState.IsValid)
//        //    {
//        //        try
//        //        {
//        //            // Save contact form details to the database
//        //            using (var db = new SwamiSamarthDbContext())
//        //            {
//        //                var contact = new HRM_ContactusTbl
//        //                {
//        //                    Name = model.Name,
//        //                    Message = model.Message,
//        //                    Mobile = model.Mobile,
//        //                    Subject = model.Subject,
//        //                    Email = model.Email
//        //                };

//        //                db.HRM_ContactusTbl.Add(contact);
//        //                db.SaveChanges();
//        //            }

//        //            // Send email to sales
//        //            SendEmailToSales(model);

//        //            return RedirectToAction("Index");
//        //        }
//        //        catch (Exception ex)
//        //        {
//        //            ViewBag.EmailErrorMessage = "Error processing request: " + ex.Message;
//        //            // Log the exception for further investigation
//        //            // logger.Error(ex, "An error occurred while processing the contact form.");
//        //        }
//        //    }

//        //    // If model state is not valid, return the view with validation errors
//        //    return View(model);
//        //}

//        // Action method to upload video to Azure Blob Storage
//        //private string UploadVideo(string storageConnectionString)
//        //{
//        //    try
//        //    {
//        //        // Path to the local video file
//        //        string videoFilePath = Server.MapPath("~/Images/synergy5m_06.mp4");

//        //        // Retrieve storage account from connection string
//        //        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

//        //        // Create the blob client
//        //        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

//        //        // Retrieve a reference to a container
//        //        CloudBlobContainer container = blobClient.GetContainerReference("potential-vendor-master");

//        //        // Create the container if it doesn't already exist
//        //        container.CreateIfNotExists();

//        //        // Set the permissions so that the blobs are public
//        //        container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

//        //        // Generate a unique file name for the video
//        //        string uniqueFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + "_video.mp4";

//        //        // Retrieve reference to a blob
//        //        CloudBlockBlob blockBlob = container.GetBlockBlobReference(uniqueFileName);

//        //        // Upload the file
//        //        blockBlob.UploadFromFile(videoFilePath);

//        //        // Return the unique file name of the uploaded video
//        //        return uniqueFileName;
//        //    }
//        //    catch (FormatException ex)
//        //    {
//        //        // Log the format exception
//        //        // Example: Log.Error("Error parsing connection string", ex);
//        //        throw;
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        // Log the exception
//        //        // Example: Log.Error("Error uploading video", ex);
//        //        throw;
//        //    }
//        //}

//        //// Action method to display the video on a webpage
//        //// Action method to display the video on a webpage
//        //public ActionResult DisplayVideo(string videoFileName)
//        //{
//        //    if (!string.IsNullOrEmpty(videoFileName))
//        //    {
//        //        try
//        //        {
//        //            // Retrieve storage account from connection string
//        //            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(_storageConnectionString);

//        //            // Create the blob client
//        //            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

//        //            // Retrieve a reference to a container
//        //            CloudBlobContainer container = blobClient.GetContainerReference("potential-vendor-master");

//        //            // Retrieve reference to a blob
//        //            CloudBlockBlob blockBlob = container.GetBlockBlobReference(videoFileName);

//        //            // Generate a URL with SAS token to provide temporary access to the blob
//        //            string sasBlobToken = blockBlob.GetSharedAccessSignature(new SharedAccessBlobPolicy()
//        //            {
//        //                Permissions = SharedAccessBlobPermissions.Read,
//        //                SharedAccessExpiryTime = DateTime.UtcNow.AddHours(1) // Adjust expiry time as needed
//        //            });

//        //            // Construct the URL with SAS token
//        //            string videoUrl = blockBlob.Uri + sasBlobToken;

//        //            // Pass the video URL to the view
//        //            ViewBag.VideoUrl = videoUrl;

//        //            return View();
//        //        }
//        //        catch (Exception ex)
//        //        {
//        //            // Log the exception for further investigation
//        //            System.Diagnostics.Debug.WriteLine("Error fetching video from Azure Blob Storage: " + ex.Message);
//        //            return Content("Error fetching video: " + ex.Message);
//        //        }
//        //    }

//        //    return Content("No video file found.");
//        //}

//        private void SendEmailToSales(HRM_ContactusTbl model)
//        {
//            using (var smtpClient = new SmtpClient("smtp.gmail.com", 587))
//            {
//                smtpClient.EnableSsl = true;
//                smtpClient.Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd ");

//                var mailMessage = new MailMessage();
//                mailMessage.From = new MailAddress(model.Email, model.Name);
//                mailMessage.To.Add("ab@synergy5m.com");
//                mailMessage.Subject = "Contact_Us Enquiry";

//                // Constructing the HTML body
//                string mailbody = "<html><head><style>";
//                mailbody += "body { font-family: Tahoma; }";
//                mailbody += "p { color: #333; font-size: 16px; }";
//                mailbody += "</style></head><body>";
//                mailbody += "<p><b>Name:</b> " + model.Name + "</p>";
//                mailbody += "<p><b>Mobile:</b> " + model.Mobile + "</p>";
//                mailbody += "<p><b>Email:</b> " + model.Email + "</p>";
//                mailbody += "<p><b>Subject: </b> " + model.Subject + "</p>";
//                mailbody += "<p><b>Message:</b><br/>" + model.Message + "</p>";

//                mailbody += "<p>Thanks</p>";
//                mailbody += "</body></html>";

//                // Set the HTML body to the mail message
//                mailMessage.Body = mailbody;
//                mailMessage.IsBodyHtml = true;

//                smtpClient.Send(mailMessage);
//            }
//        }




       
//        //[HttpGet]
//        //public ActionResult RegistrationForm()
//        //{
//        //    using (SwamiSamarthDbContext _DemoEntities = new SwamiSamarthDbContext())
//        //    {
//        //        var isChiefAdminExists = _DemoEntities.HRM_AuthorityMatrixTbl
//        //                                  .Any(a => a.Authority_code == "01" && a.IsSelected == "Yes");

//        //        if (isChiefAdminExists)
//        //        {
//        //            TempData["AccessDenied"] = "Chief Admin already exists.";
//        //            return RedirectToAction("Login", "Login");
//        //        }

//        //        return View(); // show registration form
//        //    }
//        //}
//        //public JsonResult GetAuthorities()
//        //{
//        //    using (var db = new SwamiSamarthDbContext())
//        //    {
//        //        var authorities = db.HRM_AuthorityMatrixTbl
//        //                            .Where(a => a.IsSelected.Trim().ToLower() != "yes") // Ensure case insensitivity & trim spaces
//        //                            .Select(a => new
//        //                            {
//        //                                a.Id,
//        //                                a.AuthorityName,
//        //                                a.Authority_code,
//        //                                a.IsSelected
//        //                            })
//        //                            .ToList();

//        //        return Json(authorities);
//        //    }
//        //}


//        //public JsonResult GetDesignations()
//        //{
//        //    using (var db = new SwamiSamarthDbContext()) // Use your actual DbContext
//        //    {
//        //        var designations = db.HRM_DesignationTbl
//        //                            .Select(d => new { d.Id, d.DesignationName, d.Designation_code })
//        //                            .ToList();
//        //        return Json(designations);
//        //    }
//        //}



//        //public ActionResult GetSource()
//        //{
//        //    using (var _DemoEntities = new SwamiSamarthDbContext())
//        //    {
//        //        var source = _DemoEntities.MergeTblDatas
//        //                     .Select(i => i.src_name)
//        //                     .Distinct()
//        //                     .ToList();

//        //        return Json(source);
//        //    }
//        //}

//        //public ActionResult GetContinent(string source)
//        //{
//        //    using (var _DemoEntities = new SwamiSamarthDbContext())
//        //    {
//        //        var continentList = _DemoEntities.MergeTblDatas
//        //                            .Where(c => c.src_name == source)
//        //                            .Select(c => c.conti_name)
//        //                            .Distinct()
//        //                            .ToList();

//        //        return Json(continentList);
//        //    }
//        //}

//        //public ActionResult GetCountry(string source, string continent)
//        //{
//        //    using (var _DemoEntities = new SwamiSamarthDbContext())
//        //    {
//        //        var countryList = _DemoEntities.MergeTblDatas
//        //                          .Where(c => c.src_name == source && c.conti_name == continent)
//        //                          .Select(c => c.Country_Name)
//        //                          .Distinct()
//        //                          .ToList();
                
//        //        return Json(countryList);
//        //    }
//        //}
//        //public ActionResult GetState(string source, string continent, string country)
//        //{
//        //    using (var _DemoEntities = new SwamiSamarthDbContext())
//        //    {
//        //        var state = _DemoEntities.MergeTblDatas
//        //            .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country)
//        //            .Select(c => c.state_name)
//        //            .Distinct()
//        //            .ToList();

//        //        return Json(state);
//        //    }
//        //}
//        //public ActionResult GetCity(string source, string continent, string country, string state)
//        //{
//        //    using (var _DemoEntities = new SwamiSamarthDbContext())
//        //    {
//        //        var city1 = _DemoEntities.MergeTblDatas
//        //            .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country && c.state_name == state)
//        //            .Select(c => c.city_name)
//        //            .Distinct()
//        //            .ToList();

//        //        return Json(city1);
//        //    }
//        //}
//        public ActionResult Signup()
//        {
//            return View();
//        }
//        public ActionResult Signout()
//        {
//            // Clear all session data
//            HttpContext.Session.Clear();

//            // Redirect to login page
//            return RedirectToAction("Login", "Login");
//        }
//        //[HttpGet]
//        //public ActionResult RegistrationForm()
//        //{
//        //    using (SwamiSamarthDbContext _DemoEntities = new SwamiSamarthDbContext())
//        //    {
//        //        // ✅ Check if Chief Admin already exists
//        //        var isChiefAdminExists = _DemoEntities.HRM_AuthorityMatrixTbl
//        //                                .Any(a => a.Authority_code == "01" && a.IsSelected == "Yes");

//        //        if (isChiefAdminExists)
//        //        {
//        //            TempData["AccessDenied"] = "Chief Admin already exists.";
//        //            return RedirectToAction("Login", "Login");
//        //        }

//        //        // ✅ Populate dropdowns
//        //        var authorities = _DemoEntities.HRM_AuthorityMatrixTbl
//        //                            .Select(a => new { a.Authority_code, a.AuthorityName })
//        //                            .ToList();
//        //        ViewBag.AuthorityList = new SelectList(authorities, "Authority_code", "AuthorityName");

//        //        var designations = _DemoEntities.HRM_DesignationTbl
//        //                            .Select(d => new { d.Designation_code, d.DesignationName })
//        //                            .ToList();
//        //        ViewBag.DesignationList = new SelectList(designations, "Designation_code", "DesignationName");

//        //        return View(); // ✅ Show registration form
//        //    }
//        //}
//        [HttpGet("GetSource")]
//        public IActionResult GetSource()
//        {
//            using (var _DemoEntities = new SwamiSamarthDbContext())
//            {
//                var source = _DemoEntities.MergeTblDatas
//                             .Select(i => i.src_name)
//                             .Distinct()
//                             .ToList();
//                return Ok(source);
//            }
//        }

//        [HttpGet("GetContinent")]
//        public IActionResult GetContinent([FromQuery] string source)
//        {
//            using (var _DemoEntities = new SwamiSamarthDbContext())
//            {
//                var continentList = _DemoEntities.MergeTblDatas
//                                    .Where(c => c.src_name == source)
//                                    .Select(c => c.conti_name)
//                                    .Distinct()
//                                    .ToList();
//                return Ok(continentList);
//            }
//        }

//        [HttpGet("GetCountry")]
//        public IActionResult GetCountry([FromQuery] string source, [FromQuery] string continent)
//        {
//            using (var _DemoEntities = new SwamiSamarthDbContext())
//            {
//                var countryList = _DemoEntities.MergeTblDatas
//                                  .Where(c => c.src_name == source && c.conti_name == continent)
//                                  .Select(c => c.Country_Name)
//                                  .Distinct()
//                                  .ToList();
//                return Ok(countryList);
//            }
//        }

//        [HttpGet("GetState")]
//        public IActionResult GetState([FromQuery] string source, [FromQuery] string continent, [FromQuery] string country)
//        {
//            using (var _DemoEntities = new SwamiSamarthDbContext())
//            {
//                var state = _DemoEntities.MergeTblDatas
//                            .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country)
//                            .Select(c => c.state_name)
//                            .Distinct()
//                            .ToList();
//                return Ok(state);
//            }
//        }

//        [HttpGet("GetCity")]
//        public IActionResult GetCity([FromQuery] string source, [FromQuery] string continent, [FromQuery] string country, [FromQuery] string state)
//        {
//            using (var _DemoEntities = new SwamiSamarthDbContext())
//            {
//                var city1 = _DemoEntities.MergeTblDatas
//                            .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country && c.state_name == state)
//                            .Select(c => c.city_name)
//                            .Distinct()
//                            .ToList();
//                return Ok(city1);
//            }
//        }

//        [HttpGet("GetAuthorities")]
//        public IActionResult GetAuthorities()
//        {
//            using (var _DemoEntities = new SwamiSamarthDbContext())
//            {
//                var authorities = _DemoEntities.HRM_AuthorityMatrixTbl
//                .Where(a => a.IsSelected != null && a.IsSelected.Trim().ToLower() != "yes")
//                .Select(a => new { a.Id, a.AuthorityName, a.Authority_code })
//                .ToList();
//                return Ok(authorities);
//            }
//        }
//        [HttpGet("GetDesignations")]
//        public IActionResult GetDesignations()
//        { 

//            using (var db = new SwamiSamarthDbContext())
//            {
//                var designations = db.HRM_DesignationTbl
//                    .Select(d => new
//                    {
//                        d.Id,
//                        d.DesignationName,
//                        d.Designation_code
//                    })
//                    .ToList();

//                return Ok(designations);
//            }
//        }
//        [HttpPost]
//        [Route("api/Login/Register")]
//        public JsonResult Register([FromBody] Register register)
//        {
//            using (SwamiSamarthDbContext _DemoEntities = new SwamiSamarthDbContext())
//            {
//                var userPresent = _DemoEntities.HRM_UserTbl
//                                  .FirstOrDefault(x => x.username == register.email_id);

//                if (userPresent != null)
//                {
//                    return Json(new { success = false, message = "User already registered." });
//                }

//                var authorityData = _DemoEntities.HRM_AuthorityMatrixTbl
//                                      .FirstOrDefault(a => a.Authority_code == register.authority);

//                var designationData = _DemoEntities.HRM_DesignationTbl
//                                        .FirstOrDefault(d => d.Designation_code == register.designation);

//                HRM_UserTbl newUser = new HRM_UserTbl
//                {
//                    username = register.email_id,
//                    password = register.password,
//                    UserRole = authorityData.AuthorityName,
//                    Power_Of_Authority = authorityData.AuthorityName
//                };

//                if (register.authority == "01")
//                {
//                    newUser.MaterialManagement = true;
//                    newUser.SalesAndMarketing = true;
//                    newUser.HRAndAdmin = true;
//                    newUser.AccountAndFinance = true;
//                    newUser.Masters = true;
//                    newUser.Dashboard = true;
//                    newUser.ProductionAndQuality = true;
//                    newUser.External_buyer_seller = true;
//                }

//                UpdateUserAuthority(newUser, authorityData.Authority_code);
//                _DemoEntities.HRM_UserTbl.Add(newUser);
//                _DemoEntities.SaveChanges();

//                int userId = newUser.id;

//                HRM_AdminRegTbl registration = new HRM_AdminRegTbl
//                {
//                    company_name = register.company_name,
//                    contact_person = register.contact_person,
//                    email_id = register.email_id,
//                    contact_no = register.contact_no,
//                    gst_no = register.gst_no,
//                    source = register.source,
//                    continent = register.continent,
//                    country = register.country,
//                    state = register.state,
//                    city = register.city,
//                    authority = authorityData.AuthorityName,
//                    designation = designationData?.DesignationName,
//                    userid = userId
//                };

//                _DemoEntities.HRM_AdminRegTbl.Add(registration);
//                _DemoEntities.SaveChanges();

//                sendmail(register.email_id);

//                return Json(new { success = true, message = "Registered successfully! Email sent." });
//            }
//        }


//        //[HttpPost]
//        //public ActionResult RegistrationForm(Register register)
//        //{
//        //    using (SwamiSamarthDbContext _DemoEntities = new SwamiSamarthDbContext())
//        //    {
//        //        // Check if user is already registered
//        //        var userPresent = _DemoEntities.HRM_UserTbl
//        //                          .FirstOrDefault(x => x.username == register.email_id);

//        //        if (userPresent == null)
//        //        {
//        //            // Fetch Authority Data
//        //            var authorityData = _DemoEntities.HRM_AuthorityMatrixTbl
//        //                                   .FirstOrDefault(a => a.Authority_code == register.authority);

//        //            // Fetch Designation Data
//        //            var designationData = _DemoEntities.HRM_DesignationTbl
//        //                                     .FirstOrDefault(d => d.Designation_code == register.designation);

//        //            // **Step 1: Create & Save New User**
//        //            HRM_UserTbl newUser = new HRM_UserTbl
//        //            {
//        //                username = register.email_id,
//        //                password = register.password,
//        //                UserRole = authorityData.AuthorityName, // Assign role dynamically
//        //                Power_Of_Authority = authorityData.AuthorityName // Assign Power_Of_Authority



//        //            };
//        //            if (register.authority == "01") // Assuming "01" is CHIEF_ADMIN
//        //            {

//        //                newUser.MaterialManagement = true;
//        //                newUser.SalesAndMarketing = true;
//        //                newUser.HRAndAdmin = true;
//        //                newUser.AccountAndFinance = true;
//        //                newUser.Masters = true;
//        //                newUser.Dashboard = true;
//        //                newUser.ProductionAndQuality = true;
//        //                newUser.External_buyer_seller = true;
//        //            }

//        //            // Set Authority Flags
//        //            UpdateUserAuthority(newUser, authorityData.Authority_code);
//        //            _DemoEntities.HRM_UserTbl.Add(newUser);
//        //            _DemoEntities.SaveChanges();

//        //            int UserId = newUser.id; // Get new User ID

//        //            // **Step 2: Save Registration Details**
//        //            HRM_AdminRegTbl registration = new HRM_AdminRegTbl
//        //            {
//        //                company_name = register.company_name,
//        //                contact_person = register.contact_person,
//        //                email_id = register.email_id,
//        //                contact_no = register.contact_no,
//        //                gst_no = register.gst_no,
//        //                source = register.source,
//        //                continent = register.continent,
//        //                country = register.country,
//        //                state = register.state,
//        //                city = register.city,
//        //                authority = authorityData.AuthorityName,
//        //                designation = designationData?.DesignationName,
//        //                userid = UserId
//        //            };

//        //            _DemoEntities.HRM_AdminRegTbl.Add(registration);
//        //            _DemoEntities.SaveChanges();

//        //            // **Step 3: Update IsSelected in HRM_AuthorityMatrixTbl**
//        //            // Ensure only CHIEF_ADMIN is marked as selected
//        //            var updateAuthority = _DemoEntities.HRM_AuthorityMatrixTbl.FirstOrDefault(a => a.Authority_code == "01");

//        //            if (updateAuthority != null)
//        //            {
//        //                // Reset all IsSelected values to "No"
//        //                _DemoEntities.HRM_AuthorityMatrixTbl.ToList().ForEach(a => a.IsSelected = "No");

//        //                // Set CHIEF_ADMIN as selected
//        //                if (register.authority == "01")
//        //                {
//        //                    updateAuthority.IsSelected = "Yes";
//        //                }

//        //                _DemoEntities.SaveChanges();
//        //            }

//        //            // **Step 4: Retrieve and Assign UserRole Based on Authority**
//        //            var userAuthority = _DemoEntities.HRM_UserTbl
//        //                                     .Where(u => u.id == UserId)
//        //                                     .Select(u => new
//        //                                     {
//        //                                         u.CHIEF_ADMIN,
//        //                                         u.SUPERADMIN,
//        //                                         u.ADMIN,
//        //                                         u.DEPUTY_SUPERADMIN,
//        //                                         u.DEPUTY_ADMIN
//        //                                     })
//        //                                     .FirstOrDefault();

//        //            if (userAuthority != null)
//        //            {
//        //                string userRole = null;

//        //                if (userAuthority.CHIEF_ADMIN == true) userRole = "CHIEF_ADMIN";
//        //                else if (userAuthority.SUPERADMIN == true) userRole = "SUPERADMIN";
//        //                else if (userAuthority.ADMIN == true) userRole = "ADMIN";
//        //                else if (userAuthority.DEPUTY_SUPERADMIN == true) userRole = "DEPUTY_SUPERADMIN";
//        //                else if (userAuthority.DEPUTY_ADMIN == true) userRole = "DEPUTY_ADMIN";

//        //                // Update UserRole in HRM_UserTbl
//        //                if (!string.IsNullOrEmpty(userRole))
//        //                {
//        //                    var updateUser = _DemoEntities.HRM_UserTbl.FirstOrDefault(u => u.id == UserId);
//        //                    if (updateUser != null)
//        //                    {
//        //                        updateUser.UserRole = userRole; // Set UserRole to the correct role name
//        //                        updateUser.Power_Of_Authority = userRole; // Save same value in Power_Of_Authority

//        //                        _DemoEntities.SaveChanges();
//        //                    }
//        //                }
//        //            }

//        //            sendmail(register.email_id);
//        //            return RedirectToAction("Business_View_Front_Page", "Login");
//        //        }

//        //        TempData["userpresent"] = "Already registered.";
//        //        return RedirectToAction("RegistrationForm", "Login");
//        //    }
//        //}



//        private void UpdateUserAuthority(HRM_UserTbl user, string authorityCode)
//        {
//            // Reset all authority flags to false
//            user.CHIEF_ADMIN = false;
//            user.SUPERADMIN = false;
//            user.DEPUTY_SUPERADMIN = false;
//            user.ADMIN = false;
//            user.DEPUTY_ADMIN = false;
//            user.USER = false;

//            // Handle numeric codes and map them to authority names
//            switch (authorityCode)
//            {
//                case "01": // SUPERADMIN
//                    user.CHIEF_ADMIN = true;
//                    break;
//                case "02": // CHIEF_ADMIN
//                    user.SUPERADMIN = true;
//                    break;
//                case "03": // DEPUTY_SUPERADMIN
//                    user.DEPUTY_SUPERADMIN = true;
//                    break;
//                case "04": // ADMIN
//                    user.ADMIN = true;
//                    break;
//                case "05": // DEPUTY_ADMIN
//                    user.DEPUTY_ADMIN = true;
//                    break;
//                case "06": // USER
//                    user.USER = true;
//                    break;
//                default:
//                    // Handle invalid authority codes
//                    throw new ArgumentOutOfRangeException($"Invalid authorityCode: {authorityCode}. Please ensure the value is valid.");
//            }
//        }

//        private void sendmail(string email)
//        {
//            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
//            smtpClient.EnableSsl = true;
//            smtpClient.Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd ");

//            MailMessage mailMessage = new MailMessage();
//            mailMessage.From = new MailAddress("hrm@synergy5m.com");
//            mailMessage.To.Add(email);
//            mailMessage.CC.Add("ab@synergy5m.com");
//            mailMessage.Subject = "THANKS FOR REGISTRATION";
//            // mailMessage.Body = "hii welcome to synergy5m";
//            string paragraph = "<p style=\"border:0px solid rgb(217,217,227);box-sizing:border-box;margin:0px 0px 1.25em;color:rgb(55,65,81);font-family:Söhne,ui-sans-serif,system-ui,-apple-system,&quot;Segoe UI&quot;,Roboto,Ubuntu,Cantarell,&quot;Noto Sans&quot;,sans-serif,&quot;Helvetica Neue&quot;,Arial,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;,&quot;Noto Color Emoji&quot;;font-size:16px;background-color:rgb(247,247,248)\">";
//            string mailbody = "<html><head>";
//            mailbody += "</head><body>";

//            mailbody += paragraph + "Dear sir,</p>\n";
//            mailbody += paragraph + "Thank you for expressing interest in our innovative business model. At Synergy5M LLP, we specialize in providing expert services to connect potential buyers and suppliers, helping them expand their business beyond traditional channels.</p>\n";
//            mailbody += paragraph + "Your credentials are highly valuable to us. After a thorough review by our team, we will proceed with your registration or request any additional information if necessary. We understand the importance of your time and will respond promptly.</p>\n";
//            mailbody += paragraph + "If you have any questions or need assistance in the meantime, please feel free to contact us at info@synergy5m.com.</p>\n";


//            mailbody += paragraph + "Best regards,</p>\n";
//            mailbody += paragraph + "Ajay Gokhale </p>\n";
//            mailbody += paragraph + " CEO </p>\n";
//            mailbody += paragraph + "Synergy5M LLP</p>\n";
//            mailbody += paragraph + "Email: ab@synergy5m.com</p>\n";
//            mailbody += "</body></html>\n";
//            // Create the alternate view with the HTML body
//            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(mailbody, null, "text/html");
//            // Add the alternate view to the mail message
//            mailMessage.AlternateViews.Add(htmlView);
//            mailMessage.Body = mailbody;
//            smtpClient.Send(mailMessage);

//        }
//        // GET: Login
//        [AllowAnonymous]
//        public ActionResult Login()
//        {
//            return View();
//        }


//        //[HttpPost]
//        //    public ActionResult Login(string username, string password)
//        //    {
//        //        using (var db = new SwamiSamarthDbContext())
//        //        {
//        //            // Step 1: Fetch user by username
//        //            var userdb = db.HRM_UserTbl.FirstOrDefault(x => x.username == username);

//        //            // Step 2: Check if user exists and password matches (case-sensitive)
//        //            if (userdb != null && string.Equals(userdb.password.Trim(), password.Trim(), StringComparison.Ordinal))
//        //            {
//        //                // ✅ Correct login
//        //                if (!string.IsNullOrEmpty(userdb.Power_Of_Authority) && userdb.Power_Of_Authority == "CHIEF_ADMIN")
//        //                {
//        //                    HttpContext.Session.SetString("UserName", userdb.username);
//        //                    HttpContext.Session.SetString("UserRole", userdb.UserRole ?? "");
//        //                    HttpContext.Session.SetString("Emp_Code", userdb.Emp_Code ?? "");
//        //                    HttpContext.Session.SetString("PowerAuthority", userdb.Power_Of_Authority ?? "");

//        //                    bool isChiefAdmin = userdb.Power_Of_Authority == "CHIEF_ADMIN";
//        //                    bool isAdmin = userdb.UserRole == "CHIEF_ADMIN" || isChiefAdmin;
//        //                    HttpContext.Session.SetString("ShowUserDataButton", isAdmin.ToString());
//        //                    HttpContext.Session.SetString("ShowUserProfileButton", (!string.IsNullOrEmpty(userdb.Emp_Code)).ToString());

//        //                    List<string> selectTools = new List<string>();
//        //                    if (userdb.MaterialManagement == true) selectTools.Add("MaterialManagement");
//        //                    if (userdb.SalesAndMarketing == true) selectTools.Add("SalesAndMarketing");
//        //                    if (userdb.HRAndAdmin == true) selectTools.Add("HRAndAdmin");
//        //                    if (userdb.AccountAndFinance == true) selectTools.Add("AccountAndFinance");
//        //                    if (userdb.Masters == true) selectTools.Add("Masters");
//        //                    if (userdb.Dashboard == true) selectTools.Add("Dashboard");
//        //                    if (userdb.ProductionAndQuality == true) selectTools.Add("ProductionAndQuality");
//        //                    if (userdb.External_buyer_seller == true) selectTools.Add("External_buyer_seller");

//        //                    ViewBag.EmpCode = userdb.Emp_Code;
//        //                    TempData["SelectedTools"] = selectTools;
//        //                    TempData.Keep();
//        //                    return RedirectToAction("Index", "Home");
//        //                }
//        //                else
//        //                {
//        //                    HttpContext.Session.SetString("UserName", userdb.username);
//        //                    HttpContext.Session.SetString("Emp_Code", userdb.Emp_Code ?? "");
//        //                    HttpContext.Session.SetString("ShowUserProfileButton", (!string.IsNullOrEmpty(userdb.Emp_Code)).ToString());

//        //                    List<string> selectTools = new List<string>();
//        //                    if (userdb.MaterialManagement == true) selectTools.Add("MaterialManagement");
//        //                    if (userdb.SalesAndMarketing == true) selectTools.Add("SalesAndMarketing");
//        //                    if (userdb.HRAndAdmin == true) selectTools.Add("HRAndAdmin");
//        //                    if (userdb.AccountAndFinance == true) selectTools.Add("AccountAndFinance");
//        //                    if (userdb.Masters == true) selectTools.Add("Masters");
//        //                    if (userdb.Dashboard == true) selectTools.Add("Dashboard");
//        //                    if (userdb.ProductionAndQuality == true) selectTools.Add("ProductionAndQuality");

//        //                    ViewBag.EmpCode = userdb.Emp_Code;
//        //                    TempData["SelectedTools"] = selectTools;
//        //                    TempData.Keep();
//        //                    return RedirectToAction("Index", "Home");
//        //                }
//        //            }
//        //            else
//        //            {
//        //                // ❌ Wrong username or password
//        //                ViewBag.Message = "Invalid username or password";
//        //                return View();
//        //            }
//        //        }
//        //    }
//        [HttpPost("Login")]
//        public IActionResult Login([FromBody] userlogin model)
//        {
//            if (model == null || string.IsNullOrWhiteSpace(model.username) || string.IsNullOrWhiteSpace(model.password))
//            {
//                return Json(new { success = false, message = "Username and password are required" });
//            }

//            var userdb = _context.HRM_UserTbl.FirstOrDefault(x => x.username == model.username);

//            if (userdb != null && string.Equals(userdb.password.Trim(), model.password.Trim(), System.StringComparison.Ordinal))
//            {
//                // ✅ Correct login
//                HttpContext.Session.SetString("UserName", userdb.username);
//                HttpContext.Session.SetString("Emp_Code", userdb.Emp_Code ?? "");
//                HttpContext.Session.SetString("UserRole", userdb.UserRole ?? "");
//                HttpContext.Session.SetString("PowerAuthority", userdb.Power_Of_Authority ?? "");

//                bool isChiefAdmin = userdb.Power_Of_Authority == "CHIEF_ADMIN";
//                bool isAdmin = userdb.UserRole == "CHIEF_ADMIN" || isChiefAdmin;

//                HttpContext.Session.SetString("ShowUserDataButton", isAdmin.ToString());
//                HttpContext.Session.SetString("ShowUserProfileButton", (!string.IsNullOrEmpty(userdb.Emp_Code)).ToString());

//                // Modules
//                List<string> selectTools = new List<string>();
//                if (userdb.MaterialManagement == true) selectTools.Add("MaterialManagement");
//                if (userdb.SalesAndMarketing == true) selectTools.Add("SalesAndMarketing");
//                if (userdb.HRAndAdmin == true) selectTools.Add("HRAndAdmin");
//                if (userdb.AccountAndFinance == true) selectTools.Add("AccountAndFinance");
//                if (userdb.Masters == true) selectTools.Add("Masters");
//                if (userdb.Dashboard == true) selectTools.Add("Dashboard");
//                if (userdb.ProductionAndQuality == true) selectTools.Add("ProductionAndQuality");
//                if (userdb.External_buyer_seller == true) selectTools.Add("External_buyer_seller");

//                TempData["SelectedTools"] = selectTools;
//                TempData.Keep();

//                return Json(new { success = true });
//            }
//            else
//            {
//                // ❌ Wrong username or password
//                return Json(new { success = false, message = "Invalid username or password" });
//            }
//        }
    

//    //public ActionResult ChangeAuthority()
//    //{
//    //    using (var db = new SwamiSamarthDbContext())
//    //    {
//    //        // Get logged-in user
//    //        string loginUserName = HttpContext.Session.GetString("UserName");
//    //        var existingUser = db.HRM_UserTbl.FirstOrDefault(u => u.username == loginUserName);

//    //        if (existingUser == null)
//    //            return RedirectToAction("Login", "Account");

//    //        // Dropdown for new users (excluding current user)
//    //        var userList = (from user in db.HRM_UserTbl
//    //                        join emp in db.HRM_EmpInfoTbl on user.Emp_Code equals emp.Emp_Code
//    //                        where user.id != existingUser.id
//    //                        select new
//    //                        {
//    //                            user.id,
//    //                            DisplayText = user.username + " - " + emp.Emp_Code + " - " +
//    //                                          emp.FullName + " - " + emp.Department + " - " +
//    //                                          emp.Current_Designation
//    //                        }).ToList();

//    //        ViewBag.UserList = new SelectList(userList, "id", "DisplayText");

//    //        // Dropdown for rollback users
//    //        var rollbackList = (from user in db.HRM_UserTbl
//    //                            join emp in db.HRM_EmpInfoTbl on user.Emp_Code equals emp.Emp_Code
//    //                            where user.NewAssignModule != null
//    //                            select new
//    //                            {
//    //                                user.id,
//    //                                DisplayText = user.username + " - " + emp.Emp_Code + " - " +
//    //                                              emp.FullName + " - " + emp.Department + " - " +
//    //                                              emp.Current_Designation
//    //                            }).ToList();

//    //        ViewBag.RollbackUserList = new SelectList(rollbackList, "id", "DisplayText");

//    //        // Pass existing user info to view
//    //        ViewBag.ExistingUser = existingUser;

//    //        return View();
//    //    }
//    //}
//    //    [HttpPost]
//    //    public ActionResult ChangeAuthority(
//    //int existingUserId, int? newUserId,
//    //bool MaterialManagement = false, bool SalesAndMarketing = false, bool HRAndAdmin = false,
//    //bool AccountAndFinance = false, bool Masters = false, bool Dashboard = false,
//    //bool ProductionAndQuality = false, bool Quality = false)
//    //    {
//    //        using (var db = new SwamiSamarthDbContext())
//    //        {
//    //            var existingUser = db.HRM_UserTbl.FirstOrDefault(u => u.id == existingUserId);
//    //            var newUser = db.HRM_UserTbl.FirstOrDefault(u => u.id == newUserId);

//    //            if (existingUser == null || newUser == null)
//    //            {
//    //                TempData["Error"] = "User not found!";
//    //                return RedirectToAction("ChangeAuthority");
//    //            }

//    //            // ✅ Capture ONLY transferred modules
//    //            var transferredModules = new AuthorityModules
//    //            {
//    //                MaterialManagement = MaterialManagement,
//    //                SalesAndMarketing = SalesAndMarketing,
//    //                HRAndAdmin = HRAndAdmin,
//    //                AccountAndFinance = AccountAndFinance,
//    //                Masters = Masters,
//    //                Dashboard = Dashboard,
//    //                ProductionAndQuality = ProductionAndQuality,
//    //                External_buyer_seller = Quality
//    //            };

//    //            // Save to rollback reference
//    //            newUser.NewAssignModule = Newtonsoft.Json.JsonConvert.SerializeObject(transferredModules);

//    //            // ✅ Assign transferred modules to new user (OR keep if already true)
//    //            if (MaterialManagement) newUser.MaterialManagement = true;
//    //            if (SalesAndMarketing) newUser.SalesAndMarketing = true;
//    //            if (HRAndAdmin) newUser.HRAndAdmin = true;
//    //            if (AccountAndFinance) newUser.AccountAndFinance = true;
//    //            if (Masters) newUser.Masters = true;
//    //            if (Dashboard) newUser.Dashboard = true;
//    //            if (ProductionAndQuality) newUser.ProductionAndQuality = true;
//    //            if (Quality) newUser.External_buyer_seller = true;
//    //            newUser.Power_Of_Authority = newUser.UserRole;
//    //            db.SaveChanges();
//    //            TempData["Success"] = "Authorities transferred successfully!";
//    //        }

//    //        return RedirectToAction("ChangeAuthority");
//    //    }
//    //    [HttpPost]
//    //    public ActionResult RollbackAuthority(int existingUserId, int newUserId)
//    //    {
//    //        using (var db = new SwamiSamarthDbContext())
//    //        {
//    //            try
//    //            {
//    //                var existingUser = db.HRM_UserTbl.Find(existingUserId);
//    //                var newUser = db.HRM_UserTbl.Find(newUserId);

//    //                if (existingUser != null && newUser != null)
//    //                {
//    //                    if (!string.IsNullOrEmpty(newUser.NewAssignModule))
//    //                    {
//    //                        // ✅ Get only transferred modules
//    //                        var transferredModules = Newtonsoft.Json.JsonConvert
//    //                            .DeserializeObject<AuthorityModules>(newUser.NewAssignModule);

//    //                        if (transferredModules.MaterialManagement.GetValueOrDefault()) existingUser.MaterialManagement = true;
//    //                        if (transferredModules.SalesAndMarketing.GetValueOrDefault()) existingUser.SalesAndMarketing = true;
//    //                        if (transferredModules.HRAndAdmin.GetValueOrDefault()) existingUser.HRAndAdmin = true;
//    //                        if (transferredModules.AccountAndFinance.GetValueOrDefault()) existingUser.AccountAndFinance = true;
//    //                        if (transferredModules.Masters.GetValueOrDefault()) existingUser.Masters = true;
//    //                        if (transferredModules.Dashboard.GetValueOrDefault()) existingUser.Dashboard = true;
//    //                        if (transferredModules.ProductionAndQuality.GetValueOrDefault()) existingUser.ProductionAndQuality = true;
//    //                        if (transferredModules.Quality.GetValueOrDefault()) existingUser.External_buyer_seller = true;


//    //                        if (transferredModules.MaterialManagement.GetValueOrDefault()) newUser.MaterialManagement = false;
//    //                        if (transferredModules.SalesAndMarketing.GetValueOrDefault()) newUser.SalesAndMarketing = false;
//    //                        if (transferredModules.HRAndAdmin.GetValueOrDefault()) newUser.HRAndAdmin = false;
//    //                        if (transferredModules.AccountAndFinance.GetValueOrDefault()) newUser.AccountAndFinance = false;
//    //                        if (transferredModules.Masters.GetValueOrDefault()) newUser.Masters = false;
//    //                        if (transferredModules.Dashboard.GetValueOrDefault()) newUser.Dashboard = false;
//    //                        if (transferredModules.ProductionAndQuality.GetValueOrDefault()) newUser.ProductionAndQuality = false;
//    //                        if (transferredModules.Quality.GetValueOrDefault()) newUser.External_buyer_seller = false;

//    //                    }

//    //                    // ✅ Clear rollback reference
//    //                    newUser.NewAssignModule = null;
//    //                    newUser.Power_Of_Authority = null;

//    //                    db.SaveChanges();
//    //                    TempData["Success"] = "Authorities rolled back successfully!";
//    //                }
//    //                else
//    //                {
//    //                    TempData["Error"] = "User not found.";
//    //                }
//    //            }
//    //            catch (Exception ex)
//    //            {
//    //                TempData["Error"] = "Error rolling back authorities: " + ex.Message;
//    //            }

//    //            return RedirectToAction("ChangeAuthority");
//    //        }
//    //    }


//    public ActionResult Viewdata(int Id, string empcode)
//        {


//            SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext();

//            // Fetch user data based on empcode and Id
//            HRM_EmpInfoTbl userdata = dbentities.HRM_EmpInfoTbl.Where(x => x.Emp_Code == empcode && x.Id == Id).FirstOrDefault();

//            // Fetch login details using empcode
//            HRM_UserTbl logindetails = dbentities.HRM_UserTbl.Where(x => x.Emp_Code == empcode).FirstOrDefault();

//            Userdetails userdetails = new Userdetails();
//            if (logindetails != null)
//            {
//                userdetails.Emp_Code = logindetails.Emp_Code;
//                userdetails.Email = logindetails.username;
//                userdetails.username = logindetails.username;
//                userdetails.password = logindetails.password;
//                userdetails.AdminApprove = logindetails.AdminApprove;
//            }

//            if (userdata != null)
//            {
//                userdetails.Name = userdata.Name;
//                userdetails.Surname = userdata.Surname;
//                userdetails.Contact_NO = userdata.Contact_NO;
//                userdetails.Email = userdata.Email;
//                userdetails.Gender = userdata.Gender;
//                userdetails.DOB = userdata.DOB.HasValue
//                    ? userdata.DOB.Value.ToDateTime(TimeOnly.MinValue)
//                    : (DateTime?)null;
//                userdetails.Blood_Group = userdata.Blood_Group;
//                userdetails.permanent_Address = userdata.permanent_Address;
//                userdetails.BankAccountNo = userdata.BankAccountNo;
//                userdetails.BankName = userdata.BankName;
//                userdetails.Department = userdata.Department;
//                userdetails.Joining_Designation = userdata.Joining_Designation;
//                userdetails.Joining_AuthorityLevel = userdata.Joining_AuthorityLevel;
//                userdetails.Date_Of_Joing = userdata.Date_Of_Joing.HasValue
//                    ? userdata.Date_Of_Joing.Value.ToDateTime(TimeOnly.MinValue)
//                    : (DateTime?)null;
//                userdetails.Emp_Code = userdata.Emp_Code;
//            }
//            //ViewBag.EmpCode = empCodeFromSession;

//            ViewBag.empCodeFromSession = Id;
//            return View(userdetails);
//        }

//        //get method for edit
//        public ActionResult EditRegistartionForm(int Id)
//        {
//            SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext();
//            HRM_AdminRegTbl userdata = dbentities.HRM_AdminRegTbl.Where(x => x.userid == Id).FirstOrDefault();
//            PassvalueReg PV = new PassvalueReg();
//            if (userdata != null)
//            {
//                PV = new PassvalueReg
//                {
//                    company_name = userdata.company_name,
//                    contact_no = userdata.contact_no,
//                    contact_person = userdata.contact_person,
//                    email_id = userdata.email_id,
//                    country = userdata.country,
//                    state = userdata.state,
//                    city = userdata.city,
//                    gst_no = userdata.gst_no
//                };
//            }
//            return View(PV);
//        }
//        //PostMethos used in edit
//        [HttpPost]
//        public ActionResult EditRegistartionForm(PassvalueReg collection_1)
//        {
//            RegistrationForm collection = new RegistrationForm
//            {
//                company_name = collection_1.company_name,
//                contact_no = collection_1.contact_no,
//                contact_person = collection_1.contact_person,
//                gst_no = collection_1.gst_no,
//                industry = collection_1.industry,
//                industry_category = collection_1.industry_category,
//                industry_subcategory = collection_1.industry_subcategory,
//                country = collection_1.country,
//                state = collection_1.state,
//                city = collection_1.city,
//                email_id = collection_1.email_id,


//            };
//            try
//            {
//                SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext();
//                RegistrationForm updateobj = new RegistrationForm();
//                if (collection != null)
//                {
//                    dbentities.Entry(updateobj).CurrentValues.SetValues(collection);
//                    dbentities.SaveChanges();

//                }
//                return RedirectToAction("RegistrationForm");
//            }

//            catch
//            {
//                return View();
//            }
//        }
//        public ActionResult Approve(int Id, string email, int days)
//        {

//            string email_id = "";
//            string password = "";
//            SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext();

//            DateTime currentDate = DateTime.Now;
//            DateTime endDate = currentDate.AddDays(days);

//            userlogin ulogin = new userlogin();
//            ulogin.username = email_id;
//            ulogin.password = password;

//            ulogin.AdminApprove = true;
//            ulogin.NoOfDays = days;
//            ulogin.StartDate = DateOnly.FromDateTime(currentDate);
//            ulogin.EndDate = DateOnly.FromDateTime(endDate);

//            dbentities.userlogins.Add(ulogin);
//            dbentities.SaveChanges();
//            string selectedDaysString = days.ToString();

//            HRM_AdminRegTbl userdata = dbentities.HRM_AdminRegTbl.Where(x => x.userid == Id).FirstOrDefault();

//            // userlogin logindetails = dbentities.userlogin.Where(x => x.id == Id).FirstOrDefault();
//            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
//            smtpClient.EnableSsl = true;
//            smtpClient.Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd");

//            MailMessage mailMessage = new MailMessage();
//            mailMessage.From = new MailAddress("hrm@synergy5m.com", "Synergy5M Bussiness Tools");
//            mailMessage.To.Add(email);
//            mailMessage.CC.Add("ab@synergy5m.com");
//            mailMessage.Subject = "YOUR REGISTRATION APPROVED FOR TRIAL USAGE OF OUR BUSINESS TOOLS";
//            // mailMessage.Body = "hii welcome to synergy5m";
//            string paragraph = "<p style=\"border:0px solid rgb(217,217,227);box-sizing:border-box;margin:0px 0px 1.25em;color:rgb(55,65,81);font-family:Söhne,ui-sans-serif,system-ui,-apple-system,&quot;Segoe UI&quot;,Roboto,Ubuntu,Cantarell,&quot;Noto Sans&quot;,sans-serif,&quot;Helvetica Neue&quot;,Arial,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;,&quot;Noto Color Emoji&quot;;font-size:16px;background-color:rgb(247,247,248)\">";

//            string mailbody = "<html><head>";
//            mailbody += "</head><body>";
//            mailbody += paragraph + "Dear Sir / Ma'am,</p>\n";
//            mailbody += paragraph + "We are delighted to inform you that your credentials have been validated and approved by our administration. We kindly request you to use the following link to create your User ID and password," +
//                                   " enabling you to start using our software free of cost for the trial period of <b>" + selectedDaysString + " days.</b></p>\n";

//            mailbody += $"{paragraph}<p><a href='https://synergy5m-shripaderp8-bvgth5fuf2a4drgq.centralindia-01.azurewebsites.net" +
//                $"/Login/Viewdata?Id={userdata.id}&userid={Id}'>Click Here</a></p>\n";
//            mailbody += paragraph + "We greatly value your feedback, and welcome you to share any thoughts or suggestions you may have. Your input will " +
//                                   "be valuable for us in improving our services and provide you with a better experience.</p>\n";

//            mailbody += paragraph + "Should you have any questions or require any assistance during the registration process, please do not hesitate to " +
//                                    "contact us. We are here to support you.</p>\n";

//            mailbody += paragraph + "Thank you once again for choosing Synergy5M LLP. We look forward to serving you and providing you with a seamless software experience. </p>\n";

//            mailbody += paragraph + "Best regards,</p>\n";
//            mailbody += paragraph + "S S Biradar</p>\n";
//            mailbody += paragraph + "CEO</p>\n";
//            mailbody += paragraph + "<p>Shirpad Polymers Pvt. Ltd.</p>\n";
//            mailbody += paragraph + "Email:srbiradar@shripadploymers.com</p>\n";
//            mailbody += "</body></html>\n";
//            mailMessage.Body = mailbody;

//            // Create the alternate view with the HTML body
//            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(mailbody, null, "text/html");

//            // Add the alternate view to the mail message
//            mailMessage.AlternateViews.Add(htmlView);

//            smtpClient.Send(mailMessage);

//            // return View("Index");
//            return RedirectToAction("Userdata", "Login");

//        }
//        public ActionResult UserProfile(int userid = 0)
//        {
//            // Get user ID from session
//            var sessionUserId = HttpContext.Session.GetString("USER_ID");
//            int userIdFromSession = !string.IsNullOrEmpty(sessionUserId) ? Convert.ToInt32(sessionUserId) : 0;

//            if (userid > 0)
//            {
//                // Store userid in session
//                HttpContext.Session.SetString("USER_ID", userid.ToString());
//                userIdFromSession = userid; // update local variable
//            }
//            else if (userIdFromSession <= 0)
//            {
//                // Clear session instead of Session.Abandon()
//                HttpContext.Session.Clear();
//                ViewBag.userIdFromSession = null;
//                return RedirectToAction("Login", "Login");
//            }

//            ViewBag.UserId = userIdFromSession;

//            // Get user profile data based on userId
//            var userProfileData = GetUserProfileData(userIdFromSession);

//            // Return the user profile data as JSON
//            return Json(userProfileData);
//        }

//        private dynamic GetUserProfileData(int userIdFromSession)
//        {
//            using (var dbContext = new SwamiSamarthDbContext())
//            {
//                var userProfileData = dbContext.HRM_AdminRegTbl.FirstOrDefault(u => u.userid == userIdFromSession);
//                return userProfileData;
//            }
//        }
//        public ActionResult Reject(int Id, string email, string msg)
//        {
//            SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext();
//            string selectedMassageString = msg;

//            HRM_AdminRegTbl userdata = dbentities.HRM_AdminRegTbl.Where(x => x.userid == Id).FirstOrDefault();
//            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
//            smtpClient.EnableSsl = true;
//            smtpClient.Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd");

//            MailMessage mailMessage = new MailMessage();
//            mailMessage.From = new MailAddress("hrm@synergy5m.com", "Synergy5M Bussiness Tools");
//            mailMessage.To.Add(email);
//            mailMessage.CC.Add("ab@synergy5m.com");
//            mailMessage.Subject = "YOUR REGISTRATION FOR TRIAL USAGE OF OUR BUSINESS TOOLS";
//            // mailMessage.Body = "hii welcome to synergy5m";

//            string paragraph = "<p style=\"border:0px solid rgb(217,217,227);box-sizing:border-box;margin:0px 0px 1.25em;color:rgb(55,65,81);font-family:Söhne,ui-sans-serif,system-ui,-apple-system,&quot;Segoe UI&quot;,Roboto,Ubuntu,Cantarell,&quot;Noto Sans&quot;,sans-serif,&quot;Helvetica Neue&quot;,Arial,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;,&quot;Noto Color Emoji&quot;;font-size:16px;background-color:rgb(247,247,248)\">";
//            string mailbody = "<html><head>";
//            mailbody += "</head><body>";
//            mailbody += paragraph + "Dear Sir / Ma'am,</p>";
//            mailbody += paragraph + "We are happy to inform you that your credentials have been checked by our administration. " +
//                "We kindly request you to please view the discrepancy noticed in the data provided. " +
//                "The specific area that requires attention is in the <b>" + selectedMassageString + "</b></p>";

//            mailbody += "\n";
//            mailbody += paragraph + "We will appreciate your prompt action in rectifying this error by using the following link and resubmit.</p>\n";
//            mailbody += paragraph + "https://synergy5m-shripaderp8-bvgth5fuf2a4drgq.centralindia-01.azurewebsites.net/Login/EditRegistartionForm/" + Id + "<p>\n";
//            mailbody += paragraph + "If you have any questions or require any assistance during the registration process, please do not hesitate to contact us." +
//                " We are here to support you.</p>\n";

//            mailbody += paragraph + "Thank you once again for choosing Synergy5M LLP. We look forward to serving you and providing you with a seamless software experience. </p>\n";

//            mailbody += paragraph + "Best regards,</p>\n";
//            mailbody += paragraph + "S S Biradar</p>\n";
//            mailbody += paragraph + "CEO</p>\n";
//            mailbody += paragraph + "<p>Shirpad Polymers Pvt. Ltd.</p>\n";
//            mailbody += paragraph + "Email: srbiradar@shripadploymers.com</p>\n";
//            mailbody += "</body></html>\n";
//            mailMessage.Body = mailbody;

//            // Create the alternate view with the HTML body
//            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(mailbody, null, "text/html");

//            // Add the alternate view to the mail message
//            mailMessage.AlternateViews.Add(htmlView);

//            smtpClient.Send(mailMessage);

//            //return View("Index");
//            return RedirectToAction("Userdata", "Login");

//        }


//        public ActionResult ForgetPassword()
//        {
//            return View();
//        }

//        [HttpPost]
//        public ActionResult ForgetPassword(string Email)
//        {
//            try
//            {
//                using (SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext())
//                {
//                    // Check if user exists
//                    HRM_UserTbl user = dbentities.HRM_UserTbl.FirstOrDefault(u => u.username == Email);
//                    if (user == null)
//                    {
//                        return Json(new { success = false, error = "User not found." });
//                    }

//                    // Generate token
//                    string token = Guid.NewGuid().ToString("n");
//                    string ResetUrl = $"https://synergy5m-shripaderp8-bvgth5fuf2a4drgq.centralindia-01.azurewebsites.net/Login/Resetpassword?Userid={Email}&token={token}";

//                    // Update token in database
//                    user.ResetToken = token;
//                    dbentities.Entry(user).Property(x => x.ResetToken).IsModified = true;
//                    dbentities.SaveChanges();

//                    // Send email
//                    SendPasswordResetEmail(Email, ResetUrl);

//                    return Json(new { success = true, message = "Password reset link has been sent to your email." });
//                }

//            }
//            catch (Exception ex)
//            {
//                // Log the exception (you can use a logger here)
//                return Json(new { success = false, error = "An unexpected error occurred. Please try again later." });
//            }
//        }
//        private void SendPasswordResetEmail(string useremail, string resetlink)
//        {
//            //string resetLink = Url.Action("ResetPassword", "Login", new { token = user.ResetPassword }, Request.Url.Scheme);

//            string subject = "Password Reset";
//            string body = $"Please click the following link to reset your password: {resetlink}";

//            using (SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587))
//            {
//                smtpClient.EnableSsl = true;
//                smtpClient.UseDefaultCredentials = false;
//                smtpClient.Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd");

//                MailMessage mailMessage = new MailMessage();
//                mailMessage.From = new MailAddress("hrm@synergy5m.com", "Your Application");
//                mailMessage.To.Add(useremail); // Use the user's email here
//                mailMessage.Subject = subject;
//                mailMessage.Body = body;
//                mailMessage.IsBodyHtml = true;



//                smtpClient.Send(mailMessage);
//            }
//        }

//        public ActionResult Resetpassword(string userid, string token)
//        {
//            SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext();
//            HRM_UserTbl user = dbentities.HRM_UserTbl.Where(x => x.username == userid && x.ResetToken == token).FirstOrDefault();
//            if (user != null)
//            {
//                ResetpasswordModel model = new ResetpasswordModel
//                {
//                    Userid = userid,
//                    Password = "",
//                };
//                return View(model);
//            }
//            else
//            {
//                return RedirectToAction("Index");
//            }
//        }

//        [HttpPost]
//        public ActionResult Resetpassword(ResetpasswordModel model)
//        {
//            if (!string.IsNullOrWhiteSpace(model.Userid) && !string.IsNullOrWhiteSpace(model.Emp_Code))
//            {
//                using (SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext())
//                {
//                    var user = dbentities.HRM_UserTbl
//                        .FirstOrDefault(x => x.username == model.Userid && x.Emp_Code == model.Emp_Code);

//                    if (user != null)
//                    {
//                        user.password = model.Password;
//                        dbentities.Entry(user).State = EntityState.Modified;
//                        dbentities.SaveChanges();

//                        // ✅ Return message with a login link
//                        string message = "<h3 style='color: green;'>Password Updated Successfully.</h3>" +
//                                         "<p><a href='/Login/Login' style='color: blue; text-decoration: underline;'>Click here to login</a></p>";

//                        return Content(message, "text/html");
//                    }
//                    else
//                    {
//                        return Content("<span style='color:red;'>User Not Found</span>", "text/html");
//                    }
//                }
//            }

//            return Content("<span style='color:red;'>User ID and Emp Code are required.</span>", "text/html");
//        }

//        // GET Action
//        public ActionResult ModuleDashborad(int? id, string empCode)
//        {
//            using (SwamiSamarthDbContext _DemoEntities = new SwamiSamarthDbContext())
//            {
//                var user = _DemoEntities.HRM_EmpInfoTbl.FirstOrDefault(x => x.Id == id);

//                if (user != null)
//                {
//                    if (!string.IsNullOrEmpty(empCode))
//                    {
//                        ViewBag.EmpCode = empCode;
//                        HttpContext.Session.SetString("EmpCode", empCode); // Store in session
//                    }
//                    else
//                    {
//                        ViewBag.EmpCode = user.Emp_Code;
//                        HttpContext.Session.SetString("EmpCode", user.Emp_Code ?? ""); // Store in session
//                    }

//                    // Pass other user details
//                    ViewBag.SelectedUserName = user.Email;
//                    ViewBag.UserId = user.Id;
//                }
//            }

//            return View();
//        }

//        [HttpPost]
//        public ActionResult ModuleDashborad(AdminBorad ab)
//        {
//            using (SwamiSamarthDbContext _DemoEntitiesentities = new SwamiSamarthDbContext())
//            {
//                // Retrieve the user
//                HRM_UserTbl user = _DemoEntitiesentities.HRM_UserTbl.FirstOrDefault(x => x.Emp_Code == ab.Emp_Code);

//                if (user != null)
//                {
//                    // Update properties
//                    user.MaterialManagement = ab.MaterialManagementModule;
//                    user.SalesAndMarketing = ab.SalesAndMarketingModule;
//                    user.HRAndAdmin = ab.HRAndAdminModule;
//                    user.AccountAndFinance = ab.AccountAndFinanceModule;
//                    user.Masters = ab.MastersModule;
//                    user.Dashboard = ab.DashboardModule;
//                    user.ProductionAndQuality = ab.ProductionAndQualityModule;
//                    user.External_buyer_seller = ab.External_buyer_seller;

//                    // Retrieve EmpCode from Session and update the table
//                    var empCodeFromSession = HttpContext.Session.GetString("EmpCode");
//                    if (!string.IsNullOrEmpty(empCodeFromSession))
//                    {
//                        user.Emp_Code = empCodeFromSession;
//                    }


//                    // Mark the entity as modified
//                    _DemoEntitiesentities.Entry(user).State = EntityState.Modified;

//                    // Save changes
//                    _DemoEntitiesentities.SaveChanges();

//                    // Re-fetch updated user data
//                    user = _DemoEntitiesentities.HRM_UserTbl.FirstOrDefault(x => x.Emp_Code == ab.Emp_Code);

//                    // Prepare selected tools
//                    List<string> selectedTools = new List<string>();

//                    if ((bool)user.MaterialManagement) selectedTools.Add("MaterialManagement");
//                    if ((bool)user.SalesAndMarketing) selectedTools.Add("SalesAndMarketing");
//                    if ((bool)user.HRAndAdmin) selectedTools.Add("HRAndAdmin");
//                    if ((bool)user.AccountAndFinance) selectedTools.Add("AccountAndFinance");
//                    if ((bool)user.Masters) selectedTools.Add("Masters");
//                    if ((bool)user.Dashboard) selectedTools.Add("Dashboard");
//                    if ((bool)user.ProductionAndQuality) selectedTools.Add("ProductionAndQuality");
//                    if ((bool)user.External_buyer_seller) selectedTools.Add("External_buyer_seller");
//                    // Store in TempData
//                    TempData["SelectedTools"] = selectedTools;
//                    TempData.Keep();

//                    // Send email
//                    SendApprovalEmailForModule(user, user.username, user.password);

//                    return RedirectToAction("ModuleUserData", "Login");
//                }
//            }

//            // If user not found, redirect back
//            return RedirectToAction("ModuleDashborad", "Login");
//        }


//        private void UpdatePropertyForModule(HRM_UserTbl user, SwamiSamarthDbContext _DemoEntitiesentities)
//        {
//            //SwamiSamarthDbContext _DemoEntitiesentities = new SwamiSamarthDbContext();

//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);
//            _DemoEntitiesentities.Entry(user).Property(x => x.MaterialManagement).IsModified = true;
//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);
//            _DemoEntitiesentities.Entry(user).Property(x => x.SalesAndMarketing).IsModified = true;
//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);
//            _DemoEntitiesentities.Entry(user).Property(x => x.HRAndAdmin).IsModified = true;
//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);
//            _DemoEntitiesentities.Entry(user).Property(x => x.AccountAndFinance).IsModified = true;
//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);
//            _DemoEntitiesentities.Entry(user).Property(x => x.Masters).IsModified = true;
//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);
//            _DemoEntitiesentities.Entry(user).Property(x => x.Dashboard).IsModified = true;
//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);
//            _DemoEntitiesentities.Entry(user).Property(x => x.ProductionAndQuality).IsModified = true;
//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);
//            _DemoEntitiesentities.Entry(user).Property(x => x.External_buyer_seller).IsModified = true;
//            _DemoEntitiesentities.HRM_UserTbl.Attach(user);



//        }



//        private void SendApprovalEmailForModule(HRM_UserTbl user, string username, string password)
//        {
//            // Construct the email message
//            string subject = "Your request has been approved";
//            string body = "<html><body>";

//            body += "<p>Dear " + user.username + ",</p>";
//            body += "<p>We are pleased to inform you that your registration has been accepted. You can activate your account using the link below:</p>";
//            body += "<p><a href=\"https://synergy5m-shripaderp8-bvgth5fuf2a4drgq.centralindia-01.azurewebsites.net/Login/Login/\">Activate Your Account:</a></p>";
//            body += "<p>You can submit additional buying inquiries or selling offers on our portal to connect with potential customers.</p>";
//            body += "<p>Username: " + username + "<br>";
//            body += "Password: " + password + "</p>";
//            body += "<p>If you have any questions or need assistance, please feel free to contact us at info@synergy5m.com.</p>";
//            body += "<p>Best regards,<br>";
//            body += "S S Biradar<br>";
//            body += "CEO<br>";
//            body += "Shirpad Polymers Pvt. Ltd.<br>";
//            body += "Email: srbiradar@shripadploymers.com</p>";
//            body += "</body></html>";

//            // Configure SMTP client
//            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587)
//            {
//                UseDefaultCredentials = false,
//                Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd"),
//                EnableSsl = true
//            };

//            // Construct the email message
//            MailMessage message = new MailMessage
//            {
//                From = new MailAddress("hrm@synergy5m.com", "Synergy5M Business Tools"),
//                Subject = subject,
//                Body = body,
//                IsBodyHtml = true
//            };
//            message.To.Add(username);
//            message.CC.Add("ab@synergy5m.com");

//            // Send the email
//            smtpClient.Send(message);
//        }
//        public ActionResult UpdateModuleDashborad(string empcode)
//        {
//            using (SwamiSamarthDbContext _DemoEntitiesentities = new SwamiSamarthDbContext())
//            {
//                // Get all users for dropdown
//                var users = _DemoEntitiesentities.HRM_UserTbl
//                            .Where(x => !string.IsNullOrEmpty(x.username))
//                            .ToList();

//                // Initialize model
//                passab pab = new passab();

//                HRM_UserTbl selectedUser = null;

//                if (!string.IsNullOrEmpty(empcode))
//                {
//                    // Get user by Emp_Code
//                    selectedUser = users.FirstOrDefault(x => x.Emp_Code == empcode);

//                    if (selectedUser != null)
//                    {
//                        pab = new passab
//                        {
//                            id = selectedUser.id,
//                            username = selectedUser.username,
//                            MaterialManagement = selectedUser.MaterialManagement ?? false,
//                            SalesAndMarketing = selectedUser.SalesAndMarketing ?? false,
//                            HRAndAdmin = selectedUser.HRAndAdmin ?? false,
//                            AccountAndFinance = selectedUser.AccountAndFinance ?? false,
//                            Masters = selectedUser.Masters ?? false,
//                            Dashboard = selectedUser.Dashboard ?? false,
//                            ProductionAndQuality = selectedUser.ProductionAndQuality ?? false,
//                            External_buyer_seller = selectedUser.External_buyer_seller ?? false
//                        };

//                        ViewBag.SelectedUserName = selectedUser.username;
//                        ViewBag.UserId = selectedUser.id;
//                    }
//                }

//                // Set dropdown list and mark selected user
//                ViewBag.userlist = new SelectList(users, "id", "username", selectedUser?.id);

//                return View(pab); // Always pass a model
//            }
//        }


//        [HttpPost]
//        public ActionResult UpdateModuleDashborad(string empcode, passab login)
//        {
//            using (SwamiSamarthDbContext _DemoEntities = new SwamiSamarthDbContext())
//            {
//                if (string.IsNullOrEmpty(empcode))
//                {
//                    // Handle missing empcode (optional: redirect with error message)
//                    return RedirectToAction("Index", "Home");
//                }

//                // Fetch user from the database using Emp_Code
//                HRM_UserTbl user = _DemoEntities.HRM_UserTbl
//                                    .FirstOrDefault(x => x.Emp_Code == empcode);

//                if (user != null)
//                {
//                    // Update module access fields
//                    user.MaterialManagement = login.MaterialManagement;
//                    user.SalesAndMarketing = login.SalesAndMarketing;
//                    user.HRAndAdmin = login.HRAndAdmin;
//                    user.AccountAndFinance = login.AccountAndFinance;
//                    user.Masters = login.Masters;
//                    user.Dashboard = login.Dashboard;
//                    user.ProductionAndQuality = login.ProductionAndQuality;
//                    user.External_buyer_seller = login.External_buyer_seller;

//                    // Save to DB
//                    _DemoEntities.SaveChanges();

//                    // Redirect to list or dashboard
//                    return RedirectToAction("Index", "Home");
//                }

//                // If user not found
//                ModelState.AddModelError("", "User not found with given Emp_Code");
//                return View(login);
//            }
//        }


//        public ActionResult ModuleUserData()
//        {
//            var userName = HttpContext.Session.GetString("UserName");
//            var userRole = HttpContext.Session.GetString("UserRole");
//            var powerAuthority = HttpContext.Session.GetString("PowerAuthority");

//            if (string.IsNullOrEmpty(userName) ||
//                string.IsNullOrEmpty(userRole) ||
//                string.IsNullOrEmpty(powerAuthority) ||
//                (userRole != "admin" && powerAuthority != "CHIEF_ADMIN"))
//            {
//                // If the user is not authorized, redirect to the home page
//                return RedirectToAction("Index", "Home");
//            }
//            // Initialize database context
//            SwamiSamarthDbContext _DemoEntitiesentities = new SwamiSamarthDbContext();

//            // Fetch combined user data
//            var combineModel = (from reg in _DemoEntitiesentities.HRM_EmpInfoTbl
//                                join log in _DemoEntitiesentities.HRM_UserTbl
//                                on reg.Email equals log.username
//                                where log.username != null
//                                group new { reg, log } by new
//                                {
//                                    reg.Id,
//                                    reg.Emp_Code,
//                                    log.username
//                                } into grouped
//                                select grouped.FirstOrDefault()).ToList();

//            // Initialize user list
//            List<UserListWIthSelectedTools> UserList = new List<UserListWIthSelectedTools>();

//            if (combineModel != null && combineModel.Count > 0)
//            {
//                foreach (var model in combineModel)
//                {
//                    UserList.Add(new UserListWIthSelectedTools
//                    {
//                        id = model.reg.Id,
//                        Name = model.reg.Name,
//                        Surname = model.reg.Surname,
//                        Gender = model.reg.Gender,
//                        DOB = model.reg.DOB.HasValue ? model.reg.DOB.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
//                        Blood_Group = model.reg.Blood_Group,
//                        Email = model.reg.Email,
//                        Contact_NO = model.reg.Contact_NO,
//                        Married_Status = model.reg.Married_Status,
//                        Quallification = model.reg.Quallification,
//                        Address = model.reg.Address,
//                        permanent_Address = model.reg.permanent_Address,
//                        Country = model.reg.Country,
//                        State = model.reg.State,
//                        City = model.reg.City,
//                        AdharNO = model.reg.AdharNO,
//                        Department = model.reg.Department,
//                        Joining_Designation = model.reg.Joining_Designation,
//                        Date_Of_Joing = model.reg.Date_Of_Joing.HasValue
//    ? model.reg.Date_Of_Joing.Value.ToDateTime(TimeOnly.MinValue)
//    : (DateTime?)null,
//                        Joining_CTC_Breakup = model.reg.Joining_CTC_Breakup,
//                        Joining_AuthorityLevel = model.reg.Joining_AuthorityLevel,
//                        Current_Designation = model.reg.Current_Designation,
//                        Emp_Code = model.reg.Emp_Code, // Correctly mapping Employee Code
//                        Annual_CTC_Rs_ = model.reg.Annual_CTC_Rs_,
//                        MaterialManagement = model.log.MaterialManagement ?? false,
//                        SalesAndMarketing = model.log.SalesAndMarketing ?? false,
//                        HRAndAdmin = model.log.HRAndAdmin ?? false,
//                        AccountAndFinance = model.log.AccountAndFinance ?? false,
//                        Masters = model.log.Masters ?? false,
//                        Dashboard = model.log.Dashboard ?? false,
//                        ProductionAndQuality = model.log.ProductionAndQuality ?? false,
//                        External_buyer_seller = model.log.External_buyer_seller ?? false,
//                        password = model.log.password,
//                    });
//                }
//            }

//            return View(UserList);
//        }

//        public ActionResult DeleteModuleDashborad(int id)
//        {
//            SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext();
//            HRM_UserTbl pdt = dbentities.HRM_UserTbl.SingleOrDefault(x => x.id == id);
//            if (pdt != null)
//            {
//                dbentities.HRM_UserTbl.Remove(pdt);
//                dbentities.SaveChanges();
//            }
//            return RedirectToAction("AdminModuleList");
//        }

//        // POST: Tracking/Delete/5
//        [HttpPost]
//        public ActionResult DeletModuleDashborad(int id, FormCollection collection)
//        {
//            try
//            {
//                // TODO: Add delete logic here

//                return RedirectToAction("AdminModuleList");
//            }
//            catch
//            {
//                return View();
//            }
//        }

//        public ActionResult Business_View_Front_Page()
//        {
//            SwamiSamarthDbContext dbentities = new SwamiSamarthDbContext();
//            var isChiefAdminExists = dbentities.HRM_AuthorityMatrixTbl
//                                            .Any(a => a.Authority_code == "01" && a.IsSelected == "Yes");

//            ViewBag.IsChiefAdminExists = isChiefAdminExists;

//            return View();
//        }
//    }
//}
    

