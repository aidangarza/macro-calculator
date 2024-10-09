import * as devalue from "devalue";

export const applyAction = (result) => {
  // Silence
};

function clone<T extends HTMLElement>(element: T): T {
  return HTMLElement.prototype.cloneNode.call(element) as T;
}
export function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) {
    parsed.data = devalue.parse(parsed.data);
  }
  return parsed;
}

export function enhance(form_element, submit = () => Promise<void>) {
  /**
   * @param {{
   *   action: URL;
   *   invalidateAll?: boolean;
   *   result: import('@sveltejs/kit').ActionResult;
   *   reset?: boolean
   * }} opts
   */
  const fallback_callback = ({
    action,
    result,
    reset = true,
    invalidateAll: shouldInvalidateAll = true,
  }) => {
    if (result.type === "success") {
      if (reset) {
        // We call reset from the prototype to avoid DOM clobbering
        HTMLFormElement.prototype.reset.call(form_element);
      }
      if (shouldInvalidateAll) {
        // await invalidateAll();
      }
    }

    // For success/failure results, only apply action if it belongs to the
    // current page, otherwise `form` will be updated erroneously
    if (
      location.origin + location.pathname === action.origin + action.pathname ||
      result.type === "redirect" ||
      result.type === "error"
    ) {
      applyAction(result);
    }
  };

  /** @param {SubmitEvent} event */
  async function handle_submit(event) {
    const method = event.submitter?.hasAttribute("formmethod")
      ? /** @type {HTMLButtonElement | HTMLInputElement} */ event.submitter
          .formMethod
      : clone(form_element).method;
    if (method !== "post") return;

    event.preventDefault();

    const action = new URL(
      // We can't do submitter.formAction directly because that property is always set
      event.submitter?.hasAttribute("formaction")
        ? /** @type {HTMLButtonElement | HTMLInputElement} */ event.submitter
            .formAction
        : clone(form_element).action
    );

    const form_data = new FormData(form_element);

    const submitter_name = event.submitter?.getAttribute("name");
    if (submitter_name) {
      form_data.append(
        submitter_name,
        event.submitter?.getAttribute("value") ?? ""
      );
    }

    const controller = new AbortController();

    let cancelled = false;
    const cancel = () => (cancelled = true);

    const callback =
      // @ts-ignore
      // eslint-disable-next-line
      (await submit({
        action,
        cancel,
        controller,
        formData: form_data,
        formElement: form_element,
        submitter: event.submitter,
      })) ?? fallback_callback;
    if (cancelled) return;

    /** @type {import('@sveltejs/kit').ActionResult} */
    let result;

    try {
      const response = await fetch(action, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-sveltekit-action": "true",
        },
        cache: "no-store",
        body: form_data,
        signal: controller.signal,
      });

      result = deserialize(await response.text());
      if (result.type === "error") result.status = response.status;
    } catch (error) {
      if ((error as any)?.name === "AbortError") return;
      result = { type: "error", error };
    }

    // @ts-ignore
    callback({
      action,
      formData: form_data,
      formElement: form_element,
      update: (opts) =>
        fallback_callback({
          action,
          result,
          reset: opts?.reset,
          invalidateAll: opts?.invalidateAll,
        }),
      result,
    });
  }

  HTMLFormElement.prototype.addEventListener.call(
    form_element,
    "submit",
    handle_submit
  );

  return {
    destroy() {
      HTMLFormElement.prototype.removeEventListener.call(
        form_element,
        "submit",
        handle_submit
      );
    },
  };
}
