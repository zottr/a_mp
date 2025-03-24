import React, { createContext, useContext, useState, useEffect } from 'react';

const InstallPromptContext = createContext();

export const InstallPromptProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent Chrome's mini-infobar
      setDeferredPrompt(e); // Save the event for triggering later
      console.log('beforeinstallprompt fired');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled
    const handleAppInstalled = () => {
      console.log('App installed successfully');
      setIsInstalled(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return (
    <InstallPromptContext.Provider
      value={{ deferredPrompt, setDeferredPrompt, isInstalled }}
    >
      {children}
    </InstallPromptContext.Provider>
  );
};

export const useInstallPrompt = () => {
  return useContext(InstallPromptContext);
};
