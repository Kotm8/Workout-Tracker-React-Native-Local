import { colors } from '@/assets/colors';
import { faceIcons } from '@/constants/icons';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

const FaceRadioCard = ({ exerciseLevel, onChange, workoutType }:
	{
		exerciseLevel: number;
		onChange?: (updateLevel: number) => void;
		workoutType?: string;
	}) => {

	const [level, setLevel] = useState(exerciseLevel);

	useEffect(() => {
		setLevel(exerciseLevel);
	}, [exerciseLevel]);

	const handleLevelChange = (newLevel: number) => {
		setLevel(newLevel);
		onChange?.(newLevel);
	};

	return (
		<View className="flex-row mb-2 mt-5 justify-around items-center">
			{faceIcons.map((icon) => (
				<TouchableOpacity key={icon.id} onPress={() => handleLevelChange(icon.id)}>
					<Image
						source={icon.src}
						style={{
							width: 40,
							height: 40,
							borderWidth: level === icon.id ? 5 : 0,
							borderColor: colors.workout[workoutType as keyof typeof colors.workout] || colors.primary,
							borderRadius: 20,
						}}
					/>
				</TouchableOpacity>
			))}
		</View>
	)
}

export default FaceRadioCard