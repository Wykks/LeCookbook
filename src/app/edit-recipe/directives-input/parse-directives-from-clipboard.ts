export function parseDirectivesFromClipboard(event: ClipboardEvent): string[] {
  const text = event.clipboardData?.getData('text');
  if (!text) {
    return [];
  }
  const rawDirectives = text.split('\n');
  const directives: string[] = [];
  let addDirectiveStepOnNextGap = false;
  for (const line of rawDirectives) {
    const cleanLine = line.trim();
    if (!cleanLine && addDirectiveStepOnNextGap) {
      directives.push('');
    } else {
      const idx = directives.length ? directives.length - 1 : 0;
      const step = directives[idx] ? `\n${line}` : line;
      directives[idx] += step;
      addDirectiveStepOnNextGap = true;
    }
  }
  return directives;
}
