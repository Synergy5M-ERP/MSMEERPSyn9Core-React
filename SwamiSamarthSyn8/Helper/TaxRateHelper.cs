namespace SwamiSamarthSyn8.Helper
{
    public static class TaxRateHelper
    {
        public static decimal GetTaxRate(string taxRate, string taxType)
        {
            if (string.IsNullOrWhiteSpace(taxRate))
                return 0;

            var part = taxRate
                .Split(';', StringSplitOptions.RemoveEmptyEntries)
                .FirstOrDefault(x => x.Contains(taxType, StringComparison.OrdinalIgnoreCase));

            if (part == null)
                return 0;

            var value = part
                .Replace(taxType, "", StringComparison.OrdinalIgnoreCase)
                .Replace("%", "")
                .Trim();

            return decimal.TryParse(value, out var rate) ? rate : 0;
        }
    }
}
