/* Регистрация офлайн-кэша. Работает при открытии по http(s) или с localhost. */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
 addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
