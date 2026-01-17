import { File, Paths } from "expo-file-system/next";

export type WorkoutOption = {
  value: string;
  color: string;
  baseworkouts: string[]
};

export type Settings = {
  workoutOptions: WorkoutOption[];
};

const defaultSettings: Settings = {
  workoutOptions: [
    { value: "Push", color: "#F7C8C8", baseworkouts: [] },
    { value: "Pull", color: "#F9E9A9", baseworkouts: [] },
    { value: "Legs", color: "#C9D8FF", baseworkouts: [] },
  ],
};

const file = new File(Paths.document, "settings.json");

function getDefaultColor(value: string) {
  switch (value) {
    case "Push": return "#F7C8C8";
    case "Pull": return "#F9E9A9";
    case "Legs": return "#C9D8FF";
    default: return "#CCCCCC";
  }
}

async function ensureFile() {
  try {
    const info = await file.info();
    if (!info.exists) {
      await file.write(JSON.stringify(defaultSettings, null, 2));
    }
  } catch (err) {
    await file.write(JSON.stringify(defaultSettings, null, 2));
  }
}

export async function loadSettings(): Promise<Settings> {
  await ensureFile();
  const text = await file.text();

  if (!text) return defaultSettings;

  const parsed = JSON.parse(text);
  const loadedOptions: WorkoutOption[] =
    parsed.workoutOptions ?? defaultSettings.workoutOptions;

  const finalOptions = loadedOptions.map((o) => ({
    value: o.value,
    color: o.color ?? getDefaultColor(o.value),
    baseworkouts: Array.isArray(o.baseworkouts) ? o.baseworkouts : [],
  }));

  return { workoutOptions: finalOptions };
}


export async function saveSettings(settings: Settings): Promise<void> {
  await file.write(JSON.stringify(settings, null, 2));
}

export async function upsertWorkoutOption(option: WorkoutOption): Promise<Settings> {
  const settings = await loadSettings();
  const idx = settings.workoutOptions.findIndex(o => o.value === option.value);

  if (idx === -1) {
    settings.workoutOptions.push(option);
  } else {
    settings.workoutOptions[idx] = option;
  }

  await saveSettings(settings);
  return settings;
}

export async function removeWorkoutOption(value: string): Promise<Settings> {
  const settings = await loadSettings();
  settings.workoutOptions = settings.workoutOptions.filter(o => o.value !== value);
  await saveSettings(settings);
  return settings;
}

export async function addBaseWorkout(optionValue: string, workout: string): Promise<Settings> {
  const settings = await loadSettings();

  const opt = settings.workoutOptions.find(o => o.value === optionValue);
  if (!opt) throw new Error(`Workout option '${optionValue}' not found.`);

  if (!opt.baseworkouts.includes(workout)) {
    opt.baseworkouts.push(workout);
  }

  await saveSettings(settings);
  return settings;
}

export async function removeBaseWorkout(optionValue: string, workout: string): Promise<Settings> {
  const settings = await loadSettings();

  const opt = settings.workoutOptions.find(o => o.value === optionValue);
  if (!opt) throw new Error(`Workout option '${optionValue}' not found.`);

  opt.baseworkouts = opt.baseworkouts.filter(w => w !== workout);

  await saveSettings(settings);
  return settings;
}