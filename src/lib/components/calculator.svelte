<script lang="ts">
  import {
    default as Calculator,
    calculatorSchema,
    getHeight,
    type CalculatorSchema,
  } from "$lib/components/calculatorForm.svelte";
  import ResultBlock from "$lib/components/resultBlock.svelte";
  import * as Card from "$lib/components/ui/card";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { content } from "$lib/content";
  import { al, calorieBreakdown, type CalorieBreakdown } from "$lib/utils";
  import { onMount } from "svelte";
  import { zod } from "sveltekit-superforms/adapters";
  import type { SuperValidated } from "sveltekit-superforms/client";
  import { superValidate } from "sveltekit-superforms/client";

  // Result of the calculation for displying in the ResultBlock
  let result: CalorieBreakdown;

  const onSubmit = async (form: CalculatorSchema) => {
    result = calorieBreakdown({
      isMetric: form.useMetric,
      isFemale: form.isFemale,
      age: Number(form.age),
      weight: Number(form.weight),
      height: getHeight(form),
      activityLevel: al(form.activityLevel).value,
    });
  };

  // Form objet to pass into the Calculator
  let data: SuperValidated<CalculatorSchema>;

  onMount(async () => {
    data = await superValidate(zod(calculatorSchema));
  });
</script>

{#if data}
  <Card.Card class="w-full max-w-sm">
    <Card.Header>
      <Card.Title>{content.title}</Card.Title>
    </Card.Header>
    <Card.CardContent>
      <Calculator {data} {onSubmit} />
    </Card.CardContent>
    {#if result}
      <Separator />
      <Card.CardFooter class="pt-6">
        <ResultBlock {result} />
      </Card.CardFooter>
    {/if}
  </Card.Card>
  <div class="mt-2">
    Built with ❤️ by <a href="https://f80.dev" target="_blank" rel="noopener"
      ><span class="font-bold">F80</span>.dev</a
    >
  </div>
{/if}
