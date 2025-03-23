function isLocalStorageAvailable() {
  try {
    // Try to access localStorage
    const testKey = '__test_local_storage_availability__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true; // localStorage is available
  } catch (error) {
    return false; // localStorage is not available
  }
}

export { isLocalStorageAvailable };
