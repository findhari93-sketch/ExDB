import React, { useState, useCallback } from 'react';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import { useTableState } from '../../hooks/useTableState';
import { useExcelExport } from '../../hooks/useExcelExport';
import { sampleRequests } from '../../data/sampleRequests';
import AddRequestButton from './AddRequestButton';
import PipelineCounterBadges from './PipelineCounterBadges';
import InlineFilterBar from './InlineFilterBar';
import { Search } from 'lucide-react';
import ExcelIcon from '../Common/ExcelIcon';
import DataTable from '../Table/DataTable';
import type { DashboardFilters, PipelineStageName } from '../../types/supplierRequest';
import './Dashboard.css';

const DashboardContent: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const { visibleRows, totalFiltered, totalPages, stageCounts, allFilteredIds } = useTableState(sampleRequests, state);
  const { exportToExcel } = useExcelExport();
  const [isFilterFlipped, setIsFilterFlipped] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    dispatch({ type: 'SET_FILTER', key: key as keyof Omit<DashboardFilters, 'columnFilters' | 'activeStageFilter'>, value });
  };

  const handleStageClick = (stage: PipelineStageName) => {
    dispatch({ type: 'SET_STAGE_FILTER', stage });
  };

  const handleExport = async () => {
    const dataToExport = allFilteredIds.length > 0
      ? sampleRequests.filter((r) => allFilteredIds.includes(r.request_id))
      : sampleRequests;
    await exportToExcel(dataToExport);
  };

  const handleClearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, [dispatch]);

  return (
    <div className="dashboard">
      <div className="dashboard-card glass-card">
        <div className="dashboard-toolbar">
          <AddRequestButton />

          <div className="toolbar-divider" />

          <PipelineCounterBadges
            stageCounts={stageCounts}
            totalRequests={sampleRequests.length}
            activeStage={state.filters.activeStageFilter}
            onStageClick={handleStageClick}
          />

          <div className="toolbar-divider" />

          <InlineFilterBar
            filters={state.filters}
            data={sampleRequests}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isFlipped={isFilterFlipped}
            onToggleFlip={() => setIsFilterFlipped((prev) => !prev)}
          />

          <div className="toolbar-actions">
            <button
              className="toolbar-search-btn"
              onClick={() => setIsFilterFlipped((prev) => !prev)}
              title={isFilterFlipped ? 'Show Filters' : 'Hide Filters'}
            >
              <Search size={18} strokeWidth={2} />
              <span className="toolbar-btn-label">Search</span>
            </button>

            <button className="toolbar-export-btn" onClick={handleExport} title="Export to Excel">
              <ExcelIcon size={22} />
              <span className="toolbar-export-label">Export</span>
            </button>
          </div>
        </div>

        <DataTable
          rows={visibleRows}
          allData={sampleRequests}
          totalFiltered={totalFiltered}
          totalPages={totalPages}
          currentPage={state.pagination.currentPage}
          pageSize={state.pagination.pageSize}
          sort={state.sort}
          filters={state.filters}
          columnFilters={state.filters.columnFilters}
          selectedRows={state.selectedRows}
          allFilteredIds={allFilteredIds}
          pipelineFilter={state.filters.activeStageFilter}
          onSort={(col) => dispatch({ type: 'SET_SORT', column: col })}
          onColumnFilter={(col, val) => dispatch({ type: 'SET_COLUMN_FILTER', column: col, value: val })}
          onPipelineFilter={(stage) => dispatch({ type: 'SET_STAGE_FILTER', stage })}
          onPageChange={(page) => dispatch({ type: 'SET_PAGE', page })}
          onToggleRow={(id) => dispatch({ type: 'TOGGLE_ROW_SELECT', id })}
          onSelectAll={(ids) => dispatch({ type: 'SELECT_ALL', ids })}
          onDeselectAll={() => dispatch({ type: 'DESELECT_ALL' })}
        />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => (
  <DashboardProvider>
    <DashboardContent />
  </DashboardProvider>
);

export default Dashboard;
