import { faceIcons } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { Exercise } from '@/interfaces/interfaces';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FaceRadioCard from './FaceRadioCard';
import SetCard from './SetCard';

const colorScheme = 'light'

const ExerciseCard = ({ exercise, workoutType, onChange }: { exercise: Exercise; workoutType?: string; onChange?: (updatedExercise: Exercise) => void; }) => {
	const [name, setName] = useState(exercise.name);
	const [sets, setSets] = useState(exercise.sets);
	const [level, setLevel] = useState(exercise.level);

	useEffect(() => {
		setName(exercise.name);
		setSets(exercise.sets);
		setLevel(exercise.level);
	}, [exercise]);

	const handleSetChange = (index: number, updatedSet: typeof sets[0]) => {
		const newSets = [...sets];
		newSets[index] = updatedSet;
		setSets(newSets);
		onChange?.({ ...exercise, name, sets: newSets });
	};

	const handleLevelChange = (updatedLevel: number) => {
		setLevel(updatedLevel);
		onChange?.({ ...exercise, name, level: updatedLevel });
	}

	const handleAddNewSet = async () => {
		if (!exercise) return;

		const newSet = {
			reps: sets[sets.length - 1].reps,
			weight: sets[sets.length - 1].weight
		};

		const newSets = [...sets, newSet];
		setSets(newSets);
		onChange?.({ ...exercise, name, sets: newSets });
	};

	const handleRemoveSet = (index: number) => {
		const newSets = sets.filter((_, i) => i !== index);
		setSets(newSets);
		onChange?.({ ...exercise, name, sets: newSets });
	};
	return (
		<View style={styles.container} >
			<View style={styles.topContainer} >
				<TextInput
					placeholder="Exercise Name"
					value={name}
					onChangeText={setName}
					onBlur={() => onChange?.({ ...exercise, name, sets })}
					placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
					style={styles.exerciseName}
				/>
				{exercise.previousLevel && exercise.previousLevel > 0 && faceIcons[exercise.previousLevel - 1] ?
					<>
						<Text style={styles.previousWorkoutText} >Previous: </Text>
						<Image
							source={faceIcons[exercise.previousLevel - 1].src}
							style={{ width: 30, height: 30 }}
						/>
					</>
					: null
				}
			</View>

			<FlatList
				data={sets}
				renderItem={({ item, index }) => (
					<>
						<SetCard
							exerciseSet={item}
							workoutType={workoutType}
							onChange={(updatedSet) => handleSetChange(index, updatedSet)}
							onRemove={() => handleRemoveSet(index)}
							isFirst={index === 0}
						/>
					</>
				)}
				keyExtractor={(_, index) => `set-${index}`}
				scrollEnabled={false}
				ListFooterComponent={
					<View>
						{(exercise.sets.length ?? 0) < 15 ? (
							<View style={styles.setView}>
								<TouchableOpacity
									onPress={handleAddNewSet}
									style={styles.addSetButton}
								>
									<Text style={styles.addSetButtonText}>Add set</Text>
								</TouchableOpacity>
							</View>
						) : null}

						<FaceRadioCard
							exerciseLevel={exercise.level}
							onChange={(updatedLevel) => handleLevelChange(updatedLevel)}
							workoutType={workoutType}
						/>
					</View>

				}
			/>
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors[colorScheme ?? 'light'].secondary,
		marginTop: 10,
		marginRight: 10,
		marginLeft: 10,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Colors[colorScheme ?? 'light'].tint,
		padding: 4,
		elevation: 3,
		//justifyContent: 'center',bg-secondary mt-5 rounded-lg p-2 overflow-hidden shadow-lg
		//alignItems: 'center',
	},
	topContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	exerciseName: {
		flex: 1,
		marginLeft: 8,
		marginRight: 8,
		color: Colors[colorScheme ?? 'light'].text,
		borderBottomWidth: 1,
		borderBottomColor: Colors[colorScheme ?? 'light'].icon,
		paddingBottom: 4,
		fontSize: 20
	},
	previousWorkoutText: {
		color: Colors[colorScheme ?? 'light'].text,
		fontSize: 20,
	},
	setView: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 20
	},
	addSetButton: {
		padding: 8,
		borderRadius: 8,
		alignItems: 'center',
		width: '25%',
		backgroundColor: Colors[colorScheme ?? 'light'].tint,
		elevation: 3,
	},
	addSetButtonText: {
		color: '#ffffff',
		fontWeight: 'bold',
		fontSize: 18
	}
})

export default ExerciseCard