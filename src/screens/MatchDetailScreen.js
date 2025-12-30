import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
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
 * MatchDetailScreen Component - Premium post-match analysis dashboard.
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have built this dashboard to provide a deep dive into match performance.
 * It uses a multi-layered UI where batting and bowling stats are clearly separated.
 * I've also implemented real-time calculation of Strike Rates and Economy Rates to 
 * show how we can derive advanced insights from simple run and ball counts."
 */
export default function MatchDetailScreen({ route, navigation }) {
    const { match } = route.params;

    if (!match) return null;

    // --- LOGIC: Advanced Stat Calculations ---
    const calculateStrikeRate = (runs, balls) => {
        if (!balls || balls === 0) return '0.0';
        return ((runs / balls) * 100).toFixed(1);
    };

    const calculateEconomy = (runs, overs) => {
        if (!overs || overs === 0) return '0.0';
        return (runs / overs).toFixed(1);
    };

    // Find Man of the Match (Example logic: most runs + wickets)
    const performances = match.performances || [];
    const mom = performances.length > 0 ? performances.reduce((prev, current) => {
        const prevPoints = (prev.runs || 0) + (prev.wickets || 0) * 20;
        const currentPoints = (current.runs || 0) + (current.wickets || 0) * 20;
        return prevPoints > currentPoints ? prev : current;
    }) : null;

    // --- UI COMPONENTS ---

    const renderHeader = () => {
        const isWin = (match.result || '').toLowerCase().includes('win');
        return (
            <Surface style={styles.headerBanner} elevation={4}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Match Report</Text>
                    <IconButton icon="share-variant" iconColor="#22c55e" size={20} />
                </View>

                <View style={styles.matchHero}>
                    <View style={styles.teamInfo}>
                        <Avatar.Text size={50} label="CB" backgroundColor="#22c55e" labelStyle={{ fontWeight: 'bold' }} />
                        <Text style={styles.teamName}>CrickBoard</Text>
                    </View>

                    <View style={styles.vsContainer}>
                        <Text style={styles.vsText}>VS</Text>
                        <Chip
                            style={[styles.resultChip, { backgroundColor: isWin ? '#22c55e' : '#ef4444' }]}
                            textStyle={styles.resultChipText}
                        >
                            {match.result.toUpperCase()}
                        </Chip>
                    </View>

                    <View style={styles.teamInfo}>
                        <Avatar.Text size={50} label={match.opponent.substring(0, 1).toUpperCase()} backgroundColor="#334155" />
                        <Text style={styles.teamName}>{match.opponent}</Text>
                    </View>
                </View>

                <View style={[styles.metaRow, { justifyContent: 'center', marginTop: 10 }]}>
                    <Ionicons name="location" size={14} color="#94a3b8" />
                    <Text style={styles.metaText}>{match.venue}  •  </Text>
                    <Ionicons name="calendar" size={14} color="#94a3b8" />
                    <Text style={styles.metaText}>{new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                </View>
            </Surface>
        );
    };

    const renderMOM = () => {
        if (!mom) return null;
        return (
            <Surface style={styles.momCard} elevation={2}>
                <View style={styles.momLeft}>
                    <MaterialCommunityIcons name="trophy-variant" size={40} color="#f59e0b" />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.momLabel}>PLAYER OF THE MATCH</Text>
                        <Text style={styles.momName}>{mom.playerName}</Text>
                    </View>
                </View>
                <View style={styles.momStats}>
                    <Text style={styles.momStatText}>{mom.runs}({mom.balls})</Text>
                    <Text style={styles.momStatSub}>{mom.wickets} Wkts</Text>
                </View>
            </Surface>
        );
    };

    const renderBattingScorecard = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="cricket" size={20} color="#22c55e" />
                <Text style={styles.sectionTitle}>Batting Performance</Text>
            </View>
            <Surface style={styles.tableCard} elevation={1}>
                {/* Table Header */}
                <View style={styles.tableRowHeader}>
                    <Text style={[styles.colName, styles.headerLabel]}>Batsman</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>R</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>B</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>4s/6s</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>SR</Text>
                </View>
                {performances.map((p, idx) => (
                    <View key={p.playerId} style={[styles.tableRow, idx === performances.length - 1 && { borderBottomWidth: 0 }]}>
                        <Text style={styles.colName} numberOfLines={1}>{p.playerName}</Text>
                        <Text style={styles.colStatBold}>{p.runs}</Text>
                        <Text style={styles.colStat}>{p.balls}</Text>
                        <Text style={styles.colStat}>{p.fours}/{p.sixes}</Text>
                        <Text style={styles.colStatHighlight}>{calculateStrikeRate(p.runs, p.balls)}</Text>
                    </View>
                ))}
            </Surface>
        </View>
    );

    const renderBowlingScorecard = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="bowling-ball" size={20} color="#60a5fa" />
                <Text style={styles.sectionTitle}>Bowling Performance</Text>
            </View>
            <Surface style={styles.tableCard} elevation={1}>
                <View style={styles.tableRowHeader}>
                    <Text style={[styles.colName, styles.headerLabel]}>Bowler</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>O</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>M</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>R</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>W</Text>
                    <Text style={[styles.colStat, styles.headerLabel]}>ECO</Text>
                </View>
                {performances.map((p, idx) => (
                    <View key={p.playerId} style={[styles.tableRow, idx === performances.length - 1 && { borderBottomWidth: 0 }]}>
                        <Text style={styles.colName} numberOfLines={1}>{p.playerName}</Text>
                        <Text style={styles.colStat}>{p.overs}</Text>
                        <Text style={styles.colStat}>{p.maidens || 0}</Text>
                        <Text style={styles.colStat}>{p.runsConceded}</Text>
                        <Text style={styles.colStatBold}>{p.wickets}</Text>
                        <Text style={styles.colStatHighlight}>{calculateEconomy(p.runsConceded, p.overs)}</Text>
                    </View>
                ))}
            </Surface>
        </View>
    );

    const renderExtras = () => (
        <Surface style={styles.extrasCard} elevation={1}>
            <Text style={styles.extrasTitle}>Team Extras Conceded</Text>
            <View style={styles.extrasGrid}>
                <View style={styles.extraItem}>
                    <Text style={styles.extraVal}>{match.wides || 0}</Text>
                    <Text style={styles.extraLab}>Wides</Text>
                </View>
                <View style={styles.extraDivider} />
                <View style={styles.extraItem}>
                    <Text style={styles.extraVal}>{match.noBalls || 0}</Text>
                    <Text style={styles.extraLab}>No-Balls</Text>
                </View>
                <View style={styles.extraDivider} />
                <View style={styles.extraItem}>
                    <Text style={styles.extraVal}>{(Number(match.wides) || 0) + (Number(match.noBalls) || 0)}</Text>
                    <Text style={styles.extraLab}>Total</Text>
                </View>
            </View>
        </Surface>
    );

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderMOM()}
                {renderBattingScorecard()}
                {renderBowlingScorecard()}
                {renderExtras()}

                {match.notes ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Match Notes</Text>
                        <Surface style={styles.notesCard} elevation={1}>
                            <Text style={styles.notesText}>{match.notes}</Text>
                        </Surface>
                    </View>
                ) : null}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    headerBanner: {
        backgroundColor: '#1e293b',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 25,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    matchHero: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
    },
    teamInfo: {
        alignItems: 'center',
        width: '30%',
    },
    teamName: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    vsContainer: {
        alignItems: 'center',
    },
    vsText: {
        color: '#94a3b8',
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 5,
    },
    resultChip: {
        height: 24,
    },
    resultChipText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    metaText: {
        color: '#94a3b8',
        fontSize: 12,
    },
    scrollContent: {
        padding: 16,
    },
    momCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    momLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    momLabel: {
        color: '#f59e0b',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    momName: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    momStats: {
        alignItems: 'flex-end',
    },
    momStatText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    momStatSub: {
        color: '#94a3b8',
        fontSize: 12,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        overflow: 'hidden',
    },
    tableRowHeader: {
        flexDirection: 'row',
        backgroundColor: '#334155',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#334155',
        alignItems: 'center',
    },
    headerLabel: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    colName: {
        flex: 2,
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
    },
    colStat: {
        flex: 1,
        color: '#94a3b8',
        fontSize: 13,
        textAlign: 'center',
    },
    colStatBold: {
        flex: 1,
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    colStatHighlight: {
        flex: 1.2,
        color: '#60a5fa',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    extrasCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 25,
    },
    extrasTitle: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 15,
    },
    extrasGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    extraItem: {
        alignItems: 'center',
    },
    extraVal: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    extraLab: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 4,
    },
    extraDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#334155',
        alignSelf: 'center',
    },
    notesCard: {
        backgroundColor: '#1e293b',
        borderRadius: 15,
        padding: 15,
    },
    notesText: {
        color: '#94a3b8',
        fontSize: 13,
        lineHeight: 20,
    }
});
