/** Join class names, skipping falsy values. Tiny stand-in for clsx. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** "A", "A and B", "A, B, and C". */
export function formatList(items: readonly string[]): string {
  return new Intl.ListFormat("en-US", { style: "long", type: "conjunction" }).format(items);
}

/** "1 need" / "3 needs". */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
