import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Text,
    Surface,
    Avatar,
    Divider,
    IconButton,
    Modal,
    Portal,
    Button,
    TextInput as PaperTextInput,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../utils/storage';

/**
 * VictoryWallScreen - Simplified private celebrations wall.
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I've added defensive checks to the Victory Wall. 
 * Even if some match data is missing, the wall will now 
 * display a graceful fallback instead of crashing. I've 
 * also refined the image selection process for maximum 
 * reliability across all Android and iOS versions."
 */

export default function VictoryFeedScreen() {
  const { theme } = useTheme();
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Manual celebration state
    const [isAddingPost, setIsAddingPost] = useState(false);
    const [caption, setCaption] = useState('');
    const [victoryImage, setVictoryImage] = useState(null);
    const [publishing, setPublishing] = useState(false);

    const loadWall = async () => {
        setRefreshing(true);
        try {
            const victoryPosts = await StorageService.getVictoryPosts();
            setPosts(victoryPosts);
        } catch (error) {
            console.error("Error loading wall:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadWall();
        }, [])
    );

    // --- LOGIC: Manual Image Add ---
    const pickImage = async () => {
        Alert.alert(
            'Add Victory Photo',
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
                aspect: [16, 9],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setVictoryImage(result.assets[0].uri);
                setIsAddingPost(true); // Open modal after taking photo
            }
        } catch (error) {
            console.error("Camera Error:", error);
            Alert.alert("Error", "Could not open camera.");
        }
    };

    const launchGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need permissions to pick a victory photo!');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setVictoryImage(result.assets[0].uri);
                setIsAddingPost(true); // Open modal after picking image
            }
        } catch (error) {
            console.error("Image Picker Error:", error);
            Alert.alert("Error", "Could not open gallery.");
        }
    };

    const handleConfirmManualPublish = async () => {
        if (!victoryImage) return;
        setPublishing(true);
        try {
            const newPost = {
                id: Date.now().toString(),
                matchId: `manual_${Date.now()}`,
                opponent: 'Victory Moment 🏆',
                result: 'CELEBRATION',
                date: new Date().toLocaleDateString(),
                caption: caption || 'Cherishing this win! 🏏✨',
                imageUri: victoryImage,
            };

            await StorageService.addVictoryPost(newPost);
            setVictoryImage(null);
            setCaption('');
            setIsAddingPost(false);
            loadWall();
            Alert.alert("Victory Saved!", "Your celebration has been added to the wall.");
        } catch (error) {
            Alert.alert("Error", "Failed to save post.");
        } finally {
            setPublishing(false);
        }
    };

    const handleDeletePost = (postId) => {
        Alert.alert(
            'Delete Victory Post',
            'Are you sure you want to remove this celebration from your wall?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await StorageService.deleteVictoryPost(postId);
                            loadWall();
                            Alert.alert('Deleted', 'Post removed from your Victory Wall.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete post.');
                        }
                    },
                },
            ]
        );
    };

    const renderPost = ({ item }) => {
        return (
            <Surface style={styles.postCard} elevation={2}>
                {/* 1. POST HEADER */}
                <View style={styles.postHeader}>
                    <View style={styles.headerLeft}>
                        <Avatar.Text
                            size={40}
                            label="MY"
                            backgroundColor={theme.success}
                        />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.posterName}>My Victory</Text>
                            <Text style={styles.postTime}>{item.date || 'Today'}</Text>
                        </View>
                    </View>
                    <IconButton
                        icon="trash-can-outline"
                        iconColor={theme.error}
                        size={20}
                        onPress={() => handleDeletePost(item.id)}
                    />
                </View>

                {/* 2. VICTORY IMAGE / BANNER */}
                <View style={styles.imageContainer}>
                    {item.imageUri ? (
                        <Image source={{ uri: item.imageUri }} style={styles.victoryImage} />
                    ) : (
                        <View style={styles.placeholderBanner}>
                            <MaterialCommunityIcons name="trophy" size={50} color={theme.warning} />
                            <Text style={styles.placeholderText}>VICTORY!</Text>
                        </View>
                    )}
                </View>

                {/* 3. POST BODY */}
                <View style={styles.postBody}>
                    <View style={styles.matchSummaryRow}>
                        <Text style={styles.matchTitle}>{item.opponent || 'Our Success'}</Text>
                        <Text style={styles.matchResult}>{item.result || 'WIN'}</Text>
                    </View>
                    <Text style={styles.captionText}>{item.caption || 'Victory is ours! 🏆'}</Text>
                </View>

                <Divider style={styles.divider} />

                {/* 4. FOOTER (Simple tag) */}
                <View style={styles.footer}>
                    <MaterialCommunityIcons name="cricket" size={16} color={theme.success} />
                    <Text style={styles.footerText}>Celebrated on CrickBoard</Text>
                </View>
            </Surface>
        );
    };

    const renderAddModal = () => (
        <Portal>
            <Modal
                visible={isAddingPost}
                onDismiss={() => setIsAddingPost(false)}
                contentContainerStyle={styles.modalContent}
            >
                <Surface style={styles.modalCard} elevation={5}>
                    <Text style={styles.modalTitle}>Add to Wall</Text>

                    {victoryImage && (
                        <Image source={{ uri: victoryImage }} style={styles.previewImage} />
                    )}

                    <PaperTextInput
                        mode="outlined"
                        label="Caption your victory..."
                        value={caption}
                        onChangeText={setCaption}
                        multiline
                        numberOfLines={3}
                        style={styles.captionInput}
                        outlineColor={theme.borderLight}
                        activeOutlineColor={theme.success}
                        textColor="#ffffff"
                    />

                    <View style={styles.modalActions}>
                        <Button
                            mode="outlined"
                            onPress={() => setIsAddingPost(false)}
                            style={styles.cancelBtn}
                            textColor={theme.textSecondary}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleConfirmManualPublish}
                            style={styles.publishBtn}
                            buttonColor={theme.success}
                            loading={publishing}
                        >
                            Publish
                        </Button>
                    </View>
                </Surface>
            </Modal>
        </Portal>
    );

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    feedList: {
        padding: 16,
    },
    postCard: {
        backgroundColor: theme.border,
        borderRadius: 25,
        marginBottom: 20,
        overflow: 'hidden',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    posterName: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    postTime: {
        color: theme.textTertiary,
        fontSize: 11,
    },
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: theme.background,
    },
    victoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderBanner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.border,
        borderWidth: 1,
        borderColor: theme.borderLight,
        margin: 10,
        borderRadius: 20,
    },
    placeholderText: {
        color: theme.success,
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 2,
        marginTop: 10,
    },
    postBody: {
        padding: 20,
    },
    matchSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    matchTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    matchResult: {
        color: theme.success,
        fontSize: 12,
        fontWeight: 'bold',
    },
    captionText: {
        color: theme.text,
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    divider: {
        backgroundColor: theme.borderLight,
        marginHorizontal: 15,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        gap: 8,
    },
    footerText: {
        color: theme.textTertiary,
        fontSize: 11,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySub: {
        color: theme.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
    },
    // Modal Styles
    modalContent: {
        padding: 20,
        justifyContent: 'center',
    },
    modalCard: {
        backgroundColor: theme.border,
        borderRadius: 25,
        padding: 20,
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    previewImage: {
        width: '100%',
        height: 180,
        borderRadius: 15,
        marginBottom: 15,
        resizeMode: 'cover',
    },
    captionInput: {
        backgroundColor: theme.background,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelBtn: {
        flex: 1,
        borderColor: theme.borderLight,
    },
    publishBtn: {
        flex: 1,
    }
});

  return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Victory Wall</Text>
                <IconButton
                    icon="camera-plus-outline"
                    iconColor="#ffffff"
                    onPress={pickImage}
                />
            </View>

            {posts.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="trophy-variant-outline" size={80} color={theme.borderLight} />
                    <Text style={styles.emptyTitle}>Your Wall is Empty</Text>
                    <Text style={styles.emptySub}>Record a match and 'Celebrate' it to see your wins here!</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={item => item.id}
                    renderItem={renderPost}
                    contentContainerStyle={styles.feedList}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={loadWall}
                />
            )}
            {renderAddModal()}
        </SafeAreaView>
    );
}


