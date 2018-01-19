appStore = {
  deferredPrompt: null
}

if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('/service-worker.js')
    .then(res => {
      console.log('Service Worker registered.', res)
    })
    .catch(err => {
      console.log(err)
    })
}

window.addEventListener('beforeinstallprompt', event => {
  e.preventDefault()
  appStore.deferredPrompt = event
})