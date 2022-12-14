const cartButton = document.querySelector(
    '#cart-button'
)

const cancelCart = document.querySelector(
    '#cancel-cart'
)

const cart = document.querySelector('#cart')
const close = document.querySelector('#close')

cartButton.addEventListener('click', ()=>{toggleModal(cart)})

close.addEventListener('click', ()=>{toggleModal(cart)})

cancelCart.addEventListener('click', ()=>{toggleModal(cart)})

const signInButton = document.querySelector(
    '#sign-in-button'
)

const cancelSignIn = document.querySelector(
    '#cancel-sign-in'
)
const signIn = document.querySelector('#sign-in')
const closeSignIn = document.querySelector('#close-sign-in')

signInButton.addEventListener('click', ()=>{toggleModal(signIn)})
cancelSignIn.addEventListener('click', ()=>{toggleModal(signIn)})
closeSignIn.addEventListener('click', ()=>{toggleModal(signIn)})

const signUpLink = document.querySelector(
    '#sign-up-link'
)

const signUpButton = document.querySelector(
    '#sign-up-button'
)

const cancelSignUp = document.querySelector(
    '#cancel-sign-up'
)

const signUp = document.querySelector('#sign-up')
const closeSignUp = document.querySelector('#close-sign-up')

signUpButton.addEventListener('click', ()=>{toggleModal(signUp)})
cancelSignUp.addEventListener('click', ()=>{toggleModal(signUp)})
closeSignUp.addEventListener('click', ()=>{toggleModal(signUp)})
signUpLink.addEventListener('click', ()=>{
    toggleModal(signIn)
    toggleModal(signUp)
})

function toggleModal(modal) {
    modal.classList.toggle('is-open')
}

new WOW().init();