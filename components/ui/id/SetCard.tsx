import { Colors } from '@/constants/theme';
import { ExerciseSet } from '@/interfaces/interfaces';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const colorScheme = 'light'

const SetCard = ({ exerciseSet, onChange, workoutType, onRemove, isFirst }:
	{
		exerciseSet: ExerciseSet;
		onChange?: (updatedSet: ExerciseSet) => void;
		workoutType?: string;
		onRemove?: () => void;
		isFirst?: boolean;
	}) => {

	const [reps, setReps] = useState(exerciseSet.reps);
	const [weight, setWeight] = useState(exerciseSet.weight);

	useEffect(() => {
		setReps(exerciseSet.reps);
		setWeight(exerciseSet.weight);
	}, [exerciseSet]);

	const handleRepsChange = (text: string) => {
		setReps(text);
		onChange?.({ ...exerciseSet, reps: text });
	};

	const handleWeightChange = (text: string) => {
		setWeight(text);
		onChange?.({ ...exerciseSet, weight: text });
	};

	return (
		<View style={styles.container}>
			{isFirst ? (
				<View
					style={[styles.deleteButton, { opacity: 0 }]}>

					<MaterialIcons name="delete-outline" size={22} color="white" />
				</View>
			) : (
				<TouchableOpacity
					onPress={onRemove}
					style={styles.deleteButton}
				>
					<MaterialIcons name="delete-outline" size={22} color="white" />
				</TouchableOpacity>
			)}
			<Text style={styles.textField}>
				Reps
			</Text>
			<TextInput
				placeholder="Reps"
				value={String(reps)}
				onChangeText={(text) => setReps(text)}
				onBlur={() => handleRepsChange(String(reps))}
				style={styles.inputField}
				keyboardType="numeric"
			/>
			<Text style={[styles.textField, { marginRight: 10 }]}>-</Text>
			<TextInput
				placeholder="Weight"
				value={String(weight)}
				onChangeText={(text) => setWeight(text)}
				onBlur={() => handleWeightChange(String(weight))}
				style={styles.inputField}
				keyboardType="numeric"
			/>
			<Text style={[styles.textField, { marginRight: 20 }]}>
				Kg
			</Text>
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginBottom: 8,
		marginTop: 8,
		alignItems: 'center'
	},
	deleteButton: {
		width: '10%',
		padding: 8,
		borderRadius: 8,
		alignItems: 'center',
		backgroundColor: Colors[colorScheme ?? 'light'].tint,
		elevation: 3,
	},
	inputField: {
		flex: 1,
		marginLeft: 8,
		color: Colors[colorScheme ?? 'light'].text,
		paddingBottom: 4,
		width: '15%',
		borderWidth: 1,
		padding: 4,
		textAlign: 'center',
		borderColor: Colors[colorScheme ?? 'light'].tint,
	},
	textField: {
		color: Colors[colorScheme ?? 'light'].text,
		fontSize: 20,
		marginLeft: 20,
		fontWeight: 'bold'
	},
});
export default SetCard