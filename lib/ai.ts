import { generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';

const model = google('gemini-1.5-pro-latest');

export interface AIResponse {
  text: string;
  hasCode?: boolean;
  hasFormula?: boolean;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Generate AI answer for a student's question
 */
export async function generateAnswer(
  question: string,
  mode: 'quick' | 'detailed' = 'detailed'
): Promise<AIResponse> {
  const systemPrompt = mode === 'quick' 
    ? `You are a helpful AI tutor. Provide a concise, accurate answer to the student's question. 
       Keep it brief but clear. Use simple language.`
    : `You are an expert AI tutor. Provide a comprehensive, step-by-step explanation to the student's question.
       Include examples, analogies, and visual descriptions when helpful.
       Break down complex concepts into digestible parts.
       Use LaTeX notation for mathematical formulas (wrap in $ for inline, $$ for block).
       Format code with proper syntax highlighting using markdown code blocks.`;

  try {
    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: question,
      temperature: 0.7,
      maxOutputTokens: mode === 'quick' ? 500 : 2000,
    });

    return {
      text,
      hasCode: text.includes('```'),
      hasFormula: text.includes('$'),
      subject: detectSubject(question),
      difficulty: detectDifficulty(question),
    };
  } catch (error) {
    console.error('AI Error:', error);
    throw new Error('Failed to generate answer');
  }
}

/**
 * Stream AI response for real-time display
 */
export async function streamAnswer(question: string, mode: 'quick' | 'detailed' = 'detailed') {
  const systemPrompt = mode === 'quick'
    ? `You are a helpful AI tutor. Provide a concise, accurate answer. Keep it brief but clear.`
    : `You are an expert AI tutor. Provide a comprehensive, step-by-step explanation.
       Include examples and break down complex concepts.
       Use LaTeX notation for formulas (wrap in $ for inline, $$ for block).
       Format code with markdown code blocks.`;

  return streamText({
    model,
    system: systemPrompt,
    prompt: question,
    temperature: 0.7,
    maxOutputTokens: mode === 'quick' ? 500 : 2000,
  });
}

/**
 * Generate flashcards from a topic or text
 */
export async function generateFlashcards(
  topic: string,
  count: number = 5
): Promise<Array<{ front: string; back: string }>> {
  const prompt = `Generate exactly ${count} high-quality flashcards for studying "${topic}".
  Format each flashcard as:
  Q: [Question/Term]
  A: [Answer/Definition]
  
  Make them clear, concise, and educational. Cover key concepts.`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.8,
      maxOutputTokens: 1000,
    });

    // Parse flashcards from response
    const flashcards: Array<{ front: string; back: string }> = [];
    const lines = text.split('\n');
    let currentQ = '';

    for (const line of lines) {
      if (line.startsWith('Q:')) {
        currentQ = line.substring(2).trim();
      } else if (line.startsWith('A:') && currentQ) {
        flashcards.push({
          front: currentQ,
          back: line.substring(2).trim(),
        });
        currentQ = '';
      }
    }

    return flashcards;
  } catch (error) {
    console.error('Flashcard generation error:', error);
    throw new Error('Failed to generate flashcards');
  }
}

/**
 * Generate quiz questions (MCQs) from a topic
 */
export async function generateQuiz(
  topic: string,
  count: number = 5
): Promise<Array<{
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}>> {
  const prompt = `Generate exactly ${count} multiple-choice questions for "${topic}".
  Format each question as:
  
  Q: [Question text]
  A) [Option 1]
  B) [Option 2]
  C) [Option 3]
  D) [Option 4]
  Correct: [Letter]
  Explanation: [Why this is correct]
  
  Make questions educational and varied in difficulty.`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.8,
      maxOutputTokens: 1500,
    });

    // Parse quiz questions
    const questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }> = [];

    const blocks = text.split('\n\n');
    let currentQ = '';
    let currentOptions: string[] = [];
    let currentCorrect = 0;
    let currentExplanation = '';

    for (const block of blocks) {
      const lines = block.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('Q:')) {
          if (currentQ && currentOptions.length > 0) {
            questions.push({
              question: currentQ,
              options: currentOptions,
              correctAnswer: currentCorrect,
              explanation: currentExplanation,
            });
          }
          currentQ = line.substring(2).trim();
          currentOptions = [];
        } else if (line.match(/^[A-D]\)/)) {
          currentOptions.push(line.substring(3).trim());
        } else if (line.startsWith('Correct:')) {
          const letter = line.substring(8).trim().toUpperCase();
          currentCorrect = letter.charCodeAt(0) - 65;
        } else if (line.startsWith('Explanation:')) {
          currentExplanation = line.substring(12).trim();
        }
      }
    }

    // Add last question
    if (currentQ && currentOptions.length > 0) {
      questions.push({
        question: currentQ,
        options: currentOptions,
        correctAnswer: currentCorrect,
        explanation: currentExplanation,
      });
    }

    return questions.slice(0, count);
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error('Failed to generate quiz');
  }
}

