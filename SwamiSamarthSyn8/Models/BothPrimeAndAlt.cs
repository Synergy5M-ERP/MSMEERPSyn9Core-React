namespace SwamiSamarthSyn8.Models
{
    public class BothPrimeAndAlt
    {
        public List<PrimaryItem> PrimaeryData { get; set; }
        public List<AlternateItem> AlternateData { get; set; }
    }


    public class PrimaryItem
    {
        public string ITEM_NAME { get; set; }
        public string GRADE { get; set; }
        public string UOM { get; set; }
        public decimal? QTY { get; set; }
        public string TYPE { get; set; }
        public string ITEM_CODE { get; set; }
    }



    public class AlternateItem
    {
        public string ITEM_NAME { get; set; }
        public string GRADE { get; set; }
        public string UOM { get; set; }
        public decimal? QTY { get; set; }
        public string TYPE { get; set; }
        public string ITEM_CODE { get; set; }
    }


}
