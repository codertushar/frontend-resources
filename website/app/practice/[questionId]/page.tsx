import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MachineCodingDetailClient } from './MachineCodingDetailClient';
import { getQuestions } from '../../../src/data/practice-questions/index';

// Generate static params for all practice questions
export async function generateStaticParams() {
  const questions = getQuestions();
  return questions.map((question) => ({
    questionId: question.id,
  }));
}

// Generate metadata for each question
export async function generateMetadata({
  params,
}: {
  params: { questionId: string };
}): Promise<Metadata> {
  const questions = getQuestions();
  const question = questions.find((q) => q.id === params.questionId);

  if (!question) {
    return {
      title: 'Question Not Found',
      description: 'The practice question you are looking for does not exist.',
    };
  }

  return {
    title: `${question.title} - Machine Coding Practice`,
    description: question.description,
    keywords: [...(question.tags || []), question.category, question.difficulty],
  };
}

export default function PracticeDetailPage({
  params,
}: {
  params: { questionId: string };
}) {
  const questions = getQuestions();
  const question = questions.find((q) => q.id === params.questionId);

  if (!question) {
    notFound();
  }

  return <MachineCodingDetailClient questionId={params.questionId} />;
}
