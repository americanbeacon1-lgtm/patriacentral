import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ArticleEditor from '@/components/Admin/ArticleEditor';

export const revalidate = 0;

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = db.getArticleBySlug(id);

  if (!article) {
    notFound();
  }

  const categories = db.getCategories();
  const authors = db.getAuthors();

  return (
    <ArticleEditor
      initialArticle={article}
      categories={categories}
      authors={authors}
      isEditing={true}
    />
  );
}
