import React from 'react';
import PipelineVisualization from '../Pipeline/PipelineVisualization';
import PipelineVisualizationLegacy from '../Pipeline/PipelineVisualizationLegacy';
import type { PipelineState } from '../../types/supplierRequest';
import './PipelineComparison.css';

const SAMPLE_PIPELINES: { label: string; pipeline: PipelineState }[] = [
  {
    label: 'In Progress (at SAM)',
    pipeline: { pre_align: 'approved', bu: 'approved', sam: 'pending', saml: 'not_reached', qr: 'not_reached' },
  },
  {
    label: 'Rejected at BU',
    pipeline: { pre_align: 'approved', bu: 'rejected', sam: 'not_reached', saml: 'not_reached', qr: 'not_reached' },
  },
  {
    label: 'Fully Complete',
    pipeline: { pre_align: 'approved', bu: 'approved', sam: 'approved', saml: 'approved', qr: 'approved' },
  },
  {
    label: 'Early Stage (at BU)',
    pipeline: { pre_align: 'approved', bu: 'pending', sam: 'not_reached', saml: 'not_reached', qr: 'not_reached' },
  },
  {
    label: 'With Skipped Stages',
    pipeline: { pre_align: 'approved', bu: 'skipped', sam: 'approved', saml: 'pending', qr: 'not_reached' },
  },
  {
    label: 'Not Started',
    pipeline: { pre_align: 'not_reached', bu: 'not_reached', sam: 'not_reached', saml: 'not_reached', qr: 'not_reached' },
  },
  {
    label: 'Near Completion (at Q&R)',
    pipeline: { pre_align: 'approved', bu: 'approved', sam: 'approved', saml: 'approved', qr: 'pending' },
  },
];

const PipelineComparison: React.FC = () => {
  return (
    <div className="pipeline-comparison">
      <div className="comparison-header">
        <h2 className="comparison-title">Pipeline Status — Design Comparison</h2>
        <p className="comparison-subtitle">
          Side-by-side comparison of the current (Option A) and legacy (Option B) pipeline visualizations across different states.
        </p>
      </div>

      <div className="comparison-grid">
        {/* Column Headers */}
        <div className="comparison-col-header">Scenario</div>
        <div className="comparison-col-header comparison-col-header--a">
          <span className="comparison-option-badge option-a">Option A</span>
          Badge + Progress Bar
        </div>
        <div className="comparison-col-header comparison-col-header--b">
          <span className="comparison-option-badge option-b">Option B</span>
          Icon Chain (Legacy)
        </div>

        {/* Rows */}
        {SAMPLE_PIPELINES.map(({ label, pipeline }) => (
          <React.Fragment key={label}>
            <div className="comparison-scenario">{label}</div>
            <div className="comparison-cell">
              <PipelineVisualization pipeline={pipeline} />
            </div>
            <div className="comparison-cell comparison-cell--legacy">
              <PipelineVisualizationLegacy pipeline={pipeline} />
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="comparison-notes">
        <div className="comparison-note-card">
          <h3>Option A — Badge + Progress Bar</h3>
          <ul>
            <li>Compact: fits in ~160px column width</li>
            <li>Scannable in milliseconds — colored badge tells you the current stage instantly</li>
            <li>Progress bar gives at-a-glance completion overview</li>
            <li>Hover tooltip reveals full stage-by-stage detail</li>
          </ul>
        </div>
        <div className="comparison-note-card">
          <h3>Option B — Icon Chain (Legacy)</h3>
          <ul>
            <li>Shows all 5 stages simultaneously</li>
            <li>Requires ~320px width — causes table overflow</li>
            <li>Higher cognitive load to parse current status</li>
            <li>Familiar pattern if users are accustomed to it</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PipelineComparison;
