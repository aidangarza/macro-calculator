<script lang="ts">
  import { r, num, type CalorieBreakdown } from "$lib/utils";

  export let result: CalorieBreakdown;

  const keys = Object.keys(result) as Array<keyof CalorieBreakdown>;
  const stats = keys
    .map((key) => {
      const R = r(key);
      return {
        label: R.label,
        unit: R.unit,
        order: R.order,
        value: result[key],
      };
    })
    .sort((a, b) => a.order - b.order);
</script>

<dl class="flex flex-col space-y-2">
  {#each stats as { label, value, unit }, i}
    <div class="flex space-x-2">
      <dt>{label}:</dt>
      <dd>
        {num(value)} <span class="opacity-60">{unit}</span>
      </dd>
    </div>
  {/each}
</dl>
