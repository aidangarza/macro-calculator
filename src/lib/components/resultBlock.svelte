<script lang="ts">
  import { num, type CalorieBreakdown } from "$lib/utils";

  export let result: CalorieBreakdown;
</script>

<dl class="flex flex-col space-y-2">
  <div class="flex space-x-2">
    <dt>Calories:</dt>
    <dd>
      {num(result.calories)} <span class="opacity-60">per day</span>
    </dd>
  </div>
  <div class="flex space-x-2">
    <dt>Protein:</dt>
    <dd>
      {num(result.protein)} <span class="opacity-60">grams per day</span>
    </dd>
  </div>
  <div class="flex space-x-2">
    <dt>Carbs:</dt>
    <dd>
      {num(result.carbs)} <span class="opacity-60">grams per day</span>
    </dd>
  </div>
  <div class="flex space-x-2">
    <dt>Fat:</dt>
    <dd>
      {num(result.fat)} <span class="opacity-60">grams per day</span>
    </dd>
  </div>
</dl>
