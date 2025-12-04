import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput as RNTextInput,
} from 'react-native';
import { Text, Card, Button, TextInput, Avatar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '../utils/auth';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

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
                setEmail(userData.email);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
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

    const handleCancelEdit = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setIsEditing(false);
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AuthService.logout();
                            // The App.js will automatically detect logout and show login screen
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout');
                        }
                    },
                },
            ]
        );
    };

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Card with Avatar */}
            <Card style={styles.headerCard} mode="elevated">
                <Card.Content style={styles.headerContent}>
                    <View style={styles.avatarContainer}>
                        <Avatar.Text
                            size={100}
                            label={getInitials(user.name)}
                            style={styles.avatar}
                            labelStyle={styles.avatarLabel}
                        />
                    </View>

                    {!isEditing ? (
                        <>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <Text style={styles.joinDate}>
                                Member since {formatDate(user.createdAt)}
                            </Text>
                        </>
                    ) : (
                        <View style={styles.editForm}>
                            <TextInput
                                mode="outlined"
                                label="Full Name"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                left={<TextInput.Icon icon="account" />}
                            />
                            <TextInput
                                mode="outlined"
                                label="Email"
                                value={email}
                                editable={false}
                                style={[styles.input, styles.disabledInput]}
                                left={<TextInput.Icon icon="email" />}
                            />
                            <Text style={styles.hint}>Email cannot be changed</Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            {/* Action Buttons */}
            {isEditing ? (
                <View style={styles.editActions}>
                    <Button
                        mode="contained"
                        onPress={handleSaveProfile}
                        loading={loading}
                        disabled={loading}
                        style={styles.saveButton}
                        icon="content-save"
                    >
                        Save Changes
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={handleCancelEdit}
                        disabled={loading}
                        style={styles.cancelButton}
                        icon="close"
                    >
                        Cancel
                    </Button>
                </View>
            ) : (
                <Button
                    mode="contained"
                    onPress={() => setIsEditing(true)}
                    style={styles.editButton}
                    icon="pencil"
                >
                    Edit Profile
                </Button>
            )}

            {/* Account Information */}
            <Card style={styles.infoCard} mode="elevated">
                <Card.Title
                    title="Account Information"
                    titleStyle={styles.cardTitle}
                    left={(props) => <Ionicons name="information-circle-outline" size={24} color="#60a5fa" />}
                />
                <Card.Content>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Account ID</Text>
                        <Text style={styles.infoValue}>{user.id?.substring(0, 12)}...</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user.email}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Joined</Text>
                        <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* App Information */}
            <Card style={styles.infoCard} mode="elevated">
                <Card.Title
                    title="About CrickBoard"
                    titleStyle={styles.cardTitle}
                    left={(props) => <Ionicons name="cricket-outline" size={24} color="#10b981" />}
                />
                <Card.Content>
                    <Text style={styles.aboutText}>
                        CrickBoard helps you track your cricket team's performance, manage players,
                        record matches, and analyze statistics - all in one place.
                    </Text>
                    <View style={styles.versionInfo}>
                        <Text style={styles.versionText}>Version 1.0.0</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Logout Button */}
            <Button
                mode="outlined"
                onPress={handleLogout}
                style={styles.logoutButton}
                buttonColor="#1e293b"
                textColor="#ef4444"
                icon="logout"
            >
                Logout
            </Button>

            <View style={styles.bottomSpacer} />
        </ScrollView>
    );
}

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
    headerCard: {
        margin: 16,
        marginBottom: 12,
        backgroundColor: '#1e293b',
        borderRadius: 20,
    },
    headerContent: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        backgroundColor: '#3b82f6',
    },
    avatarLabel: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    userEmail: {
        fontSize: 16,
        color: '#94a3b8',
        marginBottom: 8,
        textAlign: 'center',
    },
    joinDate: {
        fontSize: 14,
        color: '#60a5fa',
        textAlign: 'center',
    },
    editForm: {
        width: '100%',
        marginTop: 16,
    },
    input: {
        backgroundColor: '#0f172a',
        marginBottom: 12,
    },
    disabledInput: {
        opacity: 0.6,
    },
    hint: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: -8,
        marginBottom: 8,
        textAlign: 'center',
    },
    editActions: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    saveButton: {
        marginBottom: 8,
        backgroundColor: '#10b981',
    },
    cancelButton: {
        borderColor: '#ef4444',
    },
    editButton: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#3b82f6',
    },
    infoCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#1e293b',
        borderRadius: 16,
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '600',
    },
    divider: {
        backgroundColor: '#334155',
    },
    aboutText: {
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 22,
        marginBottom: 16,
    },
    versionInfo: {
        alignItems: 'center',
        paddingTop: 8,
    },
    versionText: {
        fontSize: 12,
        color: '#64748b',
    },
    logoutButton: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderColor: '#ef4444',
        borderWidth: 2,
    },
    bottomSpacer: {
        height: 32,
    },
});
