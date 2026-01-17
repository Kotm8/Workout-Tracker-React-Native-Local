import WorkoutTypeCard from '@/components/ui/profile/WorkoutTypeCard';
import { addBaseWorkout, loadSettings, removeBaseWorkout, removeWorkoutOption, upsertWorkoutOption, WorkoutOption } from '@/services/workoutsOptions';
import React, { useEffect, useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput } from 'react-native';

export function profile() {
	const [workoutOptions, setWorkoutOptions] = useState<WorkoutOption[]>([]);
	const [newLabel, setNewLabel] = useState("");

	useEffect(() => {
		(async () => {
			const settings = await loadSettings();
			setWorkoutOptions(settings.workoutOptions);
		})();
	}, []);

	const handleAdd = async () => {
		if (!newLabel.trim()) return;

		const option: WorkoutOption = {
			value: newLabel.trim(),
			color: "#ffffff",
			baseworkouts: [],
		};

		const updated = await upsertWorkoutOption(option);
		setWorkoutOptions(updated.workoutOptions);
		setNewLabel("");
	};

	const handleRemove = async (value: string) => {
		const updated = await removeWorkoutOption(value);
		setWorkoutOptions(updated.workoutOptions);
	};

	return (
		<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120, 
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ marginBottom: 12 }}>Workout Options</Text>

        {workoutOptions.map(option => (
          <WorkoutTypeCard
            key={option.value}
            option={option}
            onDelete={async (value) => {
              const updated = await removeWorkoutOption(value);
              setWorkoutOptions(updated.workoutOptions);
            }}
            onUpdate={async (updatedOption) => {
              const updated = await upsertWorkoutOption(updatedOption);
              setWorkoutOptions(updated.workoutOptions);
            }}
            onAddBase={async (type, workout) => {
              const updated = await addBaseWorkout(type, workout);
              setWorkoutOptions(updated.workoutOptions);
            }}
            onRemoveBase={async (type, workout) => {
              const updated = await removeBaseWorkout(type, workout);
              setWorkoutOptions(updated.workoutOptions);
            }}
          />
        ))}

        <TextInput
          value={newLabel}
          onChangeText={setNewLabel}
          placeholder="Add workout type"
          style={{
            borderWidth: 1,
            marginTop: 16,
            padding: 8,
            borderRadius: 8,
          }}
        />

        <Button title="Add" onPress={async () => {
          if (!newLabel.trim()) return;

          const option: WorkoutOption = {
            value: newLabel.trim(),
            color: "#FFFFFF",
            baseworkouts: [],
          };

          const updated = await upsertWorkoutOption(option);
          setWorkoutOptions(updated.workoutOptions);
          setNewLabel("");
        }} />
      </ScrollView>
    </KeyboardAvoidingView>
	);
}

export default profile