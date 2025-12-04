import { render, screen, fireEvent } from '@testing-library/react';
import QuizApp from '../components/QuizApp';
import { useQuizStore } from '../store'; // Import original store to mock

// Mock the Zustand store
jest.mock('../store', () => ({
  useQuizStore: jest.fn(),
}));

const mockUseQuizStore = useQuizStore as jest.Mock;

// Mock the Sidebar component
jest.mock('../Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-sidebar">Mock Sidebar</div>,
}));

describe('QuizApp', () => {
  let selectAnswer: jest.Mock;
  let nextQuestion: jest.Mock;
  let previousQuestion: jest.Mock;
  let resetQuiz: jest.Mock;

  const mockQuestions = [
    { question: 'What is 1+1?', options: ['1', '2', '3'], correctAnswer: 1 },
    { question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: 1 },
  ];

  beforeEach(() => {
    selectAnswer = jest.fn();
    nextQuestion = jest.fn();
    previousQuestion = jest.fn();
    resetQuiz = jest.fn();

    mockUseQuizStore.mockReturnValue({
      questions: mockQuestions,
      selectAnswer,
      answers: [],
      currentQuestion: 0,
      nextQuestion,
      previousQuestion,
      showScore: false,
      score: 0,
      resetQuiz,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the first question and options initially', () => {
    render(<QuizApp />);

    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('What is 1+1?')).toBeInTheDocument();
    expect(screen.getByLabelText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('2')).toBeInTheDocument();
    expect(screen.getByLabelText('3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('selects an answer', () => {
    render(<QuizApp />);
    fireEvent.click(screen.getByLabelText('2'));
    expect(selectAnswer).toHaveBeenCalledWith(1);
  });

  it('navigates to the next question', () => {
    render(<QuizApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(nextQuestion).toHaveBeenCalled();
  });

  it('navigates to the previous question', () => {
    mockUseQuizStore.mockReturnValueOnce({ // Mock state for second question
      ...mockUseQuizStore(),
      currentQuestion: 1,
    });
    render(<QuizApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(previousQuestion).toHaveBeenCalled();
  });

  it('shows "Finish" button on the last question', () => {
    mockUseQuizStore.mockReturnValueOnce({ // Mock state for last question
      ...mockUseQuizStore(),
      currentQuestion: mockQuestions.length - 1,
    });
    render(<QuizApp />);
    expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
  });

  it('shows score screen when showScore is true', () => {
    mockUseQuizStore.mockReturnValueOnce({
      ...mockUseQuizStore(),
      showScore: true,
      score: 1,
    });
    render(<QuizApp />);
    expect(screen.getByText('Quiz Completed 🎉')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      const normalizedContent = (element.textContent || '').replace(/\s+/g, ' ').trim();
      return normalizedContent === 'Your score: 1 / 2';
    })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restart Quiz' })).toBeInTheDocument();
  });

  it('restarts quiz on button click', () => {
    mockUseQuizStore.mockReturnValueOnce({
      ...mockUseQuizStore(),
      showScore: true,
    });
    render(<QuizApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Restart Quiz' }));
    expect(resetQuiz).toHaveBeenCalled();
  });
});
