import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CreateTournamentScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [tournamentName, setTournamentName] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('round-robin');
    const [selectedTeams, setSelectedTeams] = useState(4);

    const formats = [
        { id: 'round-robin', name: 'Round Robin', icon: 'refresh-circle-outline' },
        { id: 'knockout', name: 'Knockout', icon: 'git-network-outline' },
        { id: 'league', name: 'League', icon: 'list-outline' },
    ];

    const teamOptions = [4, 6, 8, 12, 16];

    const handleCreate = () => {
        if (!tournamentName.trim()) {
            Alert.alert('Error', 'Please enter a tournament name');
            return;
        }
        Alert.alert('Success', 'Tournament created!', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            padding: 16,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 12,
        },
        input: {
            backgroundColor: theme.backgroundCard,
            borderWidth: 1,
            borderColor: theme.borderLight,
            borderRadius: 8,
            padding: 16,
            fontSize: 16,
            color: theme.text,
        },
        optionCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.backgroundCard,
            borderWidth: 1,
            borderColor: theme.borderLight,
            borderRadius: 8,
            padding: 16,
            marginBottom: 8,
        },
        optionCardSelected: {
            borderColor: theme.primary,
            backgroundColor: theme.border,
        },
        optionText: {
            fontSize: 16,
            color: theme.text,
            marginLeft: 12,
            flex: 1,
        },
        optionTextSelected: {
            color: theme.primary,
            fontWeight: '600',
        },
        teamOptions: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        teamOption: {
            width: 60,
            height: 60,
            backgroundColor: theme.backgroundCard,
            borderWidth: 1,
            borderColor: theme.borderLight,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        teamOptionSelected: {
            borderColor: theme.primary,
            backgroundColor: theme.border,
        },
        teamOptionText: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.text,
        },
        teamOptionTextSelected: {
            color: theme.primary,
        },
        createButton: {
            backgroundColor: theme.primary,
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 32,
        },
        createButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tournament Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter tournament name"
                    placeholderTextColor={theme.textTertiary}
                    value={tournamentName}
                    onChangeText={setTournamentName}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Format</Text>
                {formats.map(format => (
                    <TouchableOpacity
                        key={format.id}
                        style={[
                            styles.optionCard,
                            selectedFormat === format.id && styles.optionCardSelected
                        ]}
                        onPress={() => setSelectedFormat(format.id)}
                    >
                        <Ionicons
                            name={format.icon}
                            size={24}
                            color={selectedFormat === format.id ? theme.primary : theme.textTertiary}
                        />
                        <Text style={[
                            styles.optionText,
                            selectedFormat === format.id && styles.optionTextSelected
                        ]}>
                            {format.name}
                        </Text>
                        {selectedFormat === format.id && (
                            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Number of Teams</Text>
                <View style={styles.teamOptions}>
                    {teamOptions.map(count => (
                        <TouchableOpacity
                            key={count}
                            style={[
                                styles.teamOption,
                                selectedTeams === count && styles.teamOptionSelected
                            ]}
                            onPress={() => setSelectedTeams(count)}
                        >
                            <Text style={[
                                styles.teamOptionText,
                                selectedTeams === count && styles.teamOptionTextSelected
                            ]}>
                                {count}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                <Text style={styles.createButtonText}>Create Tournament</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CreateTournamentScreen;
