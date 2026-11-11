import React from 'react';
import { db } from '@/lib/db';
import ArticleEditor from '@/components/Admin/ArticleEditor';

export const revalidate = 0;

export default function NewArticlePage() {
  const categories = db.getCategories();
  const authors = db.getAuthors();

  return (
    <ArticleEditor
      categories={categories}
      authors={authors}
      isEditing={false}
    />
  );
}
