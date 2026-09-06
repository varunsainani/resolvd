// Inline script that runs before first paint to set the `.dark` class from the
// stored preference, so there is no flash of the wrong theme on load. Rendered
// as the first child of <body>.
const script = `(function(){try{var t=localStorage.getItem('resolvd-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}
