import React from 'react';
import type { PipelineStageName } from '../../types/supplierRequest';
import './PipelineCounterBadges.css';

interface PipelineCounterBadgesProps {
  stageCounts: Record<PipelineStageName, number>;
  totalRequests: number;
  activeStage: PipelineStageName | null;
  onStageClick: (stage: PipelineStageName) => void;
}

const STAGE_LABELS: { key: PipelineStageName; label: string }[] = [
  { key: 'pre_align', label: 'PreAlign' },
  { key: 'bu', label: 'BU' },
  { key: 'sam', label: 'SAM' },
  { key: 'saml', label: 'SAML' },
  { key: 'qr', label: 'Q&R' },
];

const RING_SIZE = 52;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const INNER_RADIUS = 16;
const CENTER = RING_SIZE / 2;
const START_OFFSET = CIRCUMFERENCE * 0.25;

const PipelineCounterBadges: React.FC<PipelineCounterBadgesProps> = ({
  stageCounts,
  totalRequests,
  activeStage,
  onStageClick,
}) => {
  return (
    <div className="pipeline-counter-badges">
      {STAGE_LABELS.map(({ key, label }) => {
        const pendingCount = stageCounts[key];
        const completedCount = totalRequests - pendingCount;
        const hasPending = pendingCount > 0;

        const completedPct = totalRequests > 0 ? completedCount / totalRequests : 1;
        const completedLength = completedPct * CIRCUMFERENCE;

        const isActive = activeStage === key;

        return (
          <button
            key={key}
            className={`pipeline-progress-badge ${isActive ? 'active' : ''}`}
            onClick={() => onStageClick(key)}
            title={`${label}: ${pendingCount} pending of ${totalRequests} total`}
          >
            <svg
              className="pipeline-progress-ring"
              width={RING_SIZE}
              height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            >
              {/* Full ring in pending color (amber) - visible where green doesn't cover */}
              <circle
                className="pipeline-ring-pending-track"
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE_WIDTH}
              />

              {/* Completed arc (green) overlaid on top */}
              {completedCount > 0 && (
                <circle
                  className="pipeline-ring-completed"
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={`${completedLength} ${CIRCUMFERENCE - completedLength}`}
                  strokeDashoffset={START_OFFSET}
                  strokeLinecap="round"
                />
              )}

              {/* Inner filled circle (golden background for count) */}
              <circle
                className={`pipeline-inner-circle ${hasPending ? 'has-pending' : 'all-clear'}`}
                cx={CENTER}
                cy={CENTER}
                r={INNER_RADIUS}
              />

              {/* Count number */}
              <text
                className="pipeline-ring-count"
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {pendingCount}
              </text>
            </svg>
            <span className="pipeline-progress-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PipelineCounterBadges;
