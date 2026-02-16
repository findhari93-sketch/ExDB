import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { DashboardState, DashboardFilters, PipelineStageName, SortDirection } from '../types/supplierRequest';

const initialFilters: DashboardFilters = {
  partNumber: '',
  exSupplier: '',
  requestId: '',
  requestType: '',
  approverType: '',
  partStatus: '',
  regionalHold: '',
  activeStageFilter: null,
  columnFilters: {},
};

const initialState: DashboardState = {
  filters: initialFilters,
  sort: { column: null, direction: null },
  pagination: { currentPage: 1, pageSize: 15 },
  selectedRows: new Set<number>(),
};

type Action =
  | { type: 'SET_FILTER'; key: keyof Omit<DashboardFilters, 'columnFilters' | 'activeStageFilter'>; value: string }
  | { type: 'SET_STAGE_FILTER'; stage: PipelineStageName | null }
  | { type: 'SET_COLUMN_FILTER'; column: string; value: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; column: string }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'TOGGLE_ROW_SELECT'; id: number }
  | { type: 'SELECT_ALL'; ids: number[] }
  | { type: 'DESELECT_ALL' };

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
        pagination: { ...state.pagination, currentPage: 1 },
      };

    case 'SET_STAGE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          activeStageFilter: state.filters.activeStageFilter === action.stage ? null : action.stage,
        },
        pagination: { ...state.pagination, currentPage: 1 },
      };

    case 'SET_COLUMN_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          columnFilters: { ...state.filters.columnFilters, [action.column]: action.value },
        },
        pagination: { ...state.pagination, currentPage: 1 },
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialFilters,
        pagination: { ...state.pagination, currentPage: 1 },
      };

    case 'SET_SORT': {
      let direction: SortDirection = 'asc';
      if (state.sort.column === action.column) {
        if (state.sort.direction === 'asc') direction = 'desc';
        else if (state.sort.direction === 'desc') direction = null;
      }
      return {
        ...state,
        sort: { column: direction ? action.column : null, direction },
      };
    }

    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, currentPage: action.page },
      };

    case 'TOGGLE_ROW_SELECT': {
      const next = new Set(state.selectedRows);
      if (next.has(action.id)) next.delete(action.id);
      else next.add(action.id);
      return { ...state, selectedRows: next };
    }

    case 'SELECT_ALL':
      return { ...state, selectedRows: new Set(action.ids) };

    case 'DESELECT_ALL':
      return { ...state, selectedRows: new Set() };

    default:
      return state;
  }
}

interface DashboardContextValue {
  state: DashboardState;
  dispatch: React.Dispatch<Action>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
