const shareImageButton = document.querySelector('#share-image-button')
const createPostArea = document.querySelector('#create-post')
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn')
const sharedMomentsArea = document.querySelector('#shared-moments')

function openCreatePostModal() {
  createPostArea.style.display = 'block'
  
  if (appStore.deferredPrompt) {
    appStore.deferredPrompt.prompt()
    
    appStore.deferredPrompt.userChoice
      .then(choice => {
        if (choice.outcome === 'dismissed') {
          console.log('User cancelled installation.')
        } else {
          console.log('User installed app.')
        }
      })
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none'
}

shareImageButton.addEventListener('click', openCreatePostModal)

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal)

function createCard() {
  const cardWrapper = document.createElement('div')
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp'
  const cardTitle = document.createElement('div')
  cardTitle.className = 'mdl-card__title'
  cardTitle.style.backgroundImage = 'url("/src/images/sf-bridge.jpg")'
  cardTitle.style.backgroundSize = 'cover'
  cardTitle.style.height = '180px'
  cardWrapper.appendChild(cardTitle)
  const cardTitleTextElement = document.createElement('h2')
  cardTitleTextElement.style.color = 'white'
  cardTitleTextElement.className = 'mdl-card__title-text'
  cardTitleTextElement.textContent = 'San Francisco Trip'
  cardTitle.appendChild(cardTitleTextElement)
  
  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'Save'
  saveBtn.addEventListener('click', handleSaveBtn)
  
  const cardSupportingText = document.createElement('div')
  cardSupportingText.className = 'mdl-card__supporting-text'
  cardSupportingText.textContent = 'In San Francisco'
  cardSupportingText.style.textAlign = 'center'
  
  cardWrapper.appendChild(cardSupportingText)
  componentHandler.upgradeElement(cardWrapper)
  sharedMomentsArea.appendChild(cardWrapper)
  cardSupportingText.appendChild(saveBtn)
}

function handleSaveBtn (event) {
  console.log('Button clicked.')
  caches.open('user-requested')
    .then(cache => {
      cache.add('https://httpbin.org/get'),
      cache.add('/src/images/sf-bridge.jpg')
    })
}

fetch('https://httpbin.org/get')
  .then(res => res.json())
  .then(createCard)
  .catch(err => console.log(err))
