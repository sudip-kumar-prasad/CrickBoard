import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TournamentScreen = ({ navigation }) => {
    const [tournaments] = useState([
        {
            id: 1,
            name: 'Summer League 2024',
            teams: 8,
            matches: 12,
            status: 'ongoing',
            progress: 60,
        },
        {
            id: 2,
            name: 'Weekend Cup',
            teams: 4,
            matches: 6,
            status: 'completed',
            progress: 100,
        },
    ]);

    const TournamentCard = ({ tournament }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TournamentDetail', { tournament })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.tournamentName}>{tournament.name}</Text>
                <View style={[
                    styles.statusBadge,
                    tournament.status === 'ongoing' ? styles.statusOngoing : styles.statusCompleted
                ]}>
                    <Text style={styles.statusText}>
                        {tournament.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardStats}>
                <View style={styles.stat}>
                    <Ionicons name="people-outline" size={20} color="#64748b" />
                    <Text style={styles.statText}>{tournament.teams} Teams</Text>
                </View>
                <View style={styles.stat}>
                    <Ionicons name="list-outline" size={20} color="#64748b" />
                    <Text style={styles.statText}>{tournament.matches} Matches</Text>
                </View>
            </View>

            {tournament.status === 'ongoing' && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${tournament.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{tournament.progress}% Complete</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {tournaments.map(tournament => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                ))}

                {tournaments.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="trophy-outline" size={64} color="#334155" />
                        <Text style={styles.emptyText}>No tournaments yet</Text>
                        <Text style={styles.emptySubtext}>Create your first tournament to get started</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateTournament')}
            >
                <Ionicons name="add" size={32} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#0b1223',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tournamentName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e2e8f0',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusOngoing: {
        backgroundColor: '#1e40af',
    },
    statusCompleted: {
        backgroundColor: '#10b981',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
    cardStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        color: '#94a3b8',
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#1e293b',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
    },
    progressText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#475569',
        marginTop: 8,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default TournamentScreen;
