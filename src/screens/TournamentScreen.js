import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

const TournamentScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTournaments = async () => {
        try {
            setLoading(true);
            const data = await StorageService.getTournaments();
            setTournaments(data);
        } catch (error) {
            console.error('Error loading tournaments:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTournaments();
        }, [])
    );

    const TournamentCard = ({ tournament }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate('TournamentDetail', { tournament })}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.tournamentName, { color: theme.text }]}>{tournament.name}</Text>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: tournament.status === 'ongoing' ? theme.primaryDark : theme.success }
                ]}>
                    <Text style={styles.statusText}>
                        {tournament.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardStats}>
                <View style={styles.stat}>
                    <Ionicons name="people-outline" size={20} color={theme.textTertiary} />
                    <Text style={[styles.statText, { color: theme.textSecondary }]}>{tournament.teams} Teams</Text>
                </View>
                <View style={styles.stat}>
                    <Ionicons name="list-outline" size={20} color={theme.textTertiary} />
                    <Text style={[styles.statText, { color: theme.textSecondary }]}>{tournament.matches} Matches</Text>
                </View>
            </View>

            {tournament.status === 'ongoing' && (
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                        <View style={[styles.progressFill, { width: `${tournament.progress}%`, backgroundColor: theme.primary }]} />
                    </View>
                    <Text style={[styles.progressText, { color: theme.textTertiary }]}>{tournament.progress}% Complete</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollView: {
            flex: 1,
            padding: 16,
        },
        card: {
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
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
            flex: 1,
        },
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
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
        },
        progressContainer: {
            marginTop: 8,
        },
        progressBar: {
            height: 6,
            borderRadius: 3,
            overflow: 'hidden',
        },
        progressFill: {
            height: '100%',
        },
        progressText: {
            fontSize: 12,
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
            marginTop: 16,
        },
        emptySubtext: {
            fontSize: 14,
            marginTop: 8,
        },
        fab: {
            position: 'absolute',
            right: 16,
            bottom: 16,
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {tournaments.map(tournament => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                ))}

                {tournaments.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="trophy-outline" size={64} color={theme.borderLight} />
                        <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No tournaments yet</Text>
                        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Create your first tournament to get started</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('CreateTournament')}
            >
                <Ionicons name="add" size={32} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

export default TournamentScreen;
