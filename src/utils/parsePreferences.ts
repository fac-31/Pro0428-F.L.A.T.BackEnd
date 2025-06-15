export function extractRulesFromSummary(summary: string): { title: string; rule: string }[] {
  console.log('Raw summary:', summary);

  if (!summary) return [];

  const lines = summary.split('\n');
  const relevantLines = lines.slice(1);
  console.log('Relevant lines (after removing first):', relevantLines);

  const rules: { title: string; rule: string }[] = [];

  for (let line of relevantLines) {
    line = line.trim();
    if (!line) continue;

    console.log(
      'Line chars:',
      line.split('').map((c) => c.charCodeAt(0))
    );

    const match = line.match(/^\s*[-–—]\s*\*\*(.+?:)\*\*\s*(.+)$/);
    if (match) {
      const [, rawTitle, rule] = match;
      const title = rawTitle.endsWith(':') ? rawTitle.slice(0, -1) : rawTitle;
      console.log('Matched rule:', { title, rule });
      rules.push({ title, rule });
    } else {
      console.log('No match for line:', line);
    }
  }

  console.log('Extracted rules:', rules);
  return rules;
}
