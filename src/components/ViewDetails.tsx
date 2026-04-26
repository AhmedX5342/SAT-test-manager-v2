import { useState } from 'react';
import type { Test, Overrides } from '../types';
import './ViewDetails.css';

interface ViewDetailsProps {
  test: Test;
  onSave: (data: Partial<Test>) => void;
  onClose: () => void;
}

export default function ViewDetails({ test, onSave, onClose }: ViewDetailsProps) {
  const [overrides, setOverrides] = useState<Overrides>({});  // manual wrong answers
  const [manualMode, setManualMode] = useState(false);
  const [scaledScore, setScaledScore] = useState<string | number>(test.scaledScore || '');
  const [maxScaledScore, setMaxScaledScore] = useState<string | number>(test.maxScaledScore || '');
  const [showScaledForm, setShowScaledForm] = useState(false);

  const toggleManualWrong = (q: number) => {
    setOverrides(prev => {
      const next = { ...prev };
      if (next[q] !== undefined) {
        delete next[q];
      } else {
        next[q] = { wrong: true, note: '' };
      }
      return next;
    });
  };

  const setNote = (q: number, note: string) => {
    setOverrides(prev => ({ ...prev, [q]: { ...prev[q], note } }));
  };

  const computeRawScore = () => {
    if (!test.corrections && Object.keys(overrides).length === 0) return test.rawScore;
    // Start from AI corrections, then apply manual overrides
    let score = test.rawScore !== null ? test.rawScore : 0;
    // Each override marks a question as wrong
    // We need to rebuild: start from corrections
    if (test.corrections) {
      const correctionMap = { ...test.corrections };
      // Apply overrides
      Object.keys(overrides).forEach(qKey => {
        const q = qKey as unknown as number;
        const wasCorrect = correctionMap[q]?.correct;
        if (overrides[q].wrong && wasCorrect) score--;
        if (!overrides[q].wrong && !wasCorrect) score++;
      });
    }
    return score;
  };

  const handleSave = () => {
    const newRaw = computeRawScore();
    onSave({
      rawScore: newRaw,
      scaledScore: scaledScore ? parseInt(scaledScore as string) : test.scaledScore,
      maxScaledScore: maxScaledScore ? parseInt(maxScaledScore as string) : test.maxScaledScore,
    });
    onClose();
  };

  const questions = [...Array(test.numQuestions)].map((_, i) => i + 1);
  const correctionData = test.corrections || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{test.name}</h2>
            <div className="details-meta">
              {new Date(test.createdAt).toLocaleDateString()} · {test.numQuestions} Questions
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Score Summary */}
        <div className="details-scores">
          <div className="score-item">
            <div className="score-val">{test.rawScore !== null ? `${test.rawScore}/${test.numQuestions}` : 'Uncorrected'}</div>
            <div className="score-lbl">Raw Score</div>
          </div>
          {test.scaledScore && (
            <div className="score-item">
              <div className="score-val">{test.scaledScore}{test.maxScaledScore ? `/${test.maxScaledScore}` : ''}</div>
              <div className="score-lbl">Scaled Score</div>
            </div>
          )}
          <button className="btn btn-outline btn-sm" onClick={() => setShowScaledForm(!showScaledForm)}>
            {test.scaledScore ? 'Edit Scaled Score' : '+ Add Scaled Score'}
          </button>
        </div>

        {showScaledForm && (
          <div className="scaled-form">
            <input type="number" className="form-input sm" placeholder="Scaled Score (e.g. 720)" value={scaledScore} onChange={e => setScaledScore(e.target.value)} />
            <span>/</span>
            <input type="number" className="form-input sm" placeholder="Max (e.g. 800)" value={maxScaledScore} onChange={e => setMaxScaledScore(e.target.value)} />
          </div>
        )}

        {/* Manual correction toggle */}
        {test.corrections && (
          <div className="manual-toggle">
            <button className={`btn ${manualMode ? 'btn-warning' : 'btn-outline'} btn-sm`} onClick={() => setManualMode(!manualMode)}>
              ✏️ {manualMode ? 'Exit Manual Correction' : 'Correct Manually'}
            </button>
            {manualMode && <span className="manual-hint">Check boxes to mark answers as wrong. A text field will appear for notes.</span>}
          </div>
        )}

        {/* Tag summary */}
        {(test.guessed?.length > 0 || test.requiresStudy?.length > 0) && (
          <div className="tag-summary">
            {test.guessed?.length > 0 && (
              <div className="tag-group">
                <span className="tag-label">🎲 Guessed:</span>
                {test.guessed.map(q => <span key={q} className="q-badge guessed">Q{q}</span>)}
              </div>
            )}
            {test.requiresStudy?.length > 0 && (
              <div className="tag-group">
                <span className="tag-label">📚 Requires Study:</span>
                {test.requiresStudy.map(q => <span key={q} className="q-badge study">Q{q}</span>)}
              </div>
            )}
          </div>
        )}

        {/* Answers table */}
        <div className="answers-grid">
          {questions.map((q: number) => {
            const userAns = test.answers[q];
            const correction = correctionData[q.toString()];
            const isGuessed = test.guessed?.includes(q);
            const isStudy = test.requiresStudy?.includes(q);
            const isOverridden = overrides[q] !== undefined;
            let status = 'unanswered';
            if (correction) status = correction.correct ? 'correct' : 'wrong';
            if (isOverridden) status = overrides[q].wrong ? 'wrong' : 'correct';

            return (
              <div key={q} className={`answer-row ${status} ${manualMode ? 'manual-mode' : ''}`}>
                <div className="answer-q">Q{q}</div>
                <div className="answer-user">{userAns || '—'}</div>
                {correction && (
                  <div className="answer-correct">
                    {status === 'correct' ? <span className="tick">✓</span> : <span className="cross">✗</span>}
                    {status === 'wrong' && <span className="correct-ans">{correction.correctAnswer}</span>}
                  </div>
                )}
                {(isGuessed || isStudy) && (
                  <div className="answer-tags">
                    {isGuessed && <span className="mini-tag guessed">G</span>}
                    {isStudy && <span className="mini-tag study">S</span>}
                  </div>
                )}
                {manualMode && correction && (
                  <div className="manual-override">
                    <input
                      type="checkbox"
                      className="override-cb"
                      checked={isOverridden && overrides[q].wrong}
                      onChange={() => toggleManualWrong(q)}
                      id={`override-${q}`}
                    />
                    <label htmlFor={`override-${q}`} className="override-x">✗</label>
                    {isOverridden && (
                      <input
                        autoFocus
                        type="text"
                        className="override-note"
                        placeholder="Note (e.g. correct answer)"
                        value={overrides[q].note || ''}
                        onChange={e => setNote(q, e.target.value)}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
