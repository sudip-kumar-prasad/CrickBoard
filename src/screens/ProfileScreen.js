import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import {
    Text,
    Surface,
    Button,
    Avatar,
    Divider,
    TextInput as PaperTextInput,
    Chip
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../utils/auth';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

/**
 * ProfileScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have redesigned the profile screen to feel like a premium management 
 * dashboard. I used a 'Hero Profile' section at the top with a large avatar 
 * and status chips. The code is kept very direct: we use focused effects 
 * to load user data and a simple toggle for editing/viewing modes."
 */
export default function ProfileScreen({ navigation, onLogout }) {
    // --- STATE ---
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- DATA LOADING ---
    useFocusEffect(
        useCallback(() => {
            loadUserData();
        }, [])
    );

    const loadUserData = async () => {
        try {
            const userData = await AuthService.getCurrentUser();
            if (userData) {
                setUser(userData);
                setName(userData.name);
                setProfileImage(userData.profileImage || null);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // --- LOGIC ---

    const pickImage = async () => {
        Alert.alert(
            'Update Profile Picture',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: () => launchCamera(),
                },
                {
                    text: 'Choose from Gallery',
                    onPress: () => launchGallery(),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const launchCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need camera permissions to take a photo!');
                return;
            }

            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                setProfileImage(imageUri);

                // 👨‍🏫 EXPLANATION: Direct update to our AuthService to save the image path
                try {
                    await AuthService.updateUser({ profileImage: imageUri });
                } catch (error) {
                    console.error('Error saving profile image:', error);
                }
            }
        } catch (error) {
            console.error("Camera Error:", error);
            Alert.alert("Error", "Could not open camera.");
        }
    };

    const launchGallery = async () => {
        try {
            // 👨‍🏫 EXPLANATION: Requesting permission to access the media library
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
                return;
            }

            // 👨‍🏫 EXPLANATION: Launching the image picker
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                setProfileImage(imageUri);

                // 👨‍🏫 EXPLANATION: Direct update to our AuthService to save the image path
                try {
                    await AuthService.updateUser({ profileImage: imageUri });
                } catch (error) {
                    console.error('Error saving profile image:', error);
                }
            }
        } catch (error) {
            console.error("Image Picker Error:", error);
            Alert.alert("Error", "Could not open gallery.");
        }
    };

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            // 👨‍🏫 EXPLANATION: Direct update to our AuthService
            await AuthService.updateUser({ name: name.trim() });
            Alert.alert('Success', 'Profile updated successfully!');
            setIsEditing(false);
            loadUserData();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to exit the app?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AuthService.logout();
                            if (onLogout) onLogout();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout');
                        }
                    },
                },
            ]
        );
    };

    // Helper: Logic for initials
    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Member';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    if (!user) return <SafeAreaView style={styles.loadingContainer}><Text style={styles.loadingText}>Loading Profile...</Text></SafeAreaView>;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. HERO PROFILE SECTION */}
                <Surface style={styles.heroSection} elevation={4}>
                    <View style={styles.avatarWrapper}>
                        {profileImage ? (
                            <Avatar.Image
                                size={110}
                                source={{ uri: profileImage }}
                            />
                        ) : (
                            <Avatar.Text
                                size={110}
                                label={getInitials(user.name)}
                                backgroundColor="#22c55e"
                                labelStyle={styles.avatarLabel}
                            />
                        )}

                        {/* Camera Control Badge */}
                        <TouchableOpacity
                            style={styles.cameraBadge}
                            onPress={pickImage}
                        >
                            <Ionicons name="camera" size={18} color="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.editBadge}
                            onPress={() => setIsEditing(!isEditing)}
                        >
                            <Ionicons name={isEditing ? "close" : "pencil"} size={16} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    {isEditing ? (
                        <View style={styles.editContainer}>
                            <PaperTextInput
                                mode="flat"
                                label="Your Full Name"
                                value={name}
                                onChangeText={setName}
                                style={styles.editInput}
                                textColor="#ffffff"
                                activeUnderlineColor="#22c55e"
                            />
                            <Button
                                mode="contained"
                                onPress={handleSaveProfile}
                                loading={loading}
                                style={styles.miniSaveBtn}
                                labelStyle={{ fontSize: 12 }}
                            >
                                Save Changes
                            </Button>
                        </View>
                    ) : (
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <Chip icon="shield-check" style={styles.statusChip} textStyle={styles.statusText}>
                                Active Manager
                            </Chip>
                        </View>
                    )}
                </Surface>

                {/* 2. ACCOUNT DETAILS */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Account Details</Text>
                </View>

                <Surface style={styles.infoCard} elevation={2}>
                    {renderInfoRow("User ID", user.id?.substring(0, 12) + "...", "finger-print-outline")}
                    <Divider style={styles.divider} />
                    {renderInfoRow("Member Since", formatDate(user.createdAt), "calendar-outline")}
                    <Divider style={styles.divider} />
                    {renderInfoRow("Access Level", "Full Pro Access", "star-outline")}
                </Surface>

                {/* 3. APP INFORMATION */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Application</Text>
                </View>

                <Surface style={styles.infoCard} elevation={2}>
                    <View style={styles.aboutBox}>
                        <Text style={styles.aboutText}>
                            CrickBoard is your complete digital ecosystem for tracking matches,
                            managing player stats, and analyzing deep insights of your squad.
                        </Text>
                    </View>
                    <Divider style={styles.divider} />
                    {renderInfoRow("App Version", "1.2.0 (Premium)", "information-circle-outline")}
                </Surface>

                {/* 4. LOGOUT BUTTON */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                    <Text style={styles.logoutText}>Logout from Account</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

// Helper component for info rows
const renderInfoRow = (label, value, icon) => (
    <View style={styles.infoRow}>
        <View style={styles.infoLabelLeft}>
            <Ionicons name={icon} size={20} color="#22c55e" />
            <Text style={styles.rowLabelText}>{label}</Text>
        </View>
        <Text style={styles.rowValueText}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
    },
    loadingText: {
        color: '#94a3b8',
        fontSize: 16,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        backgroundColor: '#1e293b',
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 20,
    },
    avatarLabel: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    cameraBadge: {
        position: 'absolute',
        top: 0,
        right: -5,
        backgroundColor: '#22c55e',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1e293b',
        zIndex: 1,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: -5,
        backgroundColor: '#3b82f6',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1e293b',
        zIndex: 1,
    },
    profileInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    userEmail: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 5,
    },
    statusChip: {
        backgroundColor: '#0f172a',
        marginTop: 15,
        height: 32,
    },
    statusText: {
        color: '#22c55e',
        fontSize: 11,
        fontWeight: 'bold',
    },
    editContainer: {
        width: '100%',
        alignItems: 'center',
    },
    editInput: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    miniSaveBtn: {
        marginTop: 15,
        backgroundColor: '#22c55e',
        borderRadius: 10,
    },
    sectionHeader: {
        paddingHorizontal: 24,
        marginTop: 30,
        marginBottom: 10,
    },
    sectionTitle: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    infoCard: {
        backgroundColor: '#1e293b',
        marginHorizontal: 16,
        borderRadius: 20,
        paddingVertical: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    infoLabelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowLabelText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    rowValueText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        backgroundColor: '#334155',
        marginHorizontal: 20,
    },
    aboutBox: {
        padding: 20,
    },
    aboutText: {
        color: '#94a3b8',
        fontSize: 13,
        lineHeight: 20,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e293b',
        marginHorizontal: 16,
        marginTop: 40,
        paddingVertical: 18,
        borderRadius: 20,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomSpacer: {
        height: 50,
    },
});
