import React from 'react';
import { Check, Clock, X, Minus } from 'lucide-react';
import type { PipelineState, PipelineStageStatus } from '../../types/supplierRequest';
import './PipelineVisualizationLegacy.css';

interface PipelineVisualizationLegacyProps {
  pipeline: PipelineState;
}

const STAGES: { key: keyof PipelineState; label: string }[] = [
  { key: 'pre_align', label: 'Pre Align' },
  { key: 'bu', label: 'BU' },
  { key: 'sam', label: 'SAM' },
  { key: 'saml', label: 'SAML' },
  { key: 'qr', label: 'Q&R' },
];

function getStatusIcon(status: PipelineStageStatus) {
  switch (status) {
    case 'approved': return <Check size={12} strokeWidth={3} />;
    case 'pending': return <Clock size={11} strokeWidth={2.5} />;
    case 'rejected': return <X size={12} strokeWidth={3} />;
    case 'skipped': return <Minus size={12} strokeWidth={3} />;
    case 'not_reached': return <Clock size={11} strokeWidth={2} />;
  }
}

const PipelineVisualizationLegacy: React.FC<PipelineVisualizationLegacyProps> = ({ pipeline }) => {
  return (
    <div className="pipeline-viz-legacy">
      {STAGES.map((stage, i) => {
        const status = pipeline[stage.key];
        const prevStatus = i > 0 ? pipeline[STAGES[i - 1].key] : null;
        const connectorActive = prevStatus === 'approved';

        return (
          <React.Fragment key={stage.key}>
            {i > 0 && (
              <div className={`pipeline-arrow-legacy ${connectorActive ? 'active' : ''}`}>
                <svg width="24" height="10" viewBox="0 0 24 10">
                  <line
                    x1="0" y1="5" x2="18" y2="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray={connectorActive ? 'none' : '3 2'}
                  />
                  <polyline
                    points="15,2 19,5 15,8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
            <div className={`pipeline-stage-legacy pipeline-stage-legacy-${status}`}>
              <div className={`pipeline-circle-legacy pipeline-circle-legacy-${status}`}>
                {getStatusIcon(status)}
              </div>
              <span className="pipeline-label-legacy">{stage.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PipelineVisualizationLegacy;
