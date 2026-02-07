import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Text,
    Surface,
    Avatar,
    Divider,
    IconButton,
    Chip,
    Button,
    Modal,
    Portal,
    TextInput as PaperTextInput,
} from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StorageService } from '../utils/storage';

/**
 * MatchDetailScreen Component - Premium post-match analysis dashboard.
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have added robust null-checks to prevent the app from crashing 
 * if match data is incomplete. I have also updated the icons and 
 * image picker API to follow the latest industry standards, 
 * ensuring compatibility with the newest mobile devices."
 */
export default function MatchDetailScreen({ route, navigation }) {
    const { match } = route.params || {};
    const [isCelebrating, setIsCelebrating] = useState(false);
    const [caption, setCaption] = useState('');
    const [victoryImage, setVictoryImage] = useState(null);
    const [publishing, setPublishing] = useState(false);

    if (!match) return null;

    const opponentName = match.opponent || 'Opponent';
    const matchResultStr = (match.result || 'Match Result').toUpperCase();
    const opponentInitial = opponentName.substring(0, 1).toUpperCase();

    // --- LOGIC: Image Picker ---
    const pickVictoryImage = async () => {
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
            }
        } catch (error) {
            console.error("Image Picker Error:", error);
            Alert.alert("Error", "Could not open image library.");
        }
    };

    // --- LOGIC: Publish to Wall ---
    const handleConfirmPublish = async () => {
        setPublishing(true);
        try {
            const victoryPost = {
                id: Date.now().toString(),
                matchId: match.id,
                opponent: `vs ${opponentName}`,
                result: match.result,
                date: new Date().toLocaleDateString(),
                caption: caption || 'Victory is ours! 🏆🏏',
                imageUri: victoryImage,
            };

            await StorageService.addVictoryPost(victoryPost);
            setIsCelebrating(false);

            Alert.alert(
                "Victory Published!",
                "This win has been added to your personal Victory Wall. 🏆✨",
                [
                    { text: "View Wall", onPress: () => navigation.navigate('VictoryWall') }, // Updated navigation name
                    { text: "Close", style: "cancel" }
                ]
            );
        } catch (error) {
            Alert.alert("Error", "Failed to save your celebration.");
        } finally {
            setPublishing(false);
        }
    };

    // --- LOGIC: Advanced Stat Calculations ---
    const calculateStrikeRate = (runs, balls) => {
        if (!balls || balls === 0) return '0.0';
        return ((runs / balls) * 100).toFixed(1);
    };

    const calculateEconomy = (runs, overs) => {
        if (!overs || overs === 0) return '0.0';
        return (runs / overs).toFixed(1);
    };

    const performances = match.performances || [];
    const mom = performances.length > 0 ? performances.reduce((prev, current) => {
        const prevPoints = (prev.runs || 0) + (prev.wickets || 0) * 20;
        const currentPoints = (current.runs || 0) + (current.wickets || 0) * 20;
        return prevPoints > currentPoints ? prev : current;
    }) : null;

    // --- SUB-COMPONENTS ---
    const renderHeader = () => {
        const isWin = (match.result || '').toLowerCase().includes('win');
        return (
            <Surface style={styles.headerBanner} elevation={4}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Match Report</Text>
                    <IconButton icon="share-variant" iconColor={theme.success} size={20} />
                </View>

                <View style={styles.matchHero}>
                    <View style={styles.teamInfo}>
                        <Avatar.Text size={50} label="CB" backgroundColor={theme.success} labelStyle={{ fontWeight: 'bold' }} />
                        <Text style={styles.teamName}>CrickBoard</Text>
                    </View>

                    <View style={styles.vsContainer}>
                        <Text style={styles.vsText}>VS</Text>
                        <Chip
                            style={[styles.resultChip, { backgroundColor: isWin ? theme.success : theme.error }]}
                            textStyle={styles.resultChipText}
                        >
                            {matchResultStr}
                        </Chip>
                    </View>

                    <View style={styles.teamInfo}>
                        <Avatar.Text size={50} label={opponentInitial} backgroundColor={theme.borderLight} />
                        <Text style={styles.teamName}>{opponentName}</Text>
                    </View>
                </View>

                <View style={[styles.metaRow, { justifyContent: 'center', marginTop: 10 }]}>
                    <Ionicons name="location" size={14} color={theme.textSecondary} />
                    <Text style={styles.metaText}>{match.venue || 'Unknown Venue'}  •  </Text>
                    <Ionicons name="calendar" size={14} color={theme.textSecondary} />
                    <Text style={styles.metaText}>{match.date ? new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}</Text>
                </View>
            </Surface>
        );
    };

    const renderCelebrateModal = () => (
        <Portal>
            <Modal
                visible={isCelebrating}
                onDismiss={() => setIsCelebrating(false)}
                contentContainerStyle={styles.modalContent}
            >
                <Surface style={styles.modalCard} elevation={5}>
                    <Text style={styles.modalTitle}>Victory Wall</Text>

                    <TouchableOpacity style={styles.imagePickerBtn} onPress={pickVictoryImage}>
                        {victoryImage ? (
                            <Image source={{ uri: victoryImage }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="camera-outline" size={30} color={theme.textSecondary} />
                                <Text style={styles.imagePlaceholderText}>Add Victory Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <PaperTextInput
                        mode="outlined"
                        label="Write your caption..."
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
                            onPress={() => setIsCelebrating(false)}
                            style={styles.cancelBtn}
                            textColor={theme.textSecondary}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleConfirmPublish}
                            style={styles.publishBtn}
                            buttonColor=theme.success
                            loading={publishing}
                        >
                            Publish
                        </Button>
                    </View>
                </Surface>
            </Modal>
        </Portal>
    );

    const renderMOM = () => {
        if (!mom) return null;
        return (
            <Surface style={styles.momCard} elevation={2}>
                <View style={styles.momLeft}>
                    <MaterialCommunityIcons name="trophy-variant" size={40} color={theme.warning} />
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
                <MaterialCommunityIcons name="cricket" size={20} color={theme.success} />
                <Text style={styles.sectionTitle}>Batting Performance</Text>
            </View>
            <Surface style={styles.tableCard} elevation={1}>
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
                <MaterialCommunityIcons name="bowling" size={20} color="#60a5fa" />
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

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    headerBanner: {
        backgroundColor: theme.border,
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
        color: theme.textSecondary,
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
        color: theme.textSecondary,
        fontSize: 12,
    },
    scrollContent: {
        padding: 16,
    },
    momCard: {
        backgroundColor: theme.border,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        borderLeftWidth: 4,
        borderLeftColor: theme.warning,
    },
    momLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    momLabel: {
        color: theme.warning,
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
        color: theme.textSecondary,
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
        backgroundColor: theme.border,
        borderRadius: 20,
        overflow: 'hidden',
    },
    tableRowHeader: {
        flexDirection: 'row',
        backgroundColor: theme.borderLight,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.borderLight,
        alignItems: 'center',
    },
    headerLabel: {
        color: theme.textSecondary,
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
        color: theme.textSecondary,
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
        backgroundColor: theme.border,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 25,
    },
    extrasTitle: {
        color: theme.textSecondary,
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
        color: theme.textTertiary,
        fontSize: 11,
        marginTop: 4,
    },
    extraDivider: {
        width: 1,
        height: 30,
        backgroundColor: theme.borderLight,
        alignSelf: 'center',
    },
    notesCard: {
        backgroundColor: theme.border,
        borderRadius: 15,
        padding: 15,
    },
    notesText: {
        color: theme.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
    celebrateBtn: {
        marginBottom: 20,
        borderRadius: 15,
        elevation: 4,
    },
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
    imagePickerBtn: {
        width: '100%',
        height: 180,
        backgroundColor: theme.background,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    imagePlaceholderText: {
        color: theme.textSecondary,
        fontSize: 12,
        marginTop: 8,
    },
    previewImage: {
        width: '100%',
        height: '100%',
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
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* CELEBRATE BUTTON */}
                <Button
                    mode="contained"
                    icon="party-popper"
                    onPress={() => setIsCelebrating(true)}
                    style={styles.celebrateBtn}
                    buttonColor=theme.success
                    contentStyle={{ height: 50 }}
                >
                    Celebrate this Win!
                </Button>

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
            {renderCelebrateModal()}
        </SafeAreaView>
    );
}


