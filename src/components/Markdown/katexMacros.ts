// Seminar texts are written in LaTeX with siunitx loaded, so problem statements carry its macros
// into math. KaTeX knows none of them and renders the whole formula as a red error.
export const katexMacros: Record<string, string> = {
  '\\SI': String.raw`#1\,\mathrm{#2}`,
  '\\si': String.raw`\mathrm{#1}`,
  '\\ang': String.raw`#1^\circ`,
  '\\metre': 'm',
  '\\squared': '^2',
  '\\mbox': String.raw`\text{#1}`,
}
