using System;

namespace SwamiSamarthSyn8.Helper
{
    public static class ReformatDate
    {
        public static string FormatDateDDMMYYYY(DateTime? date)
        {
            if (!date.HasValue)
                return string.Empty;

            return date.Value.ToString("dd-MM-yyyy");
        }
    }
}
