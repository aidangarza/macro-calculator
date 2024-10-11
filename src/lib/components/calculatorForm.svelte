<script lang="ts" context="module">
  import { z } from "zod";

  const params = getOptionParameters();

  const isNumber = (v: string) => !isNaN(Number(v)) && v?.length > 0;
  const isNumberError = { message: "Please enter a valid number" };
  const isGreaterThanZero = (v: string) => Number(v) > 0;
  const isGreaterThanZeroError = {
    message: "Please enter a number greater than 0",
  };
  const isLessThanTwelve = (v: string) => Number(v) < 12;
  const isLessThanTwelveError = {
    message: "Please enter a number less than 12",
  };

  export const calculatorSchema = z.object({
    useMetric: z.boolean().default(false),
    sex: z.enum(["male", "female"]).default("female"),
    age: z
      .string()
      .refine(isNumber, isNumberError)
      .refine(isGreaterThanZero, isGreaterThanZeroError),
    height: z
      .string()
      .refine(isNumber, isNumberError)
      .refine(isGreaterThanZero, isGreaterThanZeroError),
    heightInInches: z
      .string()
      .refine(isNumber, isNumberError)
      .refine(isGreaterThanZero, isGreaterThanZeroError)
      .refine(isLessThanTwelve, isLessThanTwelveError)
      .optional(),
    weight: z
      .string()
      .refine(isNumber, isNumberError)
      .refine(isGreaterThanZero, isGreaterThanZeroError),
    activityLevel: z
      .number()
      .min(0)
      .max(params.activityLevel.max)
      .default(params.activityLevel.default),
    goal: z.number().min(0).max(params.goal.max).default(params.goal.default),
  });

  export const getHeight = (data: CalculatorSchema) =>
    data.useMetric
      ? Number(data.height)
      : Number(data.height) * 12 + Number(data.heightInInches ?? 0);

  export type CalculatorSchema = z.infer<typeof calculatorSchema>;
  export type OnSubmit = (form: CalculatorSchema) => void;
</script>

<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import * as Select from "$lib/components/ui/select";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import { al, c, g, getOptionParameters } from "$lib/utils";
  import type { SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms/client";

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

  const { form: formData, enhance } = form;

  $: selectedActivityLevel = {
    label: al($formData.activityLevel).label,
    value: $formData.activityLevel,
  };
  $: selectedGoal = {
    label: g($formData.goal).label,
    value: $formData.goal,
  };
</script>

<form method="POST" use:enhance class="space-y-4">
  <Form.Field {form} name="sex">
    <Form.Control let:attrs>
      <Form.Label>{c("sex").label}</Form.Label>
      <ToggleGroup.Root
        {...attrs}
        variant="outline"
        class="flex items-center space-x-2 w-[calc(100%-72px)]"
        bind:value={$formData.sex}
      >
        <ToggleGroup.Item value="female" class="flex-1"
          >{c("sex").options.female.label}</ToggleGroup.Item
        >
        <ToggleGroup.Item value="male" class="flex-1"
          >{c("sex").options.male.label}</ToggleGroup.Item
        >
      </ToggleGroup.Root>
    </Form.Control>
  </Form.Field>
  <Form.Field {form} name="age">
    <Form.Control let:attrs>
      <div class="flex items-center space-x-2">
        <Input
          {...attrs}
          bind:value={$formData.age}
          placeholder={c("age").placeholder}
          type="number"
        />
        <span class="w-16 flex-none">{c("age").unit}</span>
      </div>
    </Form.Control>
  </Form.Field>
  {#if $formData.useMetric}
    <Form.Field {form} name="height">
      <Form.Control let:attrs>
        <div class="flex items-center space-x-2">
          <Input
            {...attrs}
            bind:value={$formData.height}
            placeholder={c("height").placeholder}
            type="number"
          />
          <span class="w-16 flex-none">{c("height").units.cm}</span>
        </div>
      </Form.Control>
    </Form.Field>
  {:else}
    <div class="flex items-center space-x-2">
      <Form.Field {form} name="height" class="flex-shrink">
        <Form.Control let:attrs>
          <div class="flex items-center space-x-2">
            <Input
              {...attrs}
              bind:value={$formData.height}
              placeholder={c("height").placeholder}
              type="number"
            />
            <span>{c("height").units.ft}</span>
          </div>
        </Form.Control>
      </Form.Field>
      <Form.Field {form} name="heightInInches" class="flex-shrink">
        <Form.Control let:attrs>
          <div class="flex items-center space-x-2">
            <Input
              {...attrs}
              bind:value={$formData.heightInInches}
              type="number"
            />
          </div>
        </Form.Control>
      </Form.Field>
      <span class="w-16 flex-none">{c("height").units.in}</span>
    </div>
  {/if}
  <Form.Field {form} name="weight">
    <Form.Control let:attrs>
      <div class="flex items-center space-x-2">
        <Input
          {...attrs}
          bind:value={$formData.weight}
          placeholder={c("weight").placeholder}
          type="number"
        />
        <span class="w-16 flex-none"
          >{c("weight").units[
            $formData.useMetric ? "metric" : "imperial"
          ]}</span
        >
      </div>
    </Form.Control>
  </Form.Field>
  <Form.Field {form} name="activityLevel">
    <Form.Control let:attrs>
      <Select.Root
        selected={selectedActivityLevel}
        onSelectedChange={(s) => {
          s && ($formData.activityLevel = s.value);
        }}
      >
        <Select.Trigger {...attrs}>
          <Select.Value placeholder={c("activityLevel").label} />
        </Select.Trigger>
        <Select.Content>
          {#each c("activityLevel").options as { label }, value}
            <Select.Item {value}>{label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <input hidden bind:value={$formData.activityLevel} name={attrs.name} />
    </Form.Control>
  </Form.Field>
  <Form.Field {form} name="goal">
    <Form.Control let:attrs>
      <Select.Root
        selected={selectedGoal}
        onSelectedChange={(s) => {
          s && ($formData.goal = s.value);
        }}
      >
        <Select.Trigger {...attrs}>
          <Select.Value placeholder={c("goal").label} />
        </Select.Trigger>
        <Select.Content>
          {#each c("goal").options as { label }, value}
            <Select.Item {value}>{label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <input hidden bind:value={$formData.goal} name={attrs.name} />
    </Form.Control>
  </Form.Field>
  <div class="flex justify-between items-center pt-3">
    <Button type="submit">{c("button").label}</Button>
    <Form.Field {form} name="useMetric">
      <Form.Control let:attrs>
        <div class="flex items-center space-x-2">
          <Form.Label>{c("useMetric").label}</Form.Label>
          <Switch {...attrs} bind:checked={$formData.useMetric} />
        </div>
      </Form.Control>
    </Form.Field>
  </div>
</form>
