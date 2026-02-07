import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
    const { theme, isDark, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    const handleExportData = () => {
        Alert.alert('Export Data', 'Data export feature coming soon!');
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'Are you sure you want to clear the app cache?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared!') },
            ]
        );
    };

    const SettingItem = ({ icon, title, subtitle, value, onValueChange, type = 'switch' }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon} size={24} color={theme.textTertiary} />
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {type === 'switch' && (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: theme.borderLight, true: theme.primaryDark }}
                    thumbColor={value ? theme.primary : theme.textTertiary}
                />
            )}
            {type === 'button' && (
                <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
            )}
        </View>
    );

    const SettingSection = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        section: {
            marginTop: 24,
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginLeft: 16,
            marginBottom: 12,
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.backgroundCard,
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        settingLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        settingText: {
            marginLeft: 16,
            flex: 1,
        },
        settingTitle: {
            fontSize: 16,
            color: theme.text,
            fontWeight: '500',
        },
        settingSubtitle: {
            fontSize: 13,
            color: theme.textTertiary,
            marginTop: 2,
        },
    });

    return (
        <ScrollView style={styles.container}>
            <SettingSection title="Preferences">
                <SettingItem
                    icon="notifications-outline"
                    title="Notifications"
                    subtitle="Receive match and milestone alerts"
                    value={notifications}
                    onValueChange={setNotifications}
                />
                <SettingItem
                    icon="moon-outline"
                    title="Dark Mode"
                    subtitle="Use dark theme"
                    value={isDark}
                    onValueChange={toggleTheme}
                />
                <SettingItem
                    icon="save-outline"
                    title="Auto-save"
                    subtitle="Automatically save match data"
                    value={autoSave}
                    onValueChange={setAutoSave}
                />
            </SettingSection>

            <SettingSection title="Data Management">
                <TouchableOpacity onPress={handleExportData}>
                    <SettingItem
                        icon="download-outline"
                        title="Export Data"
                        subtitle="Download all your data"
                        type="button"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClearCache}>
                    <SettingItem
                        icon="trash-outline"
                        title="Clear Cache"
                        subtitle="Free up storage space"
                        type="button"
                    />
                </TouchableOpacity>
            </SettingSection>

            <SettingSection title="About">
                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="information-circle-outline" size={24} color={theme.textTertiary} />
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>Version</Text>
                            <Text style={styles.settingSubtitle}>1.0.0</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name="code-outline" size={24} color={theme.textTertiary} />
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>Developer</Text>
                            <Text style={styles.settingSubtitle}>CrickBoard Team</Text>
                        </View>
                    </View>
                </View>
            </SettingSection>
        </ScrollView>
    );
};

export default SettingsScreen;
