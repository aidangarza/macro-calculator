const defaultContent = {
  version: "1.0.0",
  title: "Macro Calculator",
  form: {
    sex: {
      label: "Your biological Sex",
      options: {
        female: { label: "Female" },
        male: { label: "Male" },
      },
    },
    age: {
      placeholder: "Your age",
      unit: "years",
    },
    height: {
      placeholder: "Your height",
      units: {
        cm: "cm",
        ft: "ft",
        in: "in",
      },
    },
    weight: {
      placeholder: "Your weight",
      units: {
        metric: "kg",
        imperial: "lbs",
      },
    },
    activityLevel: {
      label: "Your activity level",
      defaultIndex: 2,
      options: [
        {
          label: "little to no exercise",
          value: 1.2,
        },
        {
          label: "light exercise 1-3 times per week (low impact walking)",
          value: 1.375,
        },
        {
          label:
            "intense exercise 1-3 times per week (HIIT style, app workouts)",
          value: 1.55,
        },
        {
          label: "light exercise 4-5 times per week (low impact walking)",
          value: 1.55,
        },
        {
          label:
            "intense exercise 3-4 times per week (HIIT style, app workouts)",
          value: 1.725,
        },
        {
          label: "intense exercise 5+ days per week (HIIT style, app workouts)",
          value: 1.9,
        },
      ],
    },
    goal: {
      label: "Your goal",
      defaultIndex: 2,
      options: [
        {
          label: "lose about 1lb per week",
          value: -500,
        },
        {
          label: "lose about 0.5lb per week",
          value: -250,
        },
        {
          label: "recomposition / maintain current weight",
          value: 0,
        },
        {
          label: "gain about 0.5lb per week",
          value: 250,
        },
        {
          label: "gain about 1lb per week",
          value: 500,
        },
      ],
    },
    useMetric: {
      label: "Use metric",
    },
    button: {
      label: "Calculate",
    },
  },
  results: {
    title: "Your Results",
    calories: {
      label: "Calories",
      unit: "per day",
      order: 0,
      percentage: 0.95,
    },
    protein: {
      label: "Protein",
      unit: "grams per day",
      order: 1,
      percentage: 0.35,
    },
    carbs: {
      label: "Carbs",
      unit: "grams per day",
      order: 2,
      percentage: 0.33,
    },
    fat: {
      label: "Fat",
      unit: "grams per day",
      order: 3,
      percentage: 0.32,
    },
  },
};

declare global {
  interface Window {
    __macroCalculatorContent: Partial<typeof defaultContent>;
  }
}

function isPlainObject<T>(value: unknown): value is T {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Function)
  );
}

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = result[key];
      const sourceValue = source[key];

      if (
        isPlainObject<T>(targetValue) &&
        isPlainObject<Partial<T>>(sourceValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue) as T[Extract<
          keyof T,
          string
        >];
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

function getContent() {
  // Get any content that lives in a script tag
  const inputContent = window.__macroCalculatorContent;

  // If there's no content, or it's not an object, return the default content
  if (!inputContent || typeof inputContent !== "object") {
    // Save the content to the window object for future reference
    window.__macroCalculatorContent = defaultContent;

    return defaultContent;
  }

  // Merge the default content with the input content
  const mergedContent = deepMerge(defaultContent, inputContent);

  // Check the calorie split
  const proteinSplit = mergedContent.results.protein.percentage;
  const carbsSplit = mergedContent.results.carbs.percentage;
  const fatSplit = mergedContent.results.fat.percentage;
  const totalSplit = proteinSplit + carbsSplit + fatSplit;
  if (totalSplit !== 1) {
    console.error(
      `The calorie split must add up to 1. The current sum is ${totalSplit}.`,
      {
        protein: proteinSplit,
        carbs: carbsSplit,
        fat: fatSplit,
      }
    );
  }

  // Save the merged content to the window object for future reference
  window.__macroCalculatorContent = mergedContent;

  // Return the merged content
  return mergedContent;
}

export const content = getContent();
