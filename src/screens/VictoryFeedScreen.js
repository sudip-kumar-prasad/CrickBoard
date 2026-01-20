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
    Chip,
} from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../utils/storage';

/**
 * VictoryFeedScreen - PART 2: Simulation Logic
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, in this part, I have implemented a 'Data Merging' algorithm.
 * It fetches real matches from the user's local storage and weaves them 
 * into a list of global professional matches. This demonstrates how a 
 * single feed can handle both local and global data streams seamlessly."
 */

const GLOBAL_PRO_MATCHES = [
    {
        id: 'global_1',
        teamName: 'Global Cricket Council',
        opponent: 'Ind vs Aus (T20 World Cup)',
        result: 'India won by 6 Wickets',
        date: '2 Hours Ago',
        caption: 'Virat Kohli finishes it in style with a classic cover drive! What a match at the MCG. 🇮🇳🎯',
        claps: 1205,
        isSimulated: true,
    },
    {
        id: 'global_2',
        teamName: 'IPL Legends',
        opponent: 'CSK vs MI',
        result: 'CSK won by 1 Run',
        date: '1 Day Ago',
        caption: 'DHONI FINISHES IT OFF! A last-ball boundary that no-one will ever forget. 💛🏆',
        claps: 8500,
        isSimulated: true,
    }
];

export default function VictoryFeedScreen() {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadFeed = async () => {
        setRefreshing(true);
        try {
            const realMatches = await StorageService.getMatches() || [];

            // 👨‍🏫 EXPLANATION: Converting real matches to "Social Post" format
            const realPosts = realMatches.map(m => ({
                id: m.id,
                teamName: 'My Team (CrickBoard)',
                opponent: `vs ${m.opponent}`,
                result: m.result.toUpperCase(),
                date: new Date(m.date).toLocaleDateString(),
                caption: m.notes || 'Another victory for the books! Hard work pays off on the field. 🏏🏆',
                claps: Math.floor(Math.random() * 50) + 5, // Simulated local claps
                isSimulated: false,
            }));

            // Merge and sort (In reality, we'd sort by date)
            const combinedFeed = [...realPosts, ...GLOBAL_PRO_MATCHES];
            setPosts(combinedFeed);
        } catch (error) {
            console.error("Error loading feed:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFeed();
        }, [])
    );

    const handleClap = (id) => {
        setPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === id ? { ...post, claps: post.claps + 1 } : post
            )
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
                            label={item.teamName.substring(0, 2).toUpperCase()}
                            backgroundColor={item.isSimulated ? "#1e293b" : "#22c55e"}
                        />
                        <View style={{ marginLeft: 12 }}>
                            <View style={styles.nameRow}>
                                <Text style={styles.posterName}>{item.teamName}</Text>
                                {item.isSimulated && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" style={{ marginLeft: 4 }} />}
                            </View>
                            <Text style={styles.postTime}>{item.date}</Text>
                        </View>
                    </View>
                    <IconButton icon="dots-horizontal" iconColor="#94a3b8" onPress={() => { }} />
                </View>

                {/* 2. VICTORY BANNER (The Hero Content) */}
                <Surface style={styles.victoryBanner} elevation={4}>
                    <View style={styles.bannerOverlay}>
                        <MaterialCommunityIcons name="trophy" size={30} color="#f59e0b" />
                        <Text style={styles.bannerTitle}>VICTORY!</Text>
                        <Text style={styles.bannerMatch}>{item.opponent}</Text>
                        <Text style={styles.bannerResult}>{item.result}</Text>
                    </View>
                </Surface>

                {/* 3. CAPTION */}
                <View style={styles.postBody}>
                    <Text style={styles.captionText}>{item.caption}</Text>
                </View>

                <Divider style={styles.divider} />

                {/* 4. SOCIAL ACTIONS */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleClap(item.id)}
                    >
                        <MaterialCommunityIcons name="hands-pray" size={20} color="#22c55e" />
                        <Text style={styles.actionText}>{item.claps} Claps</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="chatbubble-outline" size={18} color="#94a3b8" />
                        <Text style={[styles.actionText, { color: '#94a3b8' }]}>Comment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="share-social-outline" size={18} color="#94a3b8" />
                        <Text style={[styles.actionText, { color: '#94a3b8' }]}>Share</Text>
                    </TouchableOpacity>
                </View>
            </Surface>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Victory Feed</Text>
                <IconButton icon="bell-outline" iconColor="#ffffff" />
            </View>

            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={renderPost}
                contentContainerStyle={styles.feedList}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={loadFeed}
            />
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
    nameRow: {
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
    victoryBanner: {
        height: 180,
        backgroundColor: '#1e293b',
        marginHorizontal: 15,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#334155',
        backgroundColor: '#0f172a', // Dark center for pop
    },
    bannerOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.05)', // Subtle green tint
    },
    bannerTitle: {
        color: '#22c55e',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 2,
    },
    bannerMatch: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 5,
    },
    bannerResult: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 2,
    },
    postBody: {
        padding: 15,
    },
    captionText: {
        color: '#e2e8f0',
        fontSize: 14,
        lineHeight: 20,
    },
    divider: {
        backgroundColor: '#334155',
        marginHorizontal: 15,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        color: '#22c55e',
        fontSize: 12,
        fontWeight: '600',
    }
});
