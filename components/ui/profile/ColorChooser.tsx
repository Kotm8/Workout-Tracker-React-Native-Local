import { labelColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';


interface ColorChooserProps {
  selected: string;
  onSelect: (color: string) => void;
}

export default function ColorChooser({ selected, onSelect }: ColorChooserProps)  {

    return (
        <View style={styles.grid}>
            {labelColors.map((color) => {
                const isSelected = selected === color;

                return (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorCircle,
                            { backgroundColor: color },
                            isSelected && styles.selectedCircle,
                        ]}
                        onPress={() => onSelect(color)}
                        activeOpacity={0.7}
                    >
                        {isSelected && <View style={styles.innerDot} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginTop: 10,
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginVertical: 10,
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
        backgroundColor: "rgba(0,0,0,0.5)",
    },
})