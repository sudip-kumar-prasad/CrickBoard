import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Text,
    Surface,
    Avatar,
    Divider,
    IconButton,
} from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../utils/storage';

/**
 * VictoryWallScreen - Simplified private celebrations wall.
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have refactored this into a private 'Victory Wall'. 
 * Instead of social distractions like claps and global feeds, it focuses 
 * entirely on the user's own journey. It allows them to curate their 
 * best match moments with custom images and captions, creating a 
 * digital scrapbook of their cricketing achievements."
 */

export default function VictoryFeedScreen() {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

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

    const renderPost = ({ item }) => {
        return (
            <Surface style={styles.postCard} elevation={2}>
                {/* 1. POST HEADER */}
                <View style={styles.postHeader}>
                    <View style={styles.headerLeft}>
                        <Avatar.Text
                            size={40}
                            label="MY"
                            backgroundColor="#22c55e"
                        />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.posterName}>My Victory</Text>
                            <Text style={styles.postTime}>{item.date}</Text>
                        </View>
                    </View>
                    <IconButton icon="trophy-outline" iconColor="#f59e0b" size={20} />
                </View>

                {/* 2. VICTORY IMAGE / BANNER */}
                <View style={styles.imageContainer}>
                    {item.imageUri ? (
                        <Image source={{ uri: item.imageUri }} style={styles.victoryImage} />
                    ) : (
                        <View style={styles.placeholderBanner}>
                            <MaterialCommunityIcons name="trophy" size={50} color="#f59e0b" />
                            <Text style={styles.placeholderText}>VICTORY!</Text>
                        </View>
                    )}
                </View>

                {/* 3. POST BODY */}
                <View style={styles.postBody}>
                    <View style={styles.matchSummaryRow}>
                        <Text style={styles.matchTitle}>{item.opponent}</Text>
                        <Text style={styles.matchResult}>{item.result}</Text>
                    </View>
                    <Text style={styles.captionText}>{item.caption}</Text>
                </View>

                <Divider style={styles.divider} />

                {/* 4. FOOTER (Simple tag) */}
                <View style={styles.footer}>
                    <MaterialCommunityIcons name="cricket" size={16} color="#22c55e" />
                    <Text style={styles.footerText}>Celebrated on CrickBoard</Text>
                </View>
            </Surface>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Victory Wall</Text>
                <IconButton icon="camera-plus-outline" iconColor="#ffffff" />
            </View>

            {posts.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="trophy-variant-outline" size={80} color="#334155" />
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
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
        backgroundColor: '#1e293b',
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
        color: '#64748b',
        fontSize: 11,
    },
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#0f172a',
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
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        margin: 10,
        borderRadius: 20,
    },
    placeholderText: {
        color: '#22c55e',
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
        color: '#22c55e',
        fontSize: 12,
        fontWeight: 'bold',
    },
    captionText: {
        color: '#e2e8f0',
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    divider: {
        backgroundColor: '#334155',
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
        color: '#64748b',
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
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
    }
});
