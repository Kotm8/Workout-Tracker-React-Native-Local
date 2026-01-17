import { Colors } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const colorScheme = "light";

const ExerciseAddCard = ({ name, onPress }: { name: string; onPress: () => void }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {name !== "New Exercise" ? (
                <View style={styles.iconContainer}>
                    <MaterialIcons name="undo" size={22} color="black" />
                </View>
            ) : null}

            <Text style={styles.label} numberOfLines={1}>{name}</Text>
        </TouchableOpacity>
    );
};

export default ExerciseAddCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors[colorScheme ?? 'light'].secondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors[colorScheme ?? 'light'].tint,
        padding: 12,
        marginVertical: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    label: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors[colorScheme ?? 'light'].text,
    },
});
