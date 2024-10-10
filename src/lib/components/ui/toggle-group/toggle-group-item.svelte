<script lang="ts">
  import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
  import { type ToggleVariants, getToggleGroupCtx } from "./index.js";
  import { cn } from "$lib/utils.js";
  import { toggleVariants } from "$lib/components/ui/toggle/index.js";

  type $$Props = ToggleGroupPrimitive.ItemProps & ToggleVariants;

  let className: string | undefined | null = undefined;

  export { className as class };
  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export let value: $$Props["value"];

  const ctx = getToggleGroupCtx();

  $: hasError = $$restProps["data-fs-error"];

  console.log(hasError);
</script>

<ToggleGroupPrimitive.Item
  class={cn(
    toggleVariants({
      variant: ctx.variant || variant,
      size: ctx.size || size,
    }),
    $hasError && "ring-2 ring-offset-2 ring-destructive",
    className
  )}
  {value}
  {...$$restProps}
>
  <slot />
</ToggleGroupPrimitive.Item>
