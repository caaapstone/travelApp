import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyC3E3OKZjsm7juflD58RUzxj6_AN8xu6DI',
  authDomain: 'caaapstone.firebaseapp.com',
  databaseURL: 'https://caaapstone.firebaseio.com',
  projectId: 'caaapstone',
  storageBucket: '',
  messagingSenderId: '139076078695'
}

firebase.initializeApp(config)

export default firebase
