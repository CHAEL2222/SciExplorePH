export interface Lesson {
  id: string;
  title: string;
  subject: 'Science' | 'Math';
  gradeLevel: number;
  description: string;
  content: string;
  progress: number;
  icon: string;
  minutes: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
