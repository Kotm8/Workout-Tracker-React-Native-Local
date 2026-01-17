import { labelColors } from '@/constants/theme';
import { WorkoutOption } from '@/services/workoutsOptions';
import React, { useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    option: WorkoutOption;
    onDelete: (value: string) => void;
    onUpdate: (updated: WorkoutOption) => void;
    onAddBase: (type: string, workout: string) => void;
    onRemoveBase: (type: string, workout: string) => void;
};

export default function WorkoutTypeCard({
    option,
    onDelete,
    onUpdate,
    onAddBase,
    onRemoveBase,
}: Props) {
    const [newBase, setNewBase] = useState("");
    const [colorModalVisible, setColorModalVisible] = useState(false);
    const handleLongPress = () => {
        Alert.alert(
            "Delete Workout",
            "Are you sure you want to delete this workout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(option.value) }
            ]
        )
    }
    return (

        <View style={styles.card}>
            <TouchableOpacity
                onLongPress={handleLongPress}
                delayLongPress={600}
            >
                <View style={styles.header}>
                    <Text style={styles.label}>{option.value}</Text>

                    {/* You will replace this with your real color picker */}
                    <TouchableOpacity
                        style={[styles.colorPreview, { backgroundColor: option.color }]}
                        onPress={() => setColorModalVisible(true)}
                    />
                </View>

                {/* Base workouts list */}
                <View style={{ marginTop: 8 }}>
                    <Text style={styles.sectionTitle}>Base Workouts:</Text>

                    {option.baseworkouts.map((w) => (
                        <View key={w} style={styles.baseWorkoutRow}>
                            <Text>• {w}</Text>
                            <Button
                                title="-"
                                onPress={() => onRemoveBase(option.value, w)}
                            />
                        </View>
                    ))}
                </View>

                {/* Add base workout */}
                <View style={styles.addRow}>
                    <TextInput
                        placeholder="Add base workout"
                        value={newBase}
                        onChangeText={setNewBase}
                        style={styles.input}
                    />
                    <Button
                        title="+"
                        onPress={() => {
                            if (!newBase.trim()) return;
                            onAddBase(option.value, newBase.trim());
                            setNewBase("");
                        }}
                    />
                </View>
            </TouchableOpacity>

            <Modal
                visible={colorModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setColorModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalBg}
                    activeOpacity={1}
                    onPressOut={() => setColorModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose a Color</Text>

                        <View style={styles.colorGrid}>
                            {labelColors.map((color) => {
                                const selected = option.color === color;

                                return (
                                    <TouchableOpacity
                                        key={color}
                                        onPress={() => {
                                            onUpdate({ ...option, color });
                                            setColorModalVisible(false);
                                        }}
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: color },
                                            selected && styles.selectedCircle,
                                        ]}
                                    >
                                        {selected && <View style={styles.innerDot} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#fff",
        elevation: 3,
        marginVertical: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 20,
        fontWeight: "600",
    },
    colorPreview: {
        width: 32,
        height: 32,
        borderRadius: 6,
        borderWidth: 1,
    },
    sectionTitle: {
        fontWeight: "600",
        marginBottom: 4,
    },
    baseWorkoutRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 4,
    },
    addRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        padding: 6,
        borderRadius: 6,
    },

    /** MODAL */
    modalBg: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },
    colorGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    colorCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#ccc",
    },
    selectedCircle: {
        borderColor: "#000",
        borderWidth: 3,
    },
    innerDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "rgba(0,0,0,0.45)",
    },
});
