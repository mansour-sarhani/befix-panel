/**
 * Settings Service
 * Handles all settings-related API calls for user profile, preferences, and account management
 */

import axiosInstance from '@/lib/axios';

/**
 * Get current user profile
 * Uses the existing /api/auth/check endpoint
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/check');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update user profile (name, phone, bio, avatar)
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.name - User name
 * @param {string} profileData.phone - Phone number
 * @param {string} profileData.bio - User bio
 * @param {File} profileData.avatar - Avatar file (optional)
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (profileData) => {
    try {
        // Check if avatar file is present
        const hasFile = profileData.avatar instanceof File;

        if (hasFile) {
            // Convert to FormData for file upload
            const formData = new FormData();
            formData.append('name', profileData.name);
            formData.append('phone', profileData.phone || '');
            formData.append('bio', profileData.bio || '');
            formData.append('avatar', profileData.avatar);

            const response = await axiosInstance.put('/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // Send as JSON if no file
            const { avatar, ...jsonData } = profileData;
            const response = await axiosInstance.put('/auth/profile', jsonData);
            return response.data;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} Success message
 */
export const changePassword = async (passwordData) => {
    try {
        const response = await axiosInstance.put('/auth/change-password', passwordData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update user preferences
 * @param {Object} preferences - User preferences
 * @param {boolean} preferences.emailNotifications - Email notifications toggle
 * @param {boolean} preferences.pushNotifications - Push notifications toggle
 * @param {string} preferences.notificationFrequency - Notification frequency (immediate, daily, weekly)
 * @param {string} preferences.theme - Theme preference (light, dark, system)
 * @param {string} preferences.language - Language preference
 * @param {string} preferences.dateFormat - Date format preference
 * @param {string} preferences.profileVisibility - Profile visibility (public, private)
 * @returns {Promise<Object>} Updated preferences
 */
export const updatePreferences = async (preferences) => {
    try {
        const response = await axiosInstance.put('/auth/preferences', preferences);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Export user data (GDPR compliance)
 * @param {string} format - Export format ('json' or 'csv')
 * @returns {Promise<Blob>} File blob for download
 */
export const exportData = async (format = 'json') => {
    try {
        const response = await axiosInstance.get(`/auth/export-data?format=${format}`, {
            responseType: 'blob', // Important for file download
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Deactivate user account (temporary, can be reactivated by admin)
 * @param {Object} deactivationData - Deactivation data
 * @param {string} deactivationData.password - User password for verification
 * @param {string} deactivationData.reason - Optional reason for deactivation
 * @returns {Promise<Object>} Success message
 */
export const deactivateAccount = async (deactivationData) => {
    try {
        const response = await axiosInstance.post('/auth/deactivate', deactivationData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete user account permanently (IRREVERSIBLE)
 * @param {Object} deletionData - Deletion confirmation data
 * @param {string} deletionData.password - User password for verification
 * @param {string} deletionData.confirmation - Must be exactly 'DELETE'
 * @returns {Promise<Object>} Success message
 */
export const deleteAccount = async (deletionData) => {
    try {
        const response = await axiosInstance.delete('/auth/delete-account', {
            data: deletionData,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Helper function to trigger file download
 * @param {Blob} blob - File blob
 * @param {string} filename - Filename for download
 */
export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

// Export all functions as named exports
export default {
    getCurrentUser,
    updateProfile,
    changePassword,
    updatePreferences,
    exportData,
    deactivateAccount,
    deleteAccount,
    downloadFile,
};

