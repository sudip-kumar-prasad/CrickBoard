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

const CustomDrawer = ({ visible, onClose, navigation, onLogout }) => {
    const menuItems = [
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
        // Small delay to allow drawer to close smoothly
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
                                {/* Header */}
                                <View style={styles.header}>
                                    <Text style={styles.headerText}>CrickBoard</Text>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Ionicons name="close" size={24} color="#e2e8f0" />
                                    </TouchableOpacity>
                                </View>

                                {/* Menu Items */}
                                <View style={styles.menuContainer}>
                                    {menuItems.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.menuItem}
                                            onPress={() => handleNavigation(item.route)}
                                        >
                                            <Ionicons name={item.icon} size={24} color="#64748b" />
                                            <Text style={styles.menuText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Logout Button */}
                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        style={styles.logoutButton}
                                        onPress={handleLogout}
                                    >
                                        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    drawer: {
        width: 280,
        height: '100%',
        backgroundColor: '#0b1223',
        borderRightWidth: 1,
        borderRightColor: '#334155',
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
        borderBottomColor: '#334155',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e2e8f0',
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
        color: '#e2e8f0',
        marginLeft: 16,
        fontWeight: '500',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#334155',
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
        color: '#ef4444',
        marginLeft: 16,
        fontWeight: '500',
    },
});

export default CustomDrawer;
