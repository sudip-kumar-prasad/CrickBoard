import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

const TournamentDetailScreen = ({ route, navigation }) => {
    const { theme } = useTheme();
    const { tournament: initialTournament } = route.params;
    const [tournament, setTournament] = useState(initialTournament);
    const [matches, setMatches] = useState([]);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const allMatches = await StorageService.getMatches();
            const tournamentMatches = allMatches.filter(m => m.tournamentId === tournament.id);
            setMatches(tournamentMatches);

            // Calculate Standings
            const teamStats = {};
            // Initialize teams from the matches or predefined teams if we had them
            // For now, we extract teams from matches
            tournamentMatches.forEach(match => {
                const teams = [match.team1 || 'Team A', match.opponent || 'Opponent']; // Use opponent from match
                teams.forEach(team => {
                    if (!teamStats[team]) {
                        teamStats[team] = { team, played: 0, won: 0, lost: 0, draw: 0, points: 0 };
                    }
                });

                const t1 = match.team1 || 'Team A';
                const t2 = match.opponent || 'Opponent';

                teamStats[t1].played += 1;
                teamStats[t2].played += 1;

                if (match.result === 'Win') {
                    teamStats[t1].won += 1;
                    teamStats[t1].points += 2;
                    teamStats[t2].lost += 1;
                } else if (match.result === 'Loss') {
                    teamStats[t2].won += 1;
                    teamStats[t2].points += 2;
                    teamStats[t1].lost += 1;
                } else {
                    teamStats[t1].draw += 1;
                    teamStats[t2].draw += 1;
                    teamStats[t1].points += 1;
                    teamStats[t2].points += 1;
                }
            });

            const sortedStandings = Object.values(teamStats)
                .sort((a, b) => b.points - a.points || (b.won - a.won))
                .map((stat, index) => ({ ...stat, position: index + 1 }));

            setStandings(sortedStandings);
        } catch (error) {
            console.error('Error loading tournament details:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const MatchCard = ({ match }) => (
        <View style={styles.matchCard}>
            <View style={styles.matchTeams}>
                <Text style={styles.teamName}>{match.team1 || 'Our Team'}</Text>
                {match.performances && (
                    <Text style={styles.score}>
                        {match.performances.reduce((sum, p) => sum + (p.runs || 0), 0)}/
                        {match.performances.reduce((sum, p) => sum + (p.wickets || 0), 0)}
                    </Text>
                )}
            </View>
            <Text style={styles.vs}>vs</Text>
            <View style={styles.matchTeams}>
                <Text style={styles.teamName}>{match.opponent}</Text>
                <Text style={styles.score}>-</Text>
            </View>
            <View style={[
                styles.resultBadge,
                { backgroundColor: match.result === 'Win' ? theme.success : theme.error }
            ]}>
                <Text style={styles.resultText}>
                    {match.result === 'Win' ? `${match.team1 || 'Our Team'} Won` : `${match.opponent} Won`}
                </Text>
            </View>
            <Text style={styles.upcomingTime}>{new Date(match.date).toLocaleDateString()}</Text>
        </View>
    );

    const StandingRow = ({ standing }) => (
        <View style={styles.standingRow}>
            <Text style={styles.position}>{standing.position}</Text>
            <Text style={styles.standingTeam}>{standing.team}</Text>
            <Text style={styles.standingStat}>{standing.played}</Text>
            <Text style={styles.standingStat}>{standing.won}</Text>
            <Text style={styles.standingStat}>{standing.lost}</Text>
            <Text style={styles.standingPoints}>{standing.points}</Text>
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            padding: 16,
            backgroundColor: theme.backgroundCard,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        tournamentName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.text,
            marginBottom: 12,
        },
        headerStats: {
            flexDirection: 'row',
            gap: 16,
        },
        headerStat: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        headerStatText: {
            fontSize: 14,
            color: theme.textSecondary,
        },
        section: {
            padding: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 12,
        },
        standingsTable: {
            backgroundColor: theme.backgroundCard,
            borderRadius: 8,
            overflow: 'hidden',
        },
        standingHeader: {
            flexDirection: 'row',
            padding: 12,
            backgroundColor: theme.border,
        },
        headerPos: { width: 30, fontSize: 12, fontWeight: '600', color: theme.textSecondary },
        headerTeam: { flex: 1, fontSize: 12, fontWeight: '600', color: theme.textSecondary },
        headerCol: { width: 30, fontSize: 12, fontWeight: '600', color: theme.textSecondary, textAlign: 'center' },
        headerColPoints: { width: 40, fontSize: 12, fontWeight: '600', color: theme.textSecondary, textAlign: 'center' },
        standingRow: {
            flexDirection: 'row',
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        position: { width: 30, fontSize: 16, fontWeight: '600', color: theme.text },
        standingTeam: { flex: 1, fontSize: 16, color: theme.text },
        standingStat: { width: 30, fontSize: 16, color: theme.textSecondary, textAlign: 'center' },
        standingPoints: { width: 40, fontSize: 16, fontWeight: '600', color: theme.primary, textAlign: 'center' },
        matchCard: {
            backgroundColor: theme.backgroundCard,
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.border,
        },
        matchTeams: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 4,
        },
        teamName: {
            fontSize: 16,
            color: theme.text,
            fontWeight: '500',
        },
        score: {
            fontSize: 16,
            color: theme.primary,
            fontWeight: '600',
        },
        vs: {
            fontSize: 12,
            color: theme.textTertiary,
            textAlign: 'center',
            marginVertical: 4,
        },
        resultBadge: {
            marginTop: 8,
            paddingVertical: 4,
            paddingHorizontal: 12,
            backgroundColor: theme.success,
            borderRadius: 4,
            alignSelf: 'flex-start',
        },
        resultText: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.background,
        },
        upcomingTime: {
            fontSize: 14,
            color: theme.textTertiary,
            marginTop: 8,
        },
        addMatchBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.backgroundCard,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.primary,
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
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.tournamentName}>{tournament.name}</Text>
                    <View style={styles.headerStats}>
                        <View style={styles.headerStat}>
                            <Ionicons name="people-outline" size={20} color={theme.textTertiary} />
                            <Text style={styles.headerStatText}>{tournament.teams} Teams</Text>
                        </View>
                        <View style={styles.headerStat}>
                            <Ionicons name="list-outline" size={20} color={theme.textTertiary} />
                            <Text style={styles.headerStatText}>{matches.length} Matches</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Standings</Text>
                    {standings.length > 0 ? (
                        <View style={styles.standingsTable}>
                            <View style={styles.standingHeader}>
                                <Text style={styles.headerPos}>#</Text>
                                <Text style={styles.headerTeam}>Team</Text>
                                <Text style={styles.headerCol}>P</Text>
                                <Text style={styles.headerCol}>W</Text>
                                <Text style={styles.headerCol}>L</Text>
                                <Text style={styles.headerColPoints}>Pts</Text>
                            </View>
                            {standings.map(standing => (
                                <StandingRow key={standing.team} standing={standing} />
                            ))}
                        </View>
                    ) : (
                        <View style={[styles.matchCard, { alignItems: 'center', padding: 30 }]}>
                            <Ionicons name="podium-outline" size={40} color={theme.textTertiary} />
                            <Text style={{ color: theme.textSecondary, marginTop: 10 }}>No standings available yet</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={styles.sectionTitle}>Matches</Text>
                        <TouchableOpacity
                            style={styles.addMatchBtn}
                            onPress={() => navigation.navigate('Tabs', {
                                screen: 'Matches',
                                params: {
                                    screen: 'RecordMatch',
                                    params: { tournamentId: tournament.id, tournamentName: tournament.name }
                                }
                            })}
                        >
                            <Ionicons name="add-circle" size={20} color={theme.primary} />
                            <Text style={{ color: theme.primary, fontWeight: 'bold', marginLeft: 4 }}>Add Match</Text>
                        </TouchableOpacity>
                    </View>

                    {matches.length > 0 ? (
                        matches.map(match => (
                            <MatchCard key={match.id} match={match} />
                        ))
                    ) : (
                        <View style={[styles.matchCard, { alignItems: 'center', padding: 30 }]}>
                            <Ionicons name="calendar-outline" size={40} color={theme.textTertiary} />
                            <Text style={{ color: theme.textSecondary, marginTop: 10 }}>No matches recorded</Text>
                        </View>
                    )}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};



export default TournamentDetailScreen;
