// categories.js - Handles subject categories and tags

// Predefined category colors
const CATEGORY_COLORS = [
  '#4f46e5', // Indigo
  '#10b981', // Emerald
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1'  // Indigo (lighter)
];

// Get all categories for current user
async function getUserCategories() {
  const user = auth.currentUser;
  if (!user) return [];
  
  try {
    const doc = await db.collection('users').doc(user.uid).get();
    if (doc.exists && doc.data().categories) {
      return doc.data().categories;
    }
    return [];
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
}

// Add a new category
async function addCategory(name) {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    // Get existing categories
    const categories = await getUserCategories();
    
    // Check if category already exists
    if (categories.some(cat => cat.name === name)) {
      showAlert("Category already exists", "error");
      return null;
    }
    
    // Create new category
    const newCategory = {
      id: Date.now().toString(),
      name: name.trim(),
      color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Add to user's categories
    await db.collection('users').doc(user.uid).update({
      categories: firebase.firestore.FieldValue.arrayUnion(newCategory)
    });
    
    return newCategory;
  } catch (error) {
    console.error("Error adding category:", error);
    return null;
  }
}

// Delete a category
async function deleteCategory(categoryId) {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    // Get existing categories
    const categories = await getUserCategories();
    
    // Find category to delete
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return false;
    
    // Remove from array
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    
    // Update user document
    await db.collection('users').doc(user.uid).update({
      categories: updatedCategories
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
}

// Assign category to a study log
async function assignCategory(logId, categoryId) {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    // Update the log with category ID
    await db.collection('users').doc(user.uid)
      .collection('studyLogs').doc(logId)
      .update({ categoryId });
    
    return true;
  } catch (error) {
    console.error("Error assigning category:", error);
    return false;
  }
}

// Initialize categories UI
function initCategoriesUI() {
  // Populate category selector
  populateCategorySelector();
  
  // Set up add category form
  const addCategoryForm = document.getElementById('add-category-form');
  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const categoryName = document.getElementById('category-name').value.trim();
      
      if (categoryName) {
        const newCategory = await addCategory(categoryName);
        if (newCategory) {
          showAlert(`Category "${categoryName}" added`, "success");
          document.getElementById('category-name').value = '';
          populateCategorySelector();
        }
      }
    });
  }
}

// Populate category selector dropdown
async function populateCategorySelector() {
  const categorySelect = document.getElementById('category-select');
  if (!categorySelect) return;
  
  try {
    const categories = await getUserCategories();
    
    // Add options to dropdown
    let options = '<option value="">No Category</option>';
    categories.forEach(category => {
      options += `<option value="${category.id}" data-color="${category.color}">${category.name}</option>`;
    });
    
    categorySelect.innerHTML = options;
  } catch (error) {
    console.error("Error populating category selector:", error);
  }
}