import { faceIcons } from '@/constants/icons';
import { Exercise } from '@/interfaces/interfaces';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FaceRadioCard from './FaceRadioCard';
import SetCard from './SetCard';

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
		<View className='bg-secondary mt-5 rounded-lg p-2 overflow-hidden shadow-lg'>
			<View className="flex-row items-center">
				<TextInput
					placeholder="Exercise Name"
					value={name}
					onChangeText={setName}
					onBlur={() => onChange?.({ ...exercise, name, sets })}
					placeholderTextColor="#ffffff"
					className='flex-1 ml-2 text-white border-b border-gray-500 pb-1'
				/>
				{exercise.previousLevel && exercise.previousLevel > 0 && faceIcons[exercise.previousLevel - 1] ?
					<>
						<Text className='ml-2 text-white' >Previous: </Text>
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
						{(exercise.sets.length ?? 0) < 8 ? (
							<View className="flex-row justify-end mt-5">
								<TouchableOpacity
									onPress={handleAddNewSet}
									className="bg-blue-500 p-2 rounded-lg items-center w-[25%]"
								>
									<Text className="text-white font-bold text-lg">Add set</Text>
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

export default ExerciseCard