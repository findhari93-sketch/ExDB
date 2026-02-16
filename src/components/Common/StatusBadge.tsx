import React from 'react';
import './StatusBadge.css';

interface StatusBadgeProps {
  type: 'Award' | 'Remove';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type }) => {
  return (
    <span className={`status-badge status-badge-${type.toLowerCase()}`}>
      {type}
    </span>
  );
};

export default StatusBadge;
