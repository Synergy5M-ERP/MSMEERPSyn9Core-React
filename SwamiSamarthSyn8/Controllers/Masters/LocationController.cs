using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models.Masters;
using System.Data;

namespace SwamiSamarthSyn8.Controllers.Masters
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : Controller
    {
        private readonly SwamiSamarthDbContext _swamiContext;

        // 🔹 Second Database
        private readonly MsmeERPDbContext _msmeContext;

        private readonly ILogger<LocationController> _logger;

        public LocationController(
            SwamiSamarthDbContext swamiContext,
            MsmeERPDbContext msmeContext,
            ILogger<LocationController> logger)
        {
            _swamiContext = swamiContext;
            _msmeContext = msmeContext;
            _logger = logger;
        }

        [HttpPost("CreateSource")]
        public async Task<IActionResult> CreateSource([FromBody] SourceDto model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.src_name))
                {
                    return BadRequest("Source name is required");
                }

                var source = new Master_Source
                {
                    src_name = model.src_name,
                    IsActive = true
                };

                _msmeContext.Master_Source.Add(source);
                await _msmeContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "Source created successfully",
                    data = source
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating source");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("GetSources")]
        public async Task<IActionResult> GetSources()
        {
            try
            {
                var sources = await _msmeContext.Master_Source
                    .Where(x => x.IsActive == true)
                    .Select(x => new
                    {
                        x.src_id,
                        x.src_name
                    })
                    .ToListAsync();

                return Ok(sources);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching sources");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("CreateContinent")]
        public IActionResult CreateContinent([FromBody] ContinentDto model)
        {
            int maxRetries = 3;
            int currentRetry = 0;

            while (true)
            {
                try
                {
                    // get max continent number for selected source
                    int maxContinentNumber = _msmeContext.Master_Continent
                        .Where(c => c.src_id == model.src_id)
                        .Max(c => (int?)c.Continent_number) ?? 0;

                    int newContinentNumber = maxContinentNumber + 1;

                    var newContinent = new Master_Continent
                    {
                        conti_name = model.conti_name,
                        src_id = model.src_id,
                        Continent_number = newContinentNumber,
                        IsActive = true
                    };

                    _msmeContext.Master_Continent.Add(newContinent);
                    _msmeContext.SaveChanges();

                    return Ok(new
                    {
                        message = "Continent Created Successfully"
                    });
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    if (currentRetry < maxRetries)
                    {
                        currentRetry++;
                    }
                    else
                    {
                        return StatusCode(500, "Concurrency conflict. Please try again.");
                    }
                }
            }
        }

        [HttpGet("GetContinents")]
        public IActionResult GetContinents()
        {
            try
            {
                var continents = _msmeContext.Master_Continent
                    .Where(c => c.IsActive == true)
                    .Select(c => new
                    {
                        conti_id = c.conti_id,
                        conti_name = c.conti_name
                    })
                    .ToList();

                return Ok(continents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("CreateCountry")]
        public IActionResult CreateCountry([FromBody] CountryDto model)
        {
            try
            {
                if (model == null || string.IsNullOrWhiteSpace(model.country_name))
                {
                    return BadRequest("Country name is required");
                }

                // 🔹 Get continent record
                var continent = _msmeContext.Master_Continent
                    .FirstOrDefault(c => c.conti_id == model.conti_id);

                if (continent == null)
                {
                    return BadRequest("Selected continent does not exist");
                }

                if (string.IsNullOrEmpty(continent.Continent_Code))
                {
                    return BadRequest("Continent code is missing in Master_Continent table");
                }

                // 🔹 Get max country number
                int maxCountryNumber = _msmeContext.Master_Country
                    .Where(c => c.conti_id == model.conti_id)
                    .Max(c => (int?)c.country_number) ?? 0;

                int newCountryNumber = maxCountryNumber + 1;

                // 🔹 Create country
                var newCountry = new Master_Country
                {
                    country_name = model.country_name,
                    conti_id = model.conti_id,
                    continent_code = continent.Continent_Code, // always from continent table
                    country_number = newCountryNumber,
                    IsActive = true
                };

                _msmeContext.Master_Country.Add(newCountry);
                _msmeContext.SaveChanges();

                return Ok(new
                {
                    message = "Country created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("GetCountries")]
        public IActionResult GetCountries()
        {
            try
            {
                var countries = _msmeContext.Master_Country
                    .Where(c => c.IsActive == true)
                    .Select(c => new
                    {
                        country_id = c.country_id,
                        country_name = c.country_name
                    })
                    .ToList();

                return Ok(countries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("AddState")]
        public IActionResult AddState([FromBody] StateDTO model)
        {
            try
            {
                if (model == null || string.IsNullOrEmpty(model.state_name))
                {
                    return BadRequest("Invalid data");
                }

                // Get max state_number for selected country
                int maxStateNumber = _msmeContext.Master_State
                    .Where(s => s.country_id == model.country_id)
                    .Max(s => (int?)s.state_number) ?? 0;

                int newStateNumber = maxStateNumber + 1;

                // Get country code
                string countryCode = _msmeContext.Master_Country
                    .Where(c => c.country_id == model.country_id)
                    .Select(c => c.Country_Code)
                    .FirstOrDefault();

                Master_State newState = new Master_State
                {
                    state_name = model.state_name,
                    country_id = model.country_id,
                    state_number = newStateNumber,
                    Country_Code = countryCode,
                    IsActive = true
                };

                _msmeContext.Master_State.Add(newState);
                _msmeContext.SaveChanges();

                return Ok(new
                {
                    message = "State added successfully",
                    data = newState
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetStates")]
        public IActionResult GetStates()
        {
            try
            {
                var states = _msmeContext.Master_State
                    .Where(s => s.IsActive == true)
                    .Select(s => new
                    {
                        state_id = s.state_id,
                        state_name = s.state_name
                    })
                    .ToList();

                return Ok(states);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("AddCity")]
        public IActionResult AddCity([FromBody] CityDTO model)
        {
            try
            {
                if (model == null || string.IsNullOrEmpty(model.city_name))
                {
                    return BadRequest("Invalid data");
                }

                // Get max city number for state
                int maxCityNumber = _msmeContext.Master_City
                    .Where(c => c.state_id == model.state_id)
                    .Max(c => (int?)c.city_number) ?? 0;

                int newCityNumber = maxCityNumber + 1;

                // Get state_code
                string stateCode = _msmeContext.Master_State
                    .Where(s => s.state_id == model.state_id)
                    .Select(s => s.state_code)
                    .FirstOrDefault();

                // Get country code
                string countryCode = _msmeContext.Master_State
                    .Where(s => s.state_id == model.state_id)
                    .Select(s => s.Country_Code)
                    .FirstOrDefault();

                Master_City newCity = new Master_City
                {
                    city_name = model.city_name,
                    state_id = model.state_id,
                    city_number = newCityNumber,
                    state_code = stateCode,
                    Country_Code = countryCode,
                    IsActive = true
                };

                _msmeContext.Master_City.Add(newCity);
                _msmeContext.SaveChanges();

                return Ok(new
                {
                    message = "City added successfully",
                    data = newCity
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetLocationData")]
        public IActionResult GetLocationData()
        {
            try
            {
                var locations = _msmeContext.LocationDto
                    .FromSqlRaw("EXEC sp_GetLocationList")
                    .ToList();

                return Ok(locations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("UpdateLocation")]
        public IActionResult UpdateLocation([FromBody] UpdateLocationDto model)
        {
            try
            {
                string message = "";

                if (model.FieldName == "source")
                {
                    var src = _msmeContext.Master_Source
                        .FirstOrDefault(x => x.src_id == model.RecordId);

                    if (src == null) return NotFound("Source not found");

                    src.src_name = model.FieldValue;
                    message = "Source updated successfully";
                }

                else if (model.FieldName == "continent")
                {
                    var cont = _msmeContext.Master_Continent
                        .FirstOrDefault(x => x.conti_id == model.RecordId);

                    if (cont == null) return NotFound("Continent not found");

                    cont.conti_name = model.FieldValue;
                    message = "Continent updated successfully";
                }

                else if (model.FieldName == "country")
                {
                    var country = _msmeContext.Master_Country
                        .FirstOrDefault(x => x.country_id == model.RecordId);

                    if (country == null) return NotFound("Country not found");

                    country.country_name = model.FieldValue;
                    message = "Country updated successfully";
                }

                else if (model.FieldName == "state")
                {
                    var state = _msmeContext.Master_State
                        .FirstOrDefault(x => x.state_id == model.RecordId);

                    if (state == null) return NotFound("State not found");

                    state.state_name = model.FieldValue;
                    message = "State updated successfully";
                }

                else if (model.FieldName == "city")
                {
                    var city = _msmeContext.Master_City
                        .FirstOrDefault(x => x.city_id == model.RecordId);

                    if (city == null) return NotFound("City not found");

                    city.city_name = model.FieldValue;
                    message = "City updated successfully";
                }

                _msmeContext.SaveChanges();

                return Ok(new { message = message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
