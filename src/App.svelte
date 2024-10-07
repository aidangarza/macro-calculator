<script lang="ts">
  import "./app.css";
  import Calculator from "$lib/components/calculatorForm.svelte";
  import ResultBlock from "$lib/components/resultBlock.svelte";
  import * as Card from "$lib/components/ui/card";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { calorieBreakdown, type CalorieBreakdown } from "$lib/utils";

  export let data;

  let result: CalorieBreakdown;

  const onSubmit = async (form) => {
    console.log("submitted", form);

    result = calorieBreakdown({
      isMetric: form.useMetric,
      age: Number(form.age),
      weight: Number(form.weight),
      height: Number(form.height),
      activityLevel: form.activityLevel[0],
    });
  };
</script>

<div class="flex flex-col justify-center items-center">
  <Card.Card class="w-full max-w-sm">
    <Card.Header>
      <Card.Title>Macro Calculator</Card.Title>
    </Card.Header>
    <Card.CardContent>
      <Calculator data={data.form} {onSubmit} />
    </Card.CardContent>
    {#if result}
      <Separator />
      <Card.CardFooter class="pt-6">
        <ResultBlock {result} />
      </Card.CardFooter>
    {/if}
  </Card.Card>
  <div class="mt-2">
    Built with ❤️ by <a href="https://f80.dev"
      ><span class="font-bold">F80</span>.dev</a
    >
  </div>
</div>
