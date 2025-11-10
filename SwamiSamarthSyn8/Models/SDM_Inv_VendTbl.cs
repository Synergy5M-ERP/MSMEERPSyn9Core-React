using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_Inv_VendTbl")]
public partial class SDM_Inv_VendTbl
{
    [Key]
    public int supplied_id { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? supplier_company_name { get; set; }

    [Unicode(false)]
    public string? supplier_company_address { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? supplier_GSTIN { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? supplier_pan_no { get; set; }

    [Unicode(false)]
    public string? registred_office_address { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? registred_office_contact_no { get; set; }

    [Unicode(false)]
    public string? registred_office_email_address { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? cin_number { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? IEO_No { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? invoice_number { get; set; }

    public DateOnly? invoice_date { get; set; }

    public DateOnly? invoice_issue_date { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? reference_no { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? invoice_IRN { get; set; }

    public DateOnly? from_date { get; set; }

    public DateOnly? due_date { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? invoice_po_no { get; set; }

    public DateOnly? invoice_po_date { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? place_of_suuplay { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? broker_name { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Buyer_code { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? BuyerName { get; set; }

    [Unicode(false)]
    public string? BuyerAddress { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? buyer_state_name { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? buyer_pan_no { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? BGSTNumber { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? shiped_to_customer_code { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? DeliveryName { get; set; }

    [Unicode(false)]
    public string? DAddress { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? shiped_to_state_name { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? shiped_to_pan_no { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Delievery_GST_Number { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? bank_name { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? branch { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? account_no { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ifsc_code { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? shift_code { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Ewaybill_no { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? lr_no { get; set; }

    public DateOnly? lr_date { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? vehicle_no { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? transporters_name { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? spincode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? rpincode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? bpincode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? sppincode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? driver_name { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? credit_term { get; set; }

    public double? total { get; set; }

    public double? Fright_Term { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? final_Amount { get; set; }

    public double? total_in_figures { get; set; }

    [Unicode(false)]
    public string? total_in_word { get; set; }

    [Unicode(false)]
    public string? term_conditions { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? supplier_state { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? regi_state { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? delivery_term { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? dispatched_through { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SONumber { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SOVendorName { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SODate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SellerCity { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? BillCity { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ShippedCity { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? PaymentTerms { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DeliveryTerms { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? BillToContactNo { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? ShipToContactNo { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BillToEmail { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ShippToEmail { get; set; }

    [StringLength(100)]
    public string? EDI_No { get; set; }

    [StringLength(500)]
    public string? IRN_No { get; set; }

    [StringLength(200)]
    public string? Ack_No { get; set; }

    [StringLength(300)]
    public string? QR_Code { get; set; }

    [StringLength(50)]
    public string? Zone { get; set; }

    public string? E_InvoiceUpload { get; set; }

    public string? E_WayUpload { get; set; }

    [InverseProperty("supplied_id")]
    public virtual ICollection<SDM_InvItemTbl> SDM_InvItemTbls { get; set; } = new List<SDM_InvItemTbl>();
}
