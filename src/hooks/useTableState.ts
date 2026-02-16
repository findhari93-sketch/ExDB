import { useMemo } from 'react';
import type { SupplierRequest, DashboardState, PipelineStageName } from '../types/supplierRequest';

const STAGE_NAMES: PipelineStageName[] = ['pre_align', 'bu', 'sam', 'saml', 'qr'];

export function useTableState(data: SupplierRequest[], state: DashboardState) {
  const { filters, sort, pagination } = state;

  const filtered = useMemo(() => {
    let result = data;

    // Part number / general search
    if (filters.partNumber) {
      const q = filters.partNumber.toLowerCase();
      result = result.filter(
        (r) =>
          r.ex_supplier_name.toLowerCase().includes(q) ||
          String(r.request_id).includes(q)
      );
    }

    // Dropdown filters
    if (filters.exSupplier) {
      result = result.filter((r) => r.ex_supplier_name === filters.exSupplier);
    }
    if (filters.requestId) {
      result = result.filter((r) => String(r.request_id) === filters.requestId);
    }
    if (filters.requestType) {
      result = result.filter((r) => r.type === filters.requestType);
    }
    if (filters.regionalHold) {
      result = result.filter((r) => r.regional_hold === filters.regionalHold);
    }
    if (filters.approverType) {
      const q = filters.approverType;
      result = result.filter(
        (r) =>
          r.pre_align_approver === q ||
          r.bu_approver === q ||
          r.sam_approver === q ||
          r.saml_approver === q ||
          r.qr_approver === q
      );
    }

    // Pipeline stage filter (show requests that have "pending" at this stage)
    if (filters.activeStageFilter) {
      result = result.filter((r) => r.pipeline[filters.activeStageFilter!] === 'pending');
    }

    // Column-level inline filters
    for (const [col, val] of Object.entries(filters.columnFilters)) {
      if (!val) continue;
      const q = val.toLowerCase();
      result = result.filter((r) => {
        const cellValue = String((r as Record<string, unknown>)[col] ?? '');
        return cellValue.toLowerCase().includes(q);
      });
    }

    return result;
  }, [data, filters]);

  const sorted = useMemo(() => {
    if (!sort.column || !sort.direction) return filtered;
    const col = sort.column;
    const dir = sort.direction === 'asc' ? 1 : -1;

    return [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[col];
      const bVal = (b as Record<string, unknown>)[col];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [filtered, sort]);

  const totalFiltered = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pagination.pageSize));
  const startIdx = (pagination.currentPage - 1) * pagination.pageSize;
  const visibleRows = sorted.slice(startIdx, startIdx + pagination.pageSize);

  const stageCounts = useMemo(() => {
    const counts: Record<PipelineStageName, number> = {
      pre_align: 0, bu: 0, sam: 0, saml: 0, qr: 0,
    };
    // Count from ALL data (not filtered), so badges always show total pending
    for (const r of data) {
      for (const stage of STAGE_NAMES) {
        if (r.pipeline[stage] === 'pending') counts[stage]++;
      }
    }
    return counts;
  }, [data]);

  return { visibleRows, totalFiltered, totalPages, stageCounts, allFilteredIds: filtered.map((r) => r.request_id) };
}
