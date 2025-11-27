import { useCallback, useEffect, useMemo, useState } from 'react';

import './App.css';

const QUIZ_DURATION_SECONDS = 10 * 60;

const formatTime = (value) => {
  const minutes = String(Math.floor(value / 60)).padStart(2, '0');
  const seconds = String(value % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [result, setResult] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    []
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/questions`);
        if (!response.ok) {
          throw new Error('Unable to fetch quiz questions.');
        }
        const data = await response.json();
        setQuestions(data);
        setCurrentIndex(0);
        setStatus('ready');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    fetchQuestions();
  }, [apiBaseUrl]);

  const handleSubmit = useCallback(
    (autoSubmitted = false) => {
      if (!questions.length || result) {
        return;
      }

      const detailedResults = questions.map((question) => {
        const chosenIndex =
          answers[question._id] !== undefined ? answers[question._id] : null;
        const isCorrect = chosenIndex === question.correctIndex;

        return {
          id: question._id,
          prompt: question.prompt,
          userAnswer:
            chosenIndex !== null ? question.options[chosenIndex] : null,
          correctAnswer: question.options[question.correctIndex],
          isCorrect,
          explanation: question.explanation,
        };
      });

      const correct = detailedResults.filter((item) => item.isCorrect).length;

      setResult({
        total: questions.length,
        correct,
        autoSubmitted,
        details: detailedResults,
      });
    },
    [answers, questions, result]
  );

  useEffect(() => {
    if (status !== 'ready' || result) {
      return undefined;
    }

    if (timeLeft <= 0) {
      handleSubmit(true);
      return undefined;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [status, result, timeLeft, handleSubmit]);

  const goToQuestion = useCallback(
    (index) => {
      if (!questions.length) return;
      const normalized = (index + questions.length) % questions.length;
      setCurrentIndex(normalized);
    },
    [questions.length]
  );

  const goToNext = useCallback(() => {
    goToQuestion(currentIndex + 1);
  }, [currentIndex, goToQuestion]);

  const goToPrevious = useCallback(() => {
    goToQuestion(currentIndex - 1);
  }, [currentIndex, goToQuestion]);

  const handleOptionChange = (questionId, optionIndex) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const skipQuestion = () => {
    if (result) return;
    goToNext();
  };

  const answeredCount = Object.keys(answers).length;
  const timeDisplay = formatTime(Math.max(timeLeft, 0));

  if (status === 'loading') {
    return (
      <main className="app">
        <p className="status-message">Loading questions...</p>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="app">
        <p className="status-message error">
          Something went wrong while loading questions. Please verify that the
          backend is running and try again.
        </p>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  const resultMap = result
    ? result.details.reduce((acc, detail) => {
        acc[detail.id] = detail;
        return acc;
      }, {})
    : {};

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Multiple Choice Quiz</h1>
        </div>
        <div className="timer-card">
          <p>Time Remaining</p>
          <strong className={timeLeft <= 30 ? 'danger' : ''}>
            {timeDisplay}
          </strong>
        </div>
      </header>

      <section className="quiz-meta">
        <p>Answer all questions within the time limit. Each question has a single correct answer.</p>
        <p>
          Progress: {answeredCount}/{questions.length} answered
        </p>
      </section>

      <section className="question-nav">
        {questions.map((question, index) => {
          const answered = answers[question._id] !== undefined;
          const detail = result ? resultMap[question._id] : null;
          return (
            <button
              key={question._id}
              type="button"
              className={`nav-item ${
                currentIndex === index ? 'current' : ''
              } ${answered ? 'answered' : 'unanswered'} ${
                detail ? (detail.isCorrect ? 'correct' : 'incorrect') : ''
              }`}
              onClick={() => goToQuestion(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </section>

      {currentQuestion && (
        <article
          className={`question-card ${
            resultMap[currentQuestion._id]
              ? resultMap[currentQuestion._id].isCorrect
                ? 'correct'
                : 'incorrect'
              : ''
          }`}
        >
          <h2>
            Question {currentIndex + 1}
            <span className="question-prompt">{currentQuestion.prompt}</span>
          </h2>
          <div className="options">
            {currentQuestion.options.map((option, optionIndex) => {
              const selectedIndex =
                answers[currentQuestion._id] !== undefined
                  ? answers[currentQuestion._id]
                  : null;

              return (
                <label
                  key={`${currentQuestion._id}-${optionIndex}`}
                  className={`option ${
                    selectedIndex === optionIndex ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={optionIndex}
                    checked={selectedIndex === optionIndex}
                    disabled={Boolean(result)}
                    onChange={() =>
                      handleOptionChange(currentQuestion._id, optionIndex)
                    }
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>

          {resultMap[currentQuestion._id] && (
            <div className="review-panel">
              <p>
                <strong>Status:</strong>{' '}
                {resultMap[currentQuestion._id].isCorrect
                  ? 'Correct 🎉'
                  : 'Wrong ❌'}
              </p>
              <p>
                <strong>Your answer:</strong>{' '}
                {resultMap[currentQuestion._id].userAnswer ?? 'Not answered'}
              </p>
              <p>
                <strong>Correct answer:</strong>{' '}
                {resultMap[currentQuestion._id].correctAnswer}
              </p>
              {!resultMap[currentQuestion._id].isCorrect && (
                <p className="explanation">
                  <strong>Explanation:</strong>{' '}
                  {resultMap[currentQuestion._id].explanation}
                </p>
              )}
            </div>
          )}
        </article>
      )}

      <div className="question-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        {currentIndex < questions.length - 1 && (
          <button
            type="button"
            className="secondary-btn"
            onClick={skipQuestion}
            disabled={result}
          >
            Skip
          </button>
        )}

        {!result && currentIndex < questions.length - 1 && (
          <button
            type="button"
            className="secondary-btn"
            onClick={goToNext}
          >
            Next
          </button>
        )}

        {!result && currentIndex === questions.length - 1 && (
          <button
            className="primary-btn"
            type="button"
            onClick={() => handleSubmit(false)}
          >
            Submit Quiz
          </button>
        )}

        {result && (
          <button
            className="secondary-btn"
            type="button"
            onClick={() => goToQuestion(0)}
          >
            Review Again
          </button>
        )}
      </div>

      {result && (
        <section className="result-panel">
          <h2>Quiz Results</h2>
          <p className="score">
            Score: {result.correct} / {result.total}
          </p>
          {result.autoSubmitted && (
            <p className="auto-flag">
              Submitted automatically when the timer expired.
            </p>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
