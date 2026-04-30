import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import type { Test } from '../types';
import './Home.css';

interface TooltipData {
  x: number;
  rawY: number | null;
  scaledY: number | null;
  test: Test;
  i: number;
  type: string;
  mx: number;
  my: number;
}

interface ChartSettings {
  yAxisMode: 'percent' | 'scaled';
  maxScaledLimit: number;
  showRaw: boolean;
  showScaled: boolean;
}

function ScoreChart({ tests, settings }: { tests: Test[]; settings: ChartSettings }) {
  if (tests.length === 0) {
    return (
      <div className="chart-empty">
        <div className="chart-empty-icon">📈</div>
        <p>No corrected tests yet. Complete and correct a test to see your progress.</p>
      </div>
    );
  }

  const corrected = tests.filter((t: Test) => t.rawScore !== null).sort((a: Test, b: Test) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  if (corrected.length === 0) {
    return (
      <div className="chart-empty">
        <div className="chart-empty-icon">📈</div>
        <p>No corrected tests in this selection.</p>
      </div>
    );
  }

  const width = 700;
  const height = 260;
  const padL = 48, padR = 24, padT = 24, padB = 40;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  // Calculate Y-axis range based on mode
  let yMin = 0;
  let yMax = 100;
  let yTicks: number[] = [];
  
  if (settings.yAxisMode === 'percent') {
    yMax = 100;
    yTicks = [0, 25, 50, 75, 100];
  } else {
    yMax = settings.maxScaledLimit;
    // Generate ticks dynamically based on max limit
    const step = Math.ceil(settings.maxScaledLimit / 4);
    yTicks = [0, step, step * 2, step * 3, settings.maxScaledLimit];
  }

  const pts = corrected.map((t: Test, i: number) => {
    const x = corrected.length === 1 ? chartW / 2 : (i / (corrected.length - 1)) * chartW;
    
    let rawY = null;
    let scaledY = null;
    
    if (settings.showRaw && t.rawScore !== null) {
      const rawPercent = (t.rawScore / (t.numQuestions || 44)) * 100;
      if (settings.yAxisMode === 'percent') {
        rawY = chartH - (rawPercent / 100) * chartH;
      } else {
        // Convert raw percent to scaled score approximation
        const approxScaled = (rawPercent / 100) * settings.maxScaledLimit;
        rawY = chartH - (approxScaled / settings.maxScaledLimit) * chartH;
      }
    }
    
    if (settings.showScaled && t.scaledScore !== null) {
      if (settings.yAxisMode === 'percent') {
        const scaledPercent = (t.scaledScore / (t.maxScaledScore || settings.maxScaledLimit)) * 100;
        scaledY = chartH - (scaledPercent / 100) * chartH;
      } else {
        scaledY = chartH - ((t.scaledScore || 0) / settings.maxScaledLimit) * chartH;
      }
    }
    
    return { x, rawY, scaledY, test: t, i };
  });

  const rawPath = pts.filter((p: any) => p.rawY !== null).map((p: any, i: number) => `${i === 0 ? 'M' : 'L'}${p.x},${p.rawY}`).join(' ');
  const scaledPath = pts.filter((p: any) => p.scaledY !== null).map((p: any, i: number) => `${i === 0 ? 'M' : 'L'}${p.x},${p.scaledY}`).join(' ');

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const getYLabel = (value: number) => {
    if (settings.yAxisMode === 'percent') {
      return `${value}%`;
    }
    return value.toString();
  };

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="score-chart">
        {/* Grid lines */}
        {yTicks.map(yValue => {
          const y = chartH - (yValue / yMax) * chartH;
          return (
            <g key={yValue}>
              <line x1={padL} y1={padT + y} x2={padL + chartW} y2={padT + y} stroke="var(--chart-grid)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padL - 6} y={padT + y + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">
                {getYLabel(yValue)}
              </text>
            </g>
          );
        })}

        {/* Lines */}
        {rawPath && settings.showRaw && (
          <path d={rawPath} transform={`translate(${padL},${padT})`} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
        )}
        {scaledPath && settings.showScaled && (
          <path d={scaledPath} transform={`translate(${padL},${padT})`} fill="none" stroke="var(--accent2)" strokeWidth="2.5" strokeLinejoin="round" strokeDasharray="6 3" />
        )}

        {/* Points */}
        {pts.map((p: any, idx: number) => (
          <g key={idx} transform={`translate(${padL},${padT})`}>
            {p.rawY !== null && settings.showRaw && (
              <circle
                cx={p.x} cy={p.rawY} r="5"
                fill="var(--accent)" stroke="var(--bg)" strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => setTooltip({ ...p, type: 'raw', mx: e.clientX, my: e.clientY })}
                onMouseLeave={() => setTooltip(null)}
              />
            )}
            {p.scaledY !== null && settings.showScaled && (
              <circle
                cx={p.x} cy={p.scaledY} r="5"
                fill="var(--accent2)" stroke="var(--bg)" strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => setTooltip({ ...p, type: 'scaled', mx: e.clientX, my: e.clientY })}
                onMouseLeave={() => setTooltip(null)}
              />
            )}
          </g>
        ))}

        {/* X labels */}
        {pts.map((p: any, idx: number) => (
          <text key={idx} x={padL + p.x} y={height - 6} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
            {new Date(p.test.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </text>
        ))}
      </svg>

      {tooltip && (
        <div className="chart-tooltip" style={{ left: (tooltip.mx + 12) as any, top: (tooltip.my - 40) as any }}>
          <strong>{tooltip.test.name}</strong>
          {tooltip.test.rawScore !== null && settings.showRaw && (
            <div>Raw: {tooltip.test.rawScore}/{tooltip.test.numQuestions}</div>
          )}
          {tooltip.test.scaledScore !== null && settings.showScaled && (
            <div>Scaled: {tooltip.test.scaledScore}/{tooltip.test.maxScaledScore || settings.maxScaledLimit}</div>
          )}
        </div>
      )}

      <div className="chart-legend">
        {settings.showRaw && (
          <span className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--accent)' }} /> Raw Score {settings.yAxisMode === 'percent' ? '%' : `(scaled to ${settings.maxScaledLimit})`}
          </span>
        )}
        {settings.showScaled && (
          <span className="legend-item">
            <span className="legend-dot dashed" style={{ background: 'var(--accent2)' }} /> Scaled Score
          </span>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function Home() {
  const data = useData();
  const [folderFilter, setFolderFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    yAxisMode: 'percent',
    maxScaledLimit: 800,
    showRaw: true,
    showScaled: true,
  });
  const [showSettings, setShowSettings] = useState(false);

  const tests = data.tests;
  const folders = data.folders;

  const filtered = useMemo(() => {
    let result = [...tests];
    if (folderFilter !== 'all') {
      result = result.filter((t: Test) => t.folderId === folderFilter);
    }
    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoffs: { [key: string]: number } = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 };
      const days = cutoffs[dateFilter];
      if (days) {
        const cutoff = new Date(now.getTime() - days * 86400000);
        result = result.filter((t: Test) => new Date(t.createdAt) >= cutoff);
      }
    }
    return result;
  }, [tests, folderFilter, dateFilter]);

  const corrected = filtered.filter((t: Test) => t.rawScore !== null);
  const avgRaw = corrected.length ? Math.round(corrected.reduce((s, t) => s + ((t.rawScore || 0) / (t.numQuestions || 44)) * 100, 0) / corrected.length) : null;
  const scaledTests = corrected.filter((t: Test) => t.scaledScore);
  const avgScaled = scaledTests.length
    ? Math.round(scaledTests.reduce((s, t) => s + (t.scaledScore || 0), 0) / scaledTests.length)
    : null;

  const trend = corrected.length >= 2
    ? Math.round(((corrected[corrected.length - 1].rawScore || 0) / (corrected[corrected.length - 1].numQuestions || 44)) * 100 - ((corrected[0].rawScore || 0) / (corrected[0].numQuestions || 44)) * 100)
    : null;

  const updateChartSetting = (key: keyof ChartSettings, value: any) => {
    setChartSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="home-page page">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <div className="filter-bar">
          <select className="filter-select" value={folderFilter} onChange={e => setFolderFilter(e.target.value)}>
            <option value="all">All Folders</option>
            {folders.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <select className="filter-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="365d">Last Year</option>
          </select>
          <button className="btn btn-outline btn-sm" onClick={() => setShowSettings(!showSettings)}>
            ⚙️ Chart Settings
          </button>
        </div>
      </div>

      {/* Chart Settings Panel */}
      {showSettings && (
        <div className="chart-settings-panel">
          <h3>Chart Settings</h3>
          <div className="settings-group">
            <label className="settings-label">Y-Axis Mode:</label>
            <div className="settings-buttons">
              <button
                className={`settings-btn ${chartSettings.yAxisMode === 'percent' ? 'active' : ''}`}
                onClick={() => updateChartSetting('yAxisMode', 'percent')}
              >
                Percent (%)
              </button>
              <button
                className={`settings-btn ${chartSettings.yAxisMode === 'scaled' ? 'active' : ''}`}
                onClick={() => updateChartSetting('yAxisMode', 'scaled')}
              >
                Scaled Score
              </button>
            </div>
          </div>

          {chartSettings.yAxisMode === 'scaled' && (
            <div className="settings-group">
              <label className="settings-label">Max Scaled Limit:</label>
              <input
                type="number"
                className="settings-input"
                value={chartSettings.maxScaledLimit}
                onChange={e => updateChartSetting('maxScaledLimit', parseInt(e.target.value) || 800)}
                min={100}
                max={1600}
                step={50}
              />
              <span className="settings-hint">(e.g., 800 for SAT, 36 for ACT)</span>
            </div>
          )}

          <div className="settings-group">
            <label className="settings-label">Show/Hide Lines:</label>
            <div className="settings-checkboxes">
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={chartSettings.showRaw}
                  onChange={e => updateChartSetting('showRaw', e.target.checked)}
                />
                <span style={{ color: 'var(--accent)' }}>● Raw Score</span>
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={chartSettings.showScaled}
                  onChange={e => updateChartSetting('showScaled', e.target.checked)}
                />
                <span style={{ color: 'var(--accent2)' }}>● Scaled Score</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="stat-grid">
        <StatCard label="Tests Taken" value={filtered.length} />
        <StatCard label="Tests Corrected" value={corrected.length} />
        <StatCard label="Avg Raw Score" value={avgRaw !== null ? `${avgRaw}%` : '—'} />
        <StatCard label="Avg Scaled Score" value={avgScaled !== null ? avgScaled : '—'} />
        <StatCard
          label="Overall Trend"
          value={trend !== null ? `${trend > 0 ? '+' : ''}${trend}%` : '—'}
          sub={trend !== null ? (trend > 0 ? '↑ Improving' : trend < 0 ? '↓ Declining' : '→ Stable') : undefined}
        />
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h2 className="section-title">Score Progress</h2>
          <div className="chart-status">
            {!chartSettings.showRaw && !chartSettings.showScaled && (
              <span className="status-warning">⚠ No data series selected</span>
            )}
          </div>
        </div>
        <ScoreChart tests={filtered} settings={chartSettings} />
      </div>

      {corrected.length > 0 && (
        <div className="recent-section">
          <h2 className="section-title">Recent Results</h2>
          <div className="recent-list">
            {[...corrected].reverse().slice(0, 5).map(t => (
              <div key={t.id} className="recent-item">
                <div className="recent-name">{t.name}</div>
                <div className="recent-date">{new Date(t.createdAt).toLocaleDateString()}</div>
                <div className="recent-scores">
                  {t.rawScore !== null && <span className="badge badge-raw">Raw: {t.rawScore}/{t.numQuestions}</span>}
                  {t.scaledScore && <span className="badge badge-scaled">Scaled: {t.scaledScore}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}