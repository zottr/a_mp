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
