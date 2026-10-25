/* Gemini has no documented prompt URL. Keep its normal link and copy on an explicit click. */
(() => {
  const link = document.querySelector('[data-copy-question]');
  const question = document.getElementById('ai-question-text');
  const fallback = document.getElementById('ai-question');
  const status = document.getElementById('ai-copy-status');
  if (!link || !question || !fallback || !status) return;
  const showQuestion = () => {
    fallback.open = true;
    status.textContent = 'Copy the question above, then paste it into Gemini.';
  };
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!navigator.clipboard?.writeText) {
      event.preventDefault();
      showQuestion();
      return;
    }
    navigator.clipboard.writeText(question.textContent.trim()).then(() => {
      status.textContent = 'Question copied. Paste it into Gemini.';
    }).catch(showQuestion);
  });
})();
