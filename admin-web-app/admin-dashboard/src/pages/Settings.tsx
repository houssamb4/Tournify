import { useState, useEffect } from 'react';

interface SettingsState {
  notificationsEnabled: boolean;
  darkMode: boolean;
  autoLogout: number; // in minutes
  language: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notificationsEnabled: true,
    darkMode: false,
    autoLogout: 60,
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Simulating loading settings from localStorage (in a real app, these might come from API)
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    setLoading(true);
    setSaveSuccess(false);
    setSaveError('');

    // Simulate saving settings
    setTimeout(() => {
      try {
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        setSaveSuccess(true);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        setSaveError('Failed to save settings. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const handleChange = (field: keyof SettingsState, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      {saveSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow-md">
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            <p>Settings saved successfully!</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-md">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            <p>{saveError}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">General Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span>Enable Email Notifications</span>
              </label>
              <p className="text-gray-500 text-sm ml-7 mt-1">Receive email notifications about important events</p>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange('darkMode', e.target.checked)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span>Dark Mode</span>
              </label>
              <p className="text-gray-500 text-sm ml-7 mt-1">Use dark theme throughout the admin dashboard</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Security Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Auto Logout Timer (minutes)</label>
            <select
              value={settings.autoLogout}
              onChange={(e) => handleChange('autoLogout', parseInt(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={240}>4 hours</option>
            </select>
            <p className="text-gray-500 text-sm mt-1">Automatically log out after period of inactivity</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Language Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;