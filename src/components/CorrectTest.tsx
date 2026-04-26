import { useState } from 'react';
import type { Test, Corrections } from '../types';
import './CorrectTest.css';

const GEMMA_API_KEY = 'AIzaSyBab22ZcBxl0CPVAi5eFYXjupKRSfKdKOY';
const GEMMA_MODEL = 'gemma-3-27b-it';

interface CorrectionResult {
  corrections: Corrections;
  rawScore: number;
  totalQuestions: number;
}

async function correctWithAI(userAnswers: { [key: number]: string | null }, answerKey: string, numQuestions: number): Promise<CorrectionResult> {
  const prompt = `You are grading an SAT/MCQ practice test. The student's answers and the answer key are provided below. Compare them and return a JSON object.

Number of questions: ${numQuestions}
Answer Key (user entered): ${answerKey}
Student Answers: ${JSON.stringify(userAnswers)}

Parse the answer key text. The key may be in formats like "1.A 2.B 3.C" or "A B C D" or "1:A, 2:B" or just "ABCDE..." etc. Be flexible.

Return ONLY a valid JSON object with no markdown, no preamble, structured as:
{
  "corrections": {
    "1": { "correct": true, "correctAnswer": "A" },
    "2": { "correct": false, "correctAnswer": "C" },
    ...
  },
  "rawScore": 42,
  "totalQuestions": ${numQuestions}
}

Where for each question number (as string key), "correct" is a boolean, and "correctAnswer" is the correct answer letter. Include ALL questions 1 through ${numQuestions}. If a question was skipped (no student answer), mark it as incorrect.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMMA_MODEL}:generateContent?key=${GEMMA_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 4000 }
    })
  });

  if (response.status === 429) throw new Error('RATE_LIMIT');
  if (!response.ok) throw new Error(`API_ERROR_${response.status}`);

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

interface CorrectTestProps {
  test: Test;
  onSave: (data: { corrections: Corrections; rawScore: number }) => void;
  onClose: () => void;
}

export default function CorrectTest({ test, onSave, onClose }: CorrectTestProps) {
  const [answerKey, setAnswerKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CorrectionResult | null>(null);

  const handleSubmit = async () => {
    if (!answerKey.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await correctWithAI(test.answers, answerKey, test.numQuestions);
      setResult(res);
    } catch (e) {
      const error = e as Error;
      if (error.message === 'RATE_LIMIT') {
        setError('You are being rate limited by the AI service. Please wait a few minutes and try again.');
      } else {
        setError('An error occurred while correcting the test. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSave({
      corrections: result.corrections,
      rawScore: result.rawScore,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal correct-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>AI Test Correction</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ai-notice">
          <div className="ai-notice-icon">🤖</div>
          <div>
            <strong>AI-Powered Correction</strong>
            <p>This correction is performed by an AI model and <em>may contain mistakes</em>. It is being continuously improved to minimize errors. After correction, you can manually review and fix any mistakes in the "View Details" page.</p>
          </div>
        </div>

        {!result ? (
          <>
            <div className="form-group">
              <label className="form-label">Answer Key</label>
              <p className="form-hint">Enter the answer key in any format, e.g.: "1.A 2.B 3.C" or "A B C D E..." or "1:A, 2:C, 3:B"</p>
              <textarea
                className="answer-key-input"
                value={answerKey}
                onChange={e => setAnswerKey(e.target.value)}
                placeholder="Paste or type the answer key here..."
                rows={8}
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !answerKey.trim()}>
                {loading ? <><span className="spinner" /> Correcting...</> : '🤖 Correct with AI'}
              </button>
            </div>
          </>
        ) : (
          <div className="result-preview">
            <div className="result-score">
              <div className="big-score">{result.rawScore} / {result.totalQuestions}</div>
              <div className="big-score-label">Raw Score</div>
              <div className="pct-score">{Math.round((result.rawScore / result.totalQuestions) * 100)}%</div>
            </div>
            <div className="result-breakdown">
              <div className="breakdown-correct">✓ {result.rawScore} Correct</div>
              <div className="breakdown-wrong">✗ {result.totalQuestions - result.rawScore} Wrong</div>
            </div>
            <div className="result-actions">
              <button className="btn btn-ghost" onClick={() => setResult(null)}>← Re-enter Key</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Correction</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