/**
 * Summarize text or content into notes
 */
export async function generateSummary(content: string): Promise<string> {
  const prompt = `Summarize the following content into clear, concise study notes.
  Use bullet points, headings, and organize information logically.
  
  Content:
  ${content}`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.5,
      maxOutputTokens: 1000,
    });

    return text;
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new Error('Failed to generate summary');
  }
}

/**
 * Generate a personalized study plan
 */
export async function generateStudyPlan(
  goals: string[],
  duration: number, // in days
  currentLevel: string
): Promise<{
  title: string;
  description: string;
  tasks: Array<{ title: string; dueDate: string }>;
}> {
  const prompt = `Create a ${duration}-day study plan for a ${currentLevel} level student with these goals:
  ${goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}
  
  Format:
  Title: [Plan title]
  Description: [Brief description]
  Tasks:
  - Day X: [Task]
  
  Make it realistic, progressive, and motivating.`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 1000,
    });

    // Parse the plan
    const lines = text.split('\n');
    let title = 'Custom Study Plan';
    let description = '';
    const tasks: Array<{ title: string; dueDate: string }> = [];

    for (const line of lines) {
      if (line.startsWith('Title:')) {
        title = line.substring(6).trim();
      } else if (line.startsWith('Description:')) {
        description = line.substring(12).trim();
      } else if (line.match(/^- Day \d+:/)) {
        const match = line.match(/^- Day (\d+): (.+)$/);
        if (match) {
          const dayNum = parseInt(match[1]);
          const taskTitle = match[2];
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + dayNum);
          
          tasks.push({
            title: taskTitle,
            dueDate: dueDate.toISOString(),
          });
        }
      }
    }

    return { title, description, tasks };
  } catch (error) {
    console.error('Study plan generation error:', error);
    throw new Error('Failed to generate study plan');
  }
}

/**
 * Get AI study recommendations based on progress
 */
export async function getStudyRecommendations(
  weakTopics: string[],
  recentActivity: string[]
): Promise<string[]> {
  const prompt = `As an AI tutor, suggest 3-5 specific study recommendations for a student with:
  
  Weak topics: ${weakTopics.join(', ')}
  Recent activity: ${recentActivity.join(', ')}
  
  Provide actionable, specific recommendations. Format as a simple list.`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return text
      .split('\n')
      .filter(line => line.trim().length > 0 && (line.startsWith('-') || line.match(/^\d+\./)))
      .map(line => line.replace(/^[-\d.]\s*/, '').trim())
      .slice(0, 5);
  } catch (error) {
    console.error('Recommendations error:', error);
    return ['Review previous topics', 'Practice problem-solving', 'Create summary notes'];
  }
}

/**
 * Helper: Detect subject from question
 */
function detectSubject(question: string): string {
  const keywords = {
    math: ['equation', 'solve', 'calculate', 'derivative', 'integral', 'algebra', 'geometry', 'trigonometry'],
    science: ['atom', 'molecule', 'cell', 'energy', 'force', 'reaction', 'experiment', 'biology', 'chemistry', 'physics'],
    programming: ['code', 'function', 'algorithm', 'variable', 'loop', 'array', 'class', 'debug', 'syntax'],
    history: ['year', 'century', 'war', 'empire', 'revolution', 'ancient', 'medieval'],
    language: ['grammar', 'sentence', 'verb', 'noun', 'literature', 'essay', 'poem'],
  };

  const lowerQuestion = question.toLowerCase();
  
  for (const [subject, words] of Object.entries(keywords)) {
    if (words.some(word => lowerQuestion.includes(word))) {
      return subject;
    }
  }
  
  return 'general';
}

/**
 * Helper: Detect difficulty level
 */
function detectDifficulty(question: string): 'easy' | 'medium' | 'hard' {
  const hardKeywords = ['prove', 'derive', 'analyze', 'evaluate', 'complex', 'advanced'];
  const easyKeywords = ['what is', 'define', 'list', 'name', 'basic'];
  
  const lowerQuestion = question.toLowerCase();
  
  if (hardKeywords.some(word => lowerQuestion.includes(word))) {
    return 'hard';
  }
  
  if (easyKeywords.some(word => lowerQuestion.includes(word))) {
    return 'easy';
  }
  
  return 'medium';
}
