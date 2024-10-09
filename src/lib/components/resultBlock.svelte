<script lang="ts">
  import { r, num, type CalorieBreakdown } from "$lib/utils";

  export let result: CalorieBreakdown;

  const keys = Object.keys(result) as Array<keyof CalorieBreakdown>;
  const stats = keys
    .map((key) => {
      const R = r(key);
      return {
        key,
        label: R.label,
        unit: R.unit,
        order: R.order,
      };
    })
    .sort((a, b) => a.order - b.order);
</script>

<dl class="flex flex-col space-y-2">
  {#each stats as { key, label, unit }, i}
    <div class="flex space-x-2">
      <dt>{label}:</dt>
      <dd>
        {num(result[key])} <span class="opacity-60">{unit}</span>
      </dd>
    </div>
  {/each}
</dl>
