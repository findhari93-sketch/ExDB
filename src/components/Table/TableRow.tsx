import React from 'react';
import Checkbox from '../Common/Checkbox';
import StatusBadge from '../Common/StatusBadge';
import PipelineVisualization from '../Pipeline/PipelineVisualization';
import type { SupplierRequest } from '../../types/supplierRequest';
import type { ColumnDef } from './TableHeader';
import './TableRow.css';

interface TableRowProps {
  request: SupplierRequest;
  columns: ColumnDef[];
  selected: boolean;
  onToggleSelect: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ request, columns, selected, onToggleSelect }) => {
  const renderCell = (col: ColumnDef) => {
    switch (col.key) {
      case 'request_id':
        return (
          <span className={`request-id-link request-id-${request.type.toLowerCase()}`}>
            {request.request_id}
          </span>
        );

      case 'ex_supplier_name':
        return (
          <span className="supplier-name-cell">
            <span className="supplier-name-text">{request.ex_supplier_name}</span>
            {request.flagged && <span className="flagged-badge">R</span>}
          </span>
        );

      case 'type':
        return <StatusBadge type={request.type} />;

      case 'pipeline':
        return (
          <PipelineVisualization
            pipeline={request.pipeline}
            approvers={{
              pre_align: request.pre_align_approver,
              bu: request.bu_approver,
              sam: request.sam_approver,
              saml: request.saml_approver,
              qr: request.qr_approver,
            }}
          />
        );

      case 'regional_hold':
        return (
          <span className={`hold-badge ${request.regional_hold === 'Yes' ? 'hold-yes' : 'hold-no'}`}>
            {request.regional_hold}
          </span>
        );

      default:
        return <span>{String((request as Record<string, unknown>)[col.key] ?? '')}</span>;
    }
  };

  return (
    <tr className={`table-row row-${request.type.toLowerCase()} ${selected ? 'selected' : ''}`}>
      <td className="td-checkbox sticky-col sticky-col-0">
        <Checkbox checked={selected} onChange={onToggleSelect} />
      </td>
      {columns.map((col) => (
        <td
          key={col.key}
          className={`td-cell ${col.sticky ? 'sticky-col sticky-col-1' : ''}`}
        >
          {renderCell(col)}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
