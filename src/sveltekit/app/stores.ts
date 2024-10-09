// fake $app/stores export for svelte application imports

import type { Page } from "@sveltejs/kit";
import { readable, writable } from "svelte/store";

export const navigating = readable(false);

const baseUrl = "https://test.de";

export const page = writable<Page>({
  url: new URL("/", baseUrl),
  params: {},
  route: {
    id: "fake-route",
  },
  status: 200,
  error: null,
  data: {},
  state: {},
  form: null,
});
