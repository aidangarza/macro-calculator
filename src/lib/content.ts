const defaultContent = {
  title: "Macro Calculator",
  form: {
    isFemale: {
      label: "Your biological Sex",
      options: [
        {
          label: "Female",
          value: true,
        },
        { label: "Male", value: false },
      ],
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
      label: "Your activity Level: ",
      options: [
        {
          label: "sedentary",
          description: "little to no exercise",
          value: 1.2,
        },
        {
          label: "light",
          description: "exercise 1-3 times per week",
          value: 1.375,
        },
        {
          label: "moderate",
          description: "exercise 4-5 times per week",
          value: 1.55,
        },
        {
          label: "active",
          description: "exercise daily or intensely 3-4 times per week",
          value: 1.725,
        },
        {
          label: "very active",
          description: "intense daily exercise",
          value: 1.9,
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
    },
    protein: {
      label: "Protein",
      unit: "grams per day",
      order: 1,
    },
    carbs: {
      label: "Carbs",
      unit: "grams per day",
      order: 2,
    },
    fat: {
      label: "Fat",
      unit: "grams per day",
      order: 3,
    },
  },
};

declare global {
  interface Window {
    __macroCalculatorContent: Partial<typeof defaultContent>;
  }
}

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = result[key];
      const sourceValue = source[key];

      if (
        targetValue &&
        typeof targetValue === "object" &&
        sourceValue &&
        typeof sourceValue === "object"
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
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
    return defaultContent;
  }

  // Merge the default content with the input content
  const mergedContent = deepMerge(defaultContent, inputContent);

  // Save the merged content to the window object for future reference
  window.__macroCalculatorContent = mergedContent;

  // Return the merged content
  return mergedContent;
}

export const content = getContent();
