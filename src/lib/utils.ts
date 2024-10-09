import { type ClassValue, clsx } from "clsx";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { twMerge } from "tailwind-merge";
import { content } from "$lib/content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number]
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

export type MSJArgs = {
  isMetric: boolean;
  age: number;
  height: number;
  weight: number;
  activityLevel: number;
};

export type CalorieBreakdown = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export const mifflinStJeor = ({
  isMetric,
  age,
  height,
  weight,
  activityLevel,
}: MSJArgs) => {
  let metricWeight = weight;
  let metricHeight = height;

  if (!isMetric) {
    metricWeight = weight * 0.453592;
    metricHeight = height * 2.54;
  }

  const bmr = 10 * metricWeight + 6.25 * metricHeight - 5 * age;
  return bmr * activityLevel;
};

export const calorieBreakdown = (args: MSJArgs): CalorieBreakdown => {
  const calories = mifflinStJeor(args);
  const protein = Math.round((calories * 0.35) / 4); // 1g of protein is 4 calories
  const carbs = Math.round((calories * 0.3) / 4); // 1g of carbs is 4 calories
  const fat = Math.round((calories * 0.35) / 9); // 1g of fat is 9 calories

  return { calories: Math.round(calories), protein, fat, carbs };
};

export const num = (number: number) => {
  return new Intl.NumberFormat().format(number);
};

// Form content
export function c<K extends keyof (typeof content)["form"]>(
  k: K
): (typeof content)["form"][K] {
  return content.form[k];
}

// Activity level option content
export function al([n]: number[]) {
  return c("activityLevel").options[n];
}

// Results content
export function r<K extends keyof (typeof content)["results"]>(
  k: K
): (typeof content)["results"][K] {
  return content.results[k];
}
