import type { SupplierRequest } from '../types/supplierRequest';

const STAGE_LABELS: Record<string, string> = {
  pre_align: 'Pre Align',
  bu: 'BU',
  sam: 'SAM',
  saml: 'SAML',
  qr: 'Q&R',
};

export function useExcelExport() {
  const exportToExcel = async (rows: SupplierRequest[], filename = 'supplier-requests') => {
    const xlsx = await import('xlsx');

    const exportData = rows.map((r) => ({
      'Request ID': r.request_id,
      'Request Date': r.request_date,
      'Ex Supplier Name': r.ex_supplier_name,
      'Flagged': r.flagged ? 'Yes' : 'No',
      'Regional Hold': r.regional_hold,
      'Requestor': r.requestor,
      'Type': r.type,
      ...Object.fromEntries(
        Object.entries(r.pipeline).map(([k, v]) => [`${STAGE_LABELS[k]} Status`, v])
      ),
      'Pre Align Approver': r.pre_align_approver,
      'BU Approver': r.bu_approver,
      'SAM Approver': r.sam_approver,
      'SAML Approver': r.saml_approver,
      'Q&R Approver': r.qr_approver,
      'Last Acted On': r.last_acted_on,
    }));

    const ws = xlsx.utils.json_to_sheet(exportData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Requests');

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...exportData.map((row) => String((row as Record<string, unknown>)[key] ?? '').length)) + 2,
    }));
    ws['!cols'] = colWidths;

    xlsx.writeFile(wb, `${filename}.xlsx`);
  };

  return { exportToExcel };
}
