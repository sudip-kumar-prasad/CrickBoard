import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Debug utility to clear all app data from AsyncStorage
 * Use this to reset the app to a fresh state
 */
export const clearAllStorage = async () => {
    try {
        await AsyncStorage.clear();
        console.log('✅ AsyncStorage cleared successfully!');
        console.log('Please reload the app to see the login screen.');
        return true;
    } catch (error) {
        console.error('❌ Error clearing AsyncStorage:', error);
        return false;
    }
};

/**
 * Clear only authentication data (keeps other app data)
 */
export const clearAuthData = async () => {
    try {
        await AsyncStorage.removeItem('crickboard_user');
        await AsyncStorage.setItem('crickboard_is_logged_in', 'false');
        console.log('✅ Auth data cleared successfully!');
        console.log('Please reload the app to see the login screen.');
        return true;
    } catch (error) {
        console.error('❌ Error clearing auth data:', error);
        return false;
    }
};

/**
 * View all stored data (for debugging)
 */
export const viewAllStorage = async () => {
    try {
        const users = await AsyncStorage.getItem('crickboard_users');
        const currentUser = await AsyncStorage.getItem('crickboard_user');
        const isLoggedIn = await AsyncStorage.getItem('crickboard_is_logged_in');

        console.log('📦 AsyncStorage Contents:');
        console.log('----------------------------');
        console.log('All Users:', users ? JSON.parse(users) : 'None');
        console.log('Current User:', currentUser ? JSON.parse(currentUser) : 'None');
        console.log('Is Logged In:', isLoggedIn);
        console.log('----------------------------');
    } catch (error) {
        console.error('❌ Error reading storage:', error);
    }
};
