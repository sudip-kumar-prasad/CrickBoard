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

const CreateTournamentScreen = ({ navigation }) => {
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tournament Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter tournament name"
                    placeholderTextColor="#64748b"
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
                            color={selectedFormat === format.id ? '#3b82f6' : '#64748b'}
                        />
                        <Text style={[
                            styles.optionText,
                            selectedFormat === format.id && styles.optionTextSelected
                        ]}>
                            {format.name}
                        </Text>
                        {selectedFormat === format.id && (
                            <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#e2e8f0',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#0b1223',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        color: '#e2e8f0',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0b1223',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
    },
    optionCardSelected: {
        borderColor: '#3b82f6',
        backgroundColor: '#1e293b',
    },
    optionText: {
        fontSize: 16,
        color: '#e2e8f0',
        marginLeft: 12,
        flex: 1,
    },
    optionTextSelected: {
        color: '#3b82f6',
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
        backgroundColor: '#0b1223',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamOptionSelected: {
        borderColor: '#3b82f6',
        backgroundColor: '#1e293b',
    },
    teamOptionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e2e8f0',
    },
    teamOptionTextSelected: {
        color: '#3b82f6',
    },
    createButton: {
        backgroundColor: '#3b82f6',
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

export default CreateTournamentScreen;
