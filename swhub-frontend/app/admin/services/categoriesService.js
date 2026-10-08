const STORAGE_KEY = 'somnera-categories';

const initialCategories = [
  { id: 'cat-1', name: 'Innerspring', description: 'Traditional spring support', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Memory Foam', description: 'Contouring pressure relief', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Hybrid', description: 'Best of both worlds', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Latex', description: 'Natural and responsive', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Orthopedic', description: 'Firm back support', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Coir', description: 'Firm and eco-friendly', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

export const getCategories = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCategories));
    return initialCategories;
  }
  return JSON.parse(data);
};

export const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

export const addCategory = (categoryData) => {
  const categories = getCategories();
  
  if (categories.some(c => c.name.toLowerCase() === categoryData.name.toLowerCase())) {
    throw new Error('Category name already exists.');
  }

  const newCategory = {
    ...categoryData,
    id: `cat-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  saveCategories([...categories, newCategory]);
  return newCategory;
};

export const updateCategory = (id, updates) => {
  const categories = getCategories();
  
  if (updates.name) {
    if (categories.some(c => c.id !== id && c.name.toLowerCase() === updates.name.toLowerCase())) {
      throw new Error('Category name already exists.');
    }
  }

  const updatedCategories = categories.map(c => 
    c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
  
  saveCategories(updatedCategories);
};

export const deleteCategory = (id) => {
  const categories = getCategories();
  const updatedCategories = categories.filter(c => c.id !== id);
  saveCategories(updatedCategories);
};

export const getActiveCategories = () => {
  return getCategories().filter(c => c.status === 'ACTIVE');
};
