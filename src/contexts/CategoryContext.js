import React, {createContext, useContext} from 'react';
import {useCategories} from '../hooks/useCategories.js';

const CategoryContext = createContext(null);

export function CategoryProvider({children}) {
  const categoryData = useCategories();
  return (
    <CategoryContext.Provider value={categoryData}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within CategoryProvider');
  }
  return context;
}
