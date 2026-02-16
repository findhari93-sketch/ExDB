import React, { useState, useRef, useEffect } from 'react';
import { Check, Clock, X, Minus, Circle } from 'lucide-react';
import type { PipelineState, PipelineStageStatus, ApproverMap } from '../../types/supplierRequest';
import './PipelineVisualization.css';

interface PipelineVisualizationProps {
  pipeline: PipelineState;
  approvers?: ApproverMap;
}

const STAGES: { key: keyof PipelineState; label: string; short: string }[] = [
  { key: 'pre_align', label: 'PreAlign', short: 'PA' },
  { key: 'bu', label: 'BU', short: 'BU' },
  { key: 'sam', label: 'SAM', short: 'SAM' },
  { key: 'saml', label: 'SAML', short: 'SML' },
  { key: 'qr', label: 'Q&R', short: 'Q&R' },
];

interface StageInfo {
  label: string;
  short: string;
  status: PipelineStageStatus;
}

interface PipelineSummary {
  current: StageInfo;
  lastCompleted: StageInfo | null;
}

function getPipelineSummary(pipeline: PipelineState): PipelineSummary {
  let lastCompleted: StageInfo | null = null;

  for (let i = 0; i < STAGES.length; i++) {
    const status = pipeline[STAGES[i].key];

    if (status === 'approved' || status === 'skipped') {
      if (status === 'approved') {
        lastCompleted = { label: STAGES[i].label, short: STAGES[i].short, status: 'approved' };
      }
      continue;
    }

    if (status === 'pending') {
      return {
        current: { label: STAGES[i].label, short: STAGES[i].short, status: 'pending' },
        lastCompleted,
      };
    }
    if (status === 'rejected') {
      return {
        current: { label: STAGES[i].label, short: STAGES[i].short, status: 'rejected' },
        lastCompleted,
      };
    }
    if (status === 'not_reached') {
      if (i === 0) {
        return {
          current: { label: 'Not Started', short: '', status: 'not_reached' },
          lastCompleted: null,
        };
      }
      return {
        current: { label: STAGES[i].label, short: STAGES[i].short, status: 'not_reached' },
        lastCompleted,
      };
    }
  }

  return {
    current: { label: 'Complete', short: '', status: 'approved' },
    lastCompleted: null,
  };
}

function getStatusIcon(status: PipelineStageStatus, size = 11) {
  switch (status) {
    case 'approved': return <Check size={size} strokeWidth={3} />;
    case 'pending': return <Clock size={size} strokeWidth={2.5} />;
    case 'rejected': return <X size={size} strokeWidth={3} />;
    case 'skipped': return <Minus size={size} strokeWidth={3} />;
    case 'not_reached': return <Circle size={size - 1} strokeWidth={2} />;
  }
}

function getStatusLabel(status: PipelineStageStatus): string {
  switch (status) {
    case 'approved': return 'Approved';
    case 'pending': return 'Pending';
    case 'rejected': return 'Rejected';
    case 'skipped': return 'Skipped';
    case 'not_reached': return 'Not Reached';
  }
}

const PipelineVisualization: React.FC<PipelineVisualizationProps> = ({ pipeline, approvers }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<'below' | 'above'>('below');
  const containerRef = useRef<HTMLDivElement>(null);

  const summary = getPipelineSummary(pipeline);
  const isComplete = summary.current.label === 'Complete';
  const isNotStarted = summary.current.label === 'Not Started';
  const showDual = !isComplete && !isNotStarted && summary.lastCompleted !== null;

  useEffect(() => {
    if (showTooltip && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setTooltipPos(spaceBelow < 200 ? 'above' : 'below');
    }
  }, [showTooltip]);

  return (
    <div
      className="pipeline-compact"
      ref={containerRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge Row */}
      <div className={`pipeline-badge-row${showDual ? ' pipeline-badge-row--dual' : ''}`}>
        {showDual ? (
          <>
            <span className="pipeline-badge pipeline-badge--approved">
              <span className="pipeline-badge__icon">{getStatusIcon('approved', 10)}</span>
              {summary.lastCompleted!.short}
            </span>
            <span className={`pipeline-badge pipeline-badge--${summary.current.status}`}>
              <span className="pipeline-badge__icon">{getStatusIcon(summary.current.status, 10)}</span>
              {summary.current.short || summary.current.label}
            </span>
          </>
        ) : (
          <span className={`pipeline-badge pipeline-badge--${summary.current.status}`}>
            {isComplete && <span className="pipeline-badge__icon">{getStatusIcon('approved', 10)}</span>}
            {!isComplete && !isNotStarted && <span className="pipeline-badge__icon">{getStatusIcon(summary.current.status, 10)}</span>}
            {summary.current.label}
          </span>
        )}
      </div>

      {/* Segmented Progress Bar */}
      <div className="pipeline-bar">
        {STAGES.map((stage) => {
          const status = pipeline[stage.key];
          return (
            <div key={stage.key} className={`pipeline-bar__segment pipeline-bar__segment--${status}`} />
          );
        })}
      </div>

      {/* Hover Tooltip */}
      {showTooltip && (
        <div className={`pipeline-tooltip pipeline-tooltip--${tooltipPos}`}>
          <div className="pipeline-tooltip__header">Pipeline Status</div>
          {STAGES.map((stage) => {
            const status = pipeline[stage.key];
            return (
              <div key={stage.key} className={`pipeline-tooltip__row ${status === 'skipped' ? 'pipeline-tooltip__row--skipped' : ''}`}>
                <span className={`pipeline-tooltip__icon pipeline-tooltip__icon--${status}`}>
                  {getStatusIcon(status)}
                </span>
                <span className="pipeline-tooltip__stage">{stage.label}</span>
                {approvers && (
                  <span className="pipeline-tooltip__approver">
                    {approvers[stage.key] || '\u2014'}
                  </span>
                )}
                <span className={`pipeline-tooltip__status pipeline-tooltip__status--${status}`}>
                  {getStatusLabel(status)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PipelineVisualization;
