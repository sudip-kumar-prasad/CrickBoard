import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CustomDrawer = ({ visible, onClose, navigation, onLogout }) => {
    const { theme } = useTheme();

    const menuItems = [
        {
            name: 'Home',
            icon: 'home-outline',
            route: 'Home',
        },
        {
            name: 'Tournament',
            icon: 'trophy-outline',
            route: 'Tournament',
        },
        {
            name: 'Insights',
            icon: 'stats-chart-outline',
            route: 'Insights',
        },
        {
            name: 'Players',
            icon: 'people-outline',
            route: 'Players',
        },
        {
            name: 'Settings',
            icon: 'settings-outline',
            route: 'Settings',
        },
        {
            name: 'Profile',
            icon: 'person-outline',
            route: 'Profile',
        },
    ];

    const handleNavigation = (route) => {
        onClose();
        setTimeout(() => {
            navigation.navigate(route);
        }, 200);
    };

    const handleLogout = () => {
        onClose();
        setTimeout(() => {
            onLogout();
        }, 200);
    };

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: theme.overlay,
            justifyContent: 'flex-start',
        },
        drawer: {
            width: 280,
            height: '100%',
            backgroundColor: theme.backgroundCard,
            borderRightWidth: 1,
            borderRightColor: theme.borderLight,
        },
        drawerContent: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderLight,
        },
        headerText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.text,
        },
        closeButton: {
            padding: 4,
        },
        menuContainer: {
            flex: 1,
            paddingTop: 20,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            paddingLeft: 24,
        },
        menuText: {
            fontSize: 16,
            color: theme.text,
            marginLeft: 16,
            fontWeight: '500',
        },
        footer: {
            borderTopWidth: 1,
            borderTopColor: theme.borderLight,
            padding: 16,
        },
        logoutButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            paddingLeft: 24,
        },
        logoutText: {
            fontSize: 16,
            color: theme.error,
            marginLeft: 16,
            fontWeight: '500',
        },
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.drawer}>
                            <SafeAreaView style={styles.drawerContent}>
                                <View style={styles.header}>
                                    <Text style={styles.headerText}>CrickBoard</Text>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Ionicons name="close" size={24} color={theme.text} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.menuContainer}>
                                    {menuItems.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.menuItem}
                                            onPress={() => handleNavigation(item.route)}
                                        >
                                            <Ionicons name={item.icon} size={24} color={theme.textTertiary} />
                                            <Text style={styles.menuText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        style={styles.logoutButton}
                                        onPress={handleLogout}
                                    >
                                        <Ionicons name="log-out-outline" size={24} color={theme.error} />
                                        <Text style={styles.logoutText}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CustomDrawer;
