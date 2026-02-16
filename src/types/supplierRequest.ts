export type PipelineStageStatus = 'approved' | 'pending' | 'rejected' | 'not_reached' | 'skipped';

export interface PipelineState {
  pre_align: PipelineStageStatus;
  bu: PipelineStageStatus;
  sam: PipelineStageStatus;
  saml: PipelineStageStatus;
  qr: PipelineStageStatus;
}

export type RequestType = 'Award' | 'Remove';
export type RegionalHold = 'Yes' | 'No' | '';

export interface SupplierRequest {
  request_id: number;
  request_date: string;
  ex_supplier_name: string;
  flagged?: boolean;
  regional_hold: RegionalHold;
  requestor: string;
  type: RequestType;
  pipeline: PipelineState;
  pre_align_approver: string;
  bu_approver: string;
  sam_approver: string;
  saml_approver: string;
  qr_approver: string;
  last_acted_on: string;
}

export type PipelineStageName = keyof PipelineState;

export type ApproverMap = Record<keyof PipelineState, string>;

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface DashboardFilters {
  partNumber: string;
  exSupplier: string;
  requestId: string;
  requestType: RequestType | '';
  approverType: string;
  partStatus: string;
  regionalHold: RegionalHold | '';
  activeStageFilter: PipelineStageName | null;
  columnFilters: Record<string, string>;
}

export interface DashboardState {
  filters: DashboardFilters;
  sort: SortState;
  pagination: { currentPage: number; pageSize: number };
  selectedRows: Set<number>;
}
