import React, { useState } from 'react';
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

/**
 * VictoryFeedScreen - PART 1: UI Foundation
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, this is the new 'Community Victory Wall'. I have designed it to look 
 * like a professional social media feed. Even without a real-time server, 
 * we can simulate the community feel by formatting match results as 
 * high-engagement 'Victory Cards'."
 */

// Mock data for Part 1 - Will be moved to logic in Part 2
const MOCK_MESSAGES = [
    {
        id: '1',
        teamName: 'CrickBoard Elite',
        opponent: 'Royal Smashers',
        result: 'Won by 45 Runs',
        date: 'Just Now',
        caption: 'Unbelievable performance today! The bowlers really stepped up in the death overs. 🏆🏏',
        claps: 24,
        isSimulated: false,
    },
    {
        id: '2',
        teamName: 'Global Pro League',
        opponent: 'Team India vs Australia',
        result: 'India won by 6 Wickets',
        date: '2 Hours Ago',
        caption: 'Virat Kohli finishes it in style with a classic cover drive! What a match at the MCG. 🇮🇳🎯',
        claps: 1205,
        isSimulated: true,
    }
];

export default function VictoryFeedScreen() {
    const [posts, setPosts] = useState(MOCK_MESSAGES);

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
                    <TouchableOpacity style={styles.actionBtn}>
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
