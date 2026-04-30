import { useState, useRef, useEffect } from 'react';
import type { Test } from '../types';
import './ViewDetails.css';

interface WrongMap {
  [q: number]: { wrong: boolean; correctAnswer: string };
}

interface ViewDetailsProps {
  test: Test;
  onSave: (data: Partial<Test>) => void;
  onClose: () => void;
}

export default function ViewDetails({ test, onSave, onClose }: ViewDetailsProps) {
  // Build initial wrong map from existing corrections
  const buildInitialWrong = (): WrongMap => {
    const map: WrongMap = {};
    if (test.corrections) {
      Object.entries(test.corrections).forEach(([key, val]) => {
        if (!val.correct) {
          map[parseInt(key)] = { wrong: true, correctAnswer: val.correctAnswer || '' };
        }
      });
    }
    return map;
  };

  const [wrongMap, setWrongMap] = useState<WrongMap>(buildInitialWrong);
  const [scaledScore, setScaledScore] = useState<string>(test.scaledScore?.toString() || '');
  const [maxScaledScore, setMaxScaledScore] = useState<string>(test.maxScaledScore?.toString() || '');
  const [showScaledForm, setShowScaledForm] = useState(false);
  // Track which question's answer field to autofocus
  const [focusedQ, setFocusedQ] = useState<number | null>(null);
  const inputRefs = useRef<{ [q: number]: HTMLInputElement | null }>({});

  // Autofocus the correct-answer input when a question is marked wrong
  useEffect(() => {
    if (focusedQ !== null && inputRefs.current[focusedQ]) {
      inputRefs.current[focusedQ]?.focus();
      inputRefs.current[focusedQ]?.select();
    }
  }, [focusedQ]);

  const toggleWrong = (q: number) => {
    setWrongMap(prev => {
      const next = { ...prev };
      if (next[q]?.wrong) {
        delete next[q];
        setFocusedQ(null);
      } else {
        next[q] = { wrong: true, correctAnswer: prev[q]?.correctAnswer || '' };
        setFocusedQ(q);
      }
      return next;
    });
  };

  const setCorrectAnswer = (q: number, val: string) => {
    setWrongMap(prev => ({
      ...prev,
      [q]: { ...prev[q], wrong: true, correctAnswer: val },
    }));
  };

  const computeRawScore = (): number => {
    const total = test.numQuestions;
    const wrongCount = Object.values(wrongMap).filter(v => v.wrong).length;
    return total - wrongCount;
  };

  const handleSave = () => {
    // Build new corrections object
    const newCorrections: Test['corrections'] = {};
    for (let q = 1; q <= test.numQuestions; q++) {
      const entry = wrongMap[q];
      if (entry?.wrong) {
        newCorrections[q.toString()] = { correct: false, correctAnswer: entry.correctAnswer };
      } else {
        newCorrections[q.toString()] = { correct: true, correctAnswer: '' };
      }
    }

    onSave({
      corrections: newCorrections,
      rawScore: computeRawScore(),
      scaledScore: scaledScore ? parseInt(scaledScore) : test.scaledScore,
      maxScaledScore: maxScaledScore ? parseInt(maxScaledScore) : test.maxScaledScore,
    });
    onClose();
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(test, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${test.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const questions = Array.from({ length: test.numQuestions }, (_, i) => i + 1);

  // Split into columns of 10
  const columns: number[][] = [];
  for (let i = 0; i < questions.length; i += 10) {
    columns.push(questions.slice(i, i + 10));
  }

  const wrongCount = Object.values(wrongMap).filter(v => v.wrong).length;
  const rawScore = test.numQuestions - wrongCount;

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
            <div className="score-val">{rawScore}/{test.numQuestions}</div>
            <div className="score-lbl">Raw Score</div>
          </div>
          {(test.scaledScore || scaledScore) && (
            <div className="score-item">
              <div className="score-val">
                {scaledScore || test.scaledScore}
                {(maxScaledScore || test.maxScaledScore) ? `/${maxScaledScore || test.maxScaledScore}` : ''}
              </div>
              <div className="score-lbl">Scaled Score</div>
            </div>
          )}
          <button className="btn btn-outline btn-sm" onClick={() => setShowScaledForm(!showScaledForm)}>
            {test.scaledScore ? 'Edit Scaled Score' : '+ Add Scaled Score'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleExport}>
            ⬇ Export Test
          </button>
        </div>

        {showScaledForm && (
          <div className="scaled-form">
            <input
              type="number"
              className="form-input sm"
              placeholder="Scaled Score (e.g. 720)"
              value={scaledScore}
              onChange={e => setScaledScore(e.target.value)}
            />
            <span>/</span>
            <input
              type="number"
              className="form-input sm"
              placeholder="Max (e.g. 800)"
              value={maxScaledScore}
              onChange={e => setMaxScaledScore(e.target.value)}
            />
          </div>
        )}

        <div className="details-hint">
          Check the ✗ box next to any question you got wrong, then type the correct answer.
        </div>

        {/* Questions grid — columns of 10 */}
        <div className="answers-grid-columns">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="answers-column">
              {col.map((q: number) => {
                const userAns = test.answers?.[q];
                const isWrong = wrongMap[q]?.wrong || false;
                const correctAnswer = wrongMap[q]?.correctAnswer || '';
                const isGuessed = test.guessed?.includes(q);
                const isStudy = test.requiresStudy?.includes(q);

                return (
                  <div
                    key={q}
                    className={`answer-row-new ${isWrong ? 'wrong' : ''}`}
                  >
                    <span className="answer-q-num">Q{q}</span>
                    <span className="answer-user-ans">{userAns || '—'}</span>

                    {/* Tags inline */}
                    <div className="answer-inline-tags">
                      {isGuessed && <span className="mini-tag guessed" title="Guessed">G</span>}
                      {isStudy && <span className="mini-tag study" title="Requires Study">S</span>}
                    </div>

                    {/* Wrong checkbox */}
                    <label className="wrong-checkbox-label" title="Mark as wrong">
                      <input
                        type="checkbox"
                        className="wrong-cb-hidden"
                        checked={isWrong}
                        onChange={() => toggleWrong(q)}
                      />
                      <span className={`wrong-cb-box ${isWrong ? 'checked' : ''}`}>
                        {isWrong && <span className="wrong-x">✗</span>}
                      </span>
                    </label>

                    {/* Correct answer input — appears when marked wrong */}
                    {isWrong && (
                      <input
                        ref={el => { inputRefs.current[q] = el; }}
                        type="text"
                        className="correct-ans-input"
                        placeholder="Correct ans…"
                        value={correctAnswer}
                        onChange={e => setCorrectAnswer(q, e.target.value)}
                        maxLength={10}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}