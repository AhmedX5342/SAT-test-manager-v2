import { useState, useEffect, useRef, useCallback } from 'react';
import type { Test } from '../types';
import './TakeTest.css';

const CHOICES = ['A', 'B', 'C', 'D', 'E'];
const KEY_MAP: { [key: string]: string } = { a: 'A', b: 'B', c: 'C', d: 'D', e: 'E', '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };

interface TakeTestProps {
  test: Test;
  onSave: (data: { answers: { [key: number]: string | null }; guessed: number[]; requiresStudy: number[] }) => void;
  onCancel: () => void;
}

export default function TakeTest({ test, onSave, onCancel }: TakeTestProps) {
  const total = test.numQuestions;
  const [answers, setAnswers] = useState<{ [key: number]: string | null }>({});
  const [guessed, setGuessed] = useState<number[]>([]);
  const [requiresStudy, setRequiresStudy] = useState<number[]>([]);
  const [current, setCurrent] = useState(1);
  const [timeLeft, setTimeLeft] = useState<number | null>(test.timerEnabled ? test.timerMinutes * 60 : null);
  const [timesUp, setTimesUp] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedRef = useRef(false);

  const answered = Object.keys(answers).filter((k: string) => answers[parseInt(k)] !== null && answers[parseInt(k)] !== undefined).length;

  const saveTest = useCallback(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    onSave({ answers, guessed, requiresStudy });
  }, [answers, guessed, requiresStudy, onSave]);

  useEffect(() => {
    if (!test.timerEnabled) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev: number | null) => {
        if (prev !== null && prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimesUp(true);
          return 0;
        }
        return prev !== null ? prev - 1 : prev;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [test.timerEnabled]);

  useEffect(() => {
    if (timesUp) saveTest();
  }, [timesUp, saveTest]);

  const setAnswer = useCallback((q: number, choice: string | null) => {
    setAnswers(prev => ({ ...prev, [q]: choice }));
    if (choice !== null) {
      setCurrent(prev => prev < total ? prev + 1 : prev);
    }
  }, [total]);

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as KeyboardEvent;
      const target = evt.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      const key = evt.key.toLowerCase();
      const mappedKey = KEY_MAP[key];
      if (mappedKey) {
        const choice = mappedKey;
        setAnswer(current, choice);
      }
      if (evt.key === 'ArrowRight' || evt.key === 'Tab') {
        evt.preventDefault();
        setCurrent(prev => Math.min(prev + 1, total));
      }
      if (evt.key === 'ArrowLeft') {
        setCurrent(prev => Math.max(prev - 1, 1));
      }
      if (evt.key === 'Backspace' || evt.key === 'Delete') {
        setAnswers(prev => ({ ...prev, [current]: null }));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, setAnswer, total]);

  const toggleGuessed = () => {
    setGuessed(prev => prev.includes(current) ? prev.filter(q => q !== current) : [...prev, current]);
  };
  const toggleRequiresStudy = () => {
    setRequiresStudy(prev => prev.includes(current) ? prev.filter(q => q !== current) : [...prev, current]);
  };

  const formatTime = (s: number | null): string => {
    if (s === null) return '0:00';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const gridRows = [];
  for (let i = 1; i <= total; i += 8) {
    gridRows.push([...Array(Math.min(8, total - i + 1))].map((_, j) => i + j));
  }

  const currentAnswer = answers[current];

  if (timesUp) {
    return (
      <div className="timesup-overlay">
        <div className="timesup-modal">
          <div className="timesup-icon">⏰</div>
          <h2>Time's Up!</h2>
          <p>Your test has been saved automatically.</p>
          <button className="btn btn-primary" onClick={onCancel}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="take-test">
      {/* Header */}
      <div className="tt-header">
        <div className="tt-info">
          <span className="tt-name">{test.name}</span>
          <span className="tt-progress-text">Answered: {answered}/{total}</span>
        </div>
        <div className="tt-header-right">
          {test.timerEnabled && (
            <div className={`tt-timer ${(timeLeft ?? 60) < 60 ? 'urgent' : ''}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
          <button className="btn btn-outline btn-sm" onClick={onCancel}>✕ Close</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="tt-progress-bar">
        <div className="tt-progress-fill" style={{ width: `${(answered / total) * 100}%` }} />
      </div>

      <div className="tt-body">
        {/* Question Grid */}
        <div className="tt-grid-section">
          <div className="tt-grid-label">Jump to Question</div>
          <div className="tt-grid">
            {[...Array(total)].map((_, i) => {
              const q = i + 1;
              const ans = answers[q];
              const isGuessed = guessed.includes(q);
              const isStudy = requiresStudy.includes(q);
              return (
                <button
                  key={q}
                  className={`tt-grid-btn ${current === q ? 'active' : ''} ${ans ? 'answered' : ''} ${isGuessed ? 'guessed' : ''} ${isStudy ? 'study' : ''}`}
                  onClick={() => setCurrent(q)}
                  title={ans ? `Q${q}: ${ans}` : `Q${q}: Unanswered`}
                >
                  {q}
                </button>
              );
            })}
          </div>
        </div>

        {/* Answer Area */}
        <div className="tt-answer-section">
          <div className="tt-question-label">Question {current}</div>
          <div className="tt-choices">
            {CHOICES.map(c => (
              <button
                key={c}
                className={`tt-choice ${currentAnswer === c ? 'selected' : ''}`}
                onClick={() => setAnswer(current, c)}
              >
                {c}
              </button>
            ))}
            <button
              className={`tt-choice blank ${currentAnswer === null || currentAnswer === undefined ? 'selected' : ''}`}
              onClick={() => setAnswers(prev => ({ ...prev, [current]: null }))}
            >
              —
            </button>
          </div>

          <div className="tt-selected">
            Selected: <strong>{currentAnswer || '—'}</strong>
          </div>

          <div className="tt-tags">
            <button
              className={`tag-btn ${guessed.includes(current) ? 'active-guessed' : ''}`}
              onClick={toggleGuessed}
            >
              🎲 Guessed
            </button>
            <button
              className={`tag-btn ${requiresStudy.includes(current) ? 'active-study' : ''}`}
              onClick={toggleRequiresStudy}
            >
              📚 Requires Study
            </button>
          </div>

          <div className="tt-nav">
            <button className="btn btn-outline" onClick={() => setCurrent(p => Math.max(p - 1, 1))} disabled={current === 1}>← Prev</button>
            <button className="btn btn-outline" onClick={() => setCurrent(p => Math.min(p + 1, total))} disabled={current === total}>Next →</button>
          </div>

          <button className="btn btn-primary btn-save-test" onClick={saveTest}>
            💾 Save Test
          </button>
        </div>
      </div>

      <div className="tt-keyboard-hint">
        Keyboard shortcuts: <kbd>A</kbd><kbd>B</kbd><kbd>C</kbd><kbd>D</kbd><kbd>E</kbd> or <kbd>1</kbd>–<kbd>5</kbd> to answer · <kbd>←</kbd><kbd>→</kbd> to navigate · <kbd>Del</kbd> to clear
      </div>
    </div>
  );
}
