import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const TournamentDetailScreen = ({ route }) => {
    const { theme } = useTheme();
    const { tournament } = route.params;

    const matches = [
        { id: 1, team1: 'Team A', team2: 'Team B', score1: '150/8', score2: '145/10', status: 'completed', winner: 'Team A' },
        { id: 2, team1: 'Team C', team2: 'Team D', status: 'upcoming', time: 'Tomorrow, 2:00 PM' },
    ];

    const standings = [
        { position: 1, team: 'Team A', played: 3, won: 3, lost: 0, points: 6 },
        { position: 2, team: 'Team C', played: 3, won: 2, lost: 1, points: 4 },
        { position: 3, team: 'Team B', played: 3, won: 1, lost: 2, points: 2 },
        { position: 4, team: 'Team D', played: 3, won: 0, lost: 3, points: 0 },
    ];

    const MatchCard = ({ match }) => (
        <View style={styles.matchCard}>
            <View style={styles.matchTeams}>
                <Text style={styles.teamName}>{match.team1}</Text>
                {match.score1 && <Text style={styles.score}>{match.score1}</Text>}
            </View>
            <Text style={styles.vs}>vs</Text>
            <View style={styles.matchTeams}>
                <Text style={styles.teamName}>{match.team2}</Text>
                {match.score2 && <Text style={styles.score}>{match.score2}</Text>}
            </View>
            {match.status === 'completed' && (
                <View style={styles.resultBadge}>
                    <Text style={styles.resultText}>{match.winner} won</Text>
                </View>
            )}
            {match.status === 'upcoming' && (
                <Text style={styles.upcomingTime}>{match.time}</Text>
            )}
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
    });

    return (
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
                        <Text style={styles.headerStatText}>{tournament.matches} Matches</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Standings</Text>
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
                        <StandingRow key={standing.position} standing={standing} />
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Matches</Text>
                {matches.map(match => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </View>
        </ScrollView>
    );
};



export default TournamentDetailScreen;
