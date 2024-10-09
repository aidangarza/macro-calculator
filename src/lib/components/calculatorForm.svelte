<script lang="ts" context="module">
  import { z } from "zod";

  const isNumber = (v: string) => !isNaN(Number(v)) && v?.length > 0;
  const isGreaterThanZero = (v: string) => Number(v) > 0;

  export const calculatorSchema = z.object({
    useMetric: z.boolean().default(false),
    age: z.string().refine(isNumber).refine(isGreaterThanZero),
    height: z.string().refine(isNumber).refine(isGreaterThanZero),
    weight: z.string().refine(isNumber).refine(isGreaterThanZero),
    activityLevel: z.array(z.number().min(0).max(4)).default([2]),
  });

  export type CalculatorSchema = z.infer<typeof calculatorSchema>;
  export type OnSubmit = (form: CalculatorSchema) => void;
</script>

<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import { getActivityLevel } from "$lib/utils";
  import type { SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms/client";
  import Slider from "./ui/slider/slider.svelte";
  import Switch from "./ui/switch/switch.svelte";

  export let data: SuperValidated<CalculatorSchema>;
  export let onSubmit: OnSubmit;

  const form = superForm(data, {
    SPA: true,
    validators: zodClient(calculatorSchema),
    onUpdate({ form: updatedForm }) {
      if (updatedForm.valid) {
        onSubmit(updatedForm.data);
      } else {
        form.errors.set(updatedForm.errors);
      }
    },
    resetForm: false,
  });

  const { form: formData, errors, enhance } = form;

  const labels = {
    age: "Age",
    height: "Height",
    weight: "Weight",
    useMetric: "Use metric",
  };

  const units = {
    US: { height: "inches", weight: "lbs" },
    metric: { height: "cm", weight: "kg" },
  };
</script>

<form method="POST" use:enhance class="space-y-4">
  <Form.Field {form} name="age">
    <Form.Control let:attrs>
      <div class="flex items-center space-x-2">
        <Input
          {...attrs}
          bind:value={$formData.age}
          placeholder="Your age"
          type="number"
        />
        <span class="w-16">years</span>
      </div>
    </Form.Control>
  </Form.Field>
  <Form.Field {form} name="height">
    <Form.Control let:attrs>
      <div class="flex items-center space-x-2">
        <Input
          {...attrs}
          bind:value={$formData.height}
          placeholder="Your height"
          type="number"
        />
        <span class="w-16"
          >{units[$formData.useMetric ? "metric" : "US"].height}</span
        >
      </div>
    </Form.Control>
  </Form.Field>
  <Form.Field {form} name="weight">
    <Form.Control let:attrs>
      <div class="flex items-center space-x-2">
        <Input
          {...attrs}
          bind:value={$formData.weight}
          placeholder="Your weight"
          type="number"
        />
        <span class="w-16"
          >{units[$formData.useMetric ? "metric" : "US"].weight}</span
        >
      </div>
    </Form.Control>
  </Form.Field>
  <Form.Field {form} name="activityLevel">
    <Form.Control let:attrs>
      <Form.Label
        >Your activity level: {getActivityLevel($formData.activityLevel[0])
          .label}<br />
        <span class="opacity-60 whitespace-nowrap"
          >({getActivityLevel($formData.activityLevel[0]).description})</span
        ></Form.Label
      >
      <Slider
        {...attrs}
        bind:value={$formData.activityLevel}
        min={0}
        max={4}
        step={1}
      />
    </Form.Control>
  </Form.Field>
  <div class="flex justify-between items-center pt-3">
    <Button type="submit">Submit</Button>
    <Form.Field {form} name="useMetric">
      <Form.Control let:attrs>
        <div class="flex items-center space-x-2">
          <Form.Label>Use metric</Form.Label>
          <Switch {...attrs} bind:checked={$formData.useMetric} />
        </div>
      </Form.Control>
    </Form.Field>
  </div>
</form>
