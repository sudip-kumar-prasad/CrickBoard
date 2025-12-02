import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: 'crickboard_user',
  IS_LOGGED_IN: 'crickboard_is_logged_in',
  USERS: 'crickboard_users', // Store all registered users
};

export class AuthService {
  // Register a new user
  static async register(email, password, name) {
    try {
      // Validate input
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Get existing users
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        email: email.toLowerCase().trim(),
        password: password, // In production, this should be hashed
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };

      // Add user to list
      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Auto-login after registration
      await this.login(email, password);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  static async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Get users
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Store logged in user (without password)
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Check if user is logged in
  static async isLoggedIn() {
    try {
      const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return isLoggedIn === 'true';
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUser(updatedData) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Get all users
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Update user in list
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }

      // Update current user
      const updatedUser = { ...currentUser, ...updatedData };
      delete updatedUser.password; // Don't store password in current user
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // DEBUG: Clear all authentication data (for testing)
  static async clearAuthData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
      console.log('✅ Auth session cleared! Reload the app to see login screen.');
      return { success: true };
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  }

  // DEBUG: Clear everything including all registered users
  static async clearAll() {
    try {
      await AsyncStorage.clear();
      console.log('✅ All AsyncStorage data cleared! Reload the app.');
      return { success: true };
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // DEBUG: View all stored auth data
  static async debugStorage() {
    try {
      const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const currentUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);

      console.log('📦 AsyncStorage Debug Info:');
      console.log('----------------------------');
      console.log('Registered Users:', users ? JSON.parse(users) : 'None');
      console.log('Current User:', currentUser ? JSON.parse(currentUser) : 'None');
      console.log('Is Logged In:', isLoggedIn);
      console.log('----------------------------');
    } catch (error) {
      console.error('Error reading storage:', error);
    }
  }
}

