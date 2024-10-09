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

<dl class="flex flex-col space-y-2 w-full">
  {#each stats as { key, label, unit }, i}
    <div class="flex space-x-2 overflow-hidden">
      <dt class="flex-1 whitespace-nowrap overflow-hidden">
        {label}
        <span class="opacity-60">({unit})</span
        >...............................................
      </dt>
      <dd class="flex-none">
        <b>{num(result[key])}</b>
      </dd>
    </div>
  {/each}
</dl>
