try {
  const theme = localStorage.getItem('learnico-lab10-theme');
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.lang = localStorage.getItem('learnico-lab10-language') === 'ru' ? 'ru' : 'en';
} catch {
  document.documentElement.dataset.theme = 'light';
}
