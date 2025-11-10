using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Models.Accounts;
using System.Net.Http.Json;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [ApiController]
    [Route("api/[controller]")]
    public class CountryController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public CountryController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCountries()
        {
            // Fetch data from RESTCountries API
            var countries = await _httpClient.GetFromJsonAsync<List<CountryResponse>>("https://restcountries.com/v3.1/all");

            if (countries == null)
                return NotFound("Unable to fetch countries.");

            // Simplify response
            var result = countries
                .Select(c => new
                {
                    Name = c.Name.Common,
                    Code = c.Cca2,
                    Region = c.Region,
                    Flag = c.Flag
                })
                .OrderBy(c => c.Name);

            return Ok(result);
        }
    }
}
