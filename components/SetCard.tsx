import { colors } from '@/assets/colors';
import { ExerciseSet } from '@/interfaces/interfaces';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

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
		setReps(parseInt(text));
		const numericValue = parseInt(text) || 0;
		onChange?.({ ...exerciseSet, reps: numericValue });
	};

	const handleWeightChange = (text: string) => {
		setWeight(parseFloat(text));
		const numericValue = parseFloat(text) || 0;
		onChange?.({ ...exerciseSet, weight: numericValue });
	};

	return (
		<View className="flex-row mb-2 mt-2 items-center">
			{isFirst ? (
				<View className="p-2 w-[10%] rounded-lg opacity-0">
					<Text className="text-lg">⊖</Text>
				</View>
			) : (
				<TouchableOpacity
					onPress={onRemove}
					className="w-[10%] p-2 rounded-lg items-center"
					style={{ backgroundColor: colors.workout[workoutType as keyof typeof colors.workout] || colors.primary }}
				>
					<Text className="text-white font-bold text-lg">⊖</Text>
				</TouchableOpacity>
			)}
			<Text className="text-white text-xl ml-5 font-bold">
				Reps
			</Text>
			<TextInput
				placeholder="Reps"
				value={String(reps)}
				onChangeText={(text) => setReps(Number(text))}
				onBlur={() => handleRepsChange(String(reps))}
				placeholderTextColor="#ffffff"
				className='flex-1 ml-2 text-white pb-1 w-[15%] border p-1 text-center'
				style={{
					borderColor: colors.workout[workoutType as keyof typeof colors.workout] || colors.primary
				}}
				keyboardType="numeric"
			/>
			<Text className="text-white text-xl ml-5 font-bold">-</Text>
			<TextInput
				placeholder="Weight"
				value={String(weight)}
				onChangeText={(text) => setWeight(Number(text))}
				onBlur={() => handleWeightChange(String(weight))}
				placeholderTextColor="#ffffff"
				className='flex-1 ml-2 text-white pb-1 w-[15%] border p-1 text-center'
				style={{
					borderColor: colors.workout[workoutType as keyof typeof colors.workout] || colors.primary
				}}
				keyboardType="numeric"
			/>
			<Text className="text-white text-xl ml-5 mr-5 font-bold">
				Kg
			</Text>
		</View>
	)
}

export default SetCard