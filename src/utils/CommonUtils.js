import imageCompression from 'browser-image-compression';

export const isLocalStorageAvailable = () => {
  try {
    // Try to access localStorage
    const testKey = '__test_local_storage_availability__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true; // localStorage is available
  } catch (error) {
    return false; // localStorage is not available
  }
};

// utils.js
export const openWhatsAppChat = (phoneNumber, message) => {
  let encodedMessage = '';
  if (message) {
    encodedMessage = encodeURIComponent(message);
  }
  const whatsappUrl = `https://wa.me/+91${phoneNumber}?text=${encodedMessage}`;
  window.location.href = whatsappUrl;
};

export const initiateAudioCall = (phoneNumber) => {
  const audioCallUrl = `tel:+91${phoneNumber}`;
  window.location.href = audioCallUrl;
};

export const getDateTimeString = (order) => {
  const dbDate = order?.updatedAt;
  if (dbDate) {
    const dateObj = new Date(dbDate);
    const localeOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const [day, month, year] = dateObj
      .toLocaleDateString('en-IN', localeOptions)
      .split('/');

    // Format as YYYY-MM-DD
    const formattedDate = `${day}/${month}/${year}`;
    const time = dateObj.toLocaleTimeString();
    return formattedDate + ' @ ' + time;
  } else return '';
};

export const stripHtml = (html) => {
  return html?.replace(/<[^>]*>?/gm, '');
};

export const compressImage = async (file) => {
  const sizeInMB = file.size / 1024 / 1024;

  // Skip compression if image is already 1MB or smaller
  if (sizeInMB <= 1) {
    return file;
  }

  const options = {
    maxSizeMB: 0.7, // Lower target size for faster loading
    maxWidthOrHeight: 1080, // Ideal for mobile screens
    initialQuality: 0.85, // Good balance of quality vs size
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.warn('Compression failed, using original image:', error);
    return file; // Fallback to original image if compression fails
  }
};
