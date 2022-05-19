  var firebaseConfig = {
    apiKey: "AIzaSyCUiUQb4WWqhiqbe5nqDKs_-oJh09PcgH4",
    authDomain: "final-iot-d3c05.firebaseapp.com",
    projectId: "final-iot-d3c05",
    storageBucket: "final-iot-d3c05.appspot.com",
    messagingSenderId: "322798547495",
    appId: "1:322798547495:web:c36aad546181f0e7865402",
    measurementId: "G-PCBEQPPQT3"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var auth = firebase.auth()
  
    var name1 = firebase.database().ref().child('tab1').child('name1').child('name');
   // console.log(name);
    var des = firebase.database().ref().child('tab1').child('name1').child('des');
    var price = firebase.database().ref().child('tab1').child('name1').child('pri');
    name1.on('value', function(snap) {
    document.getElementById("na1").innerHTML = snap.val(); });
    des.on('value', function(snap) {
    document.getElementById("des1").innerHTML = snap.val(); });
    price.on('value', function(snap) {
    document.getElementById("pri1").innerHTML = snap.val(); });
    //
    var name2 = firebase.database().ref().child('tab1').child('name2').child('name');
    var des = firebase.database().ref().child('tab1').child('name2').child('des');
    var price = firebase.database().ref().child('tab1').child('name2').child('pri');
    name2.on('value', function(snap) {
    document.getElementById("na2").innerHTML = snap.val(); });
    des.on('value', function(snap) {
    document.getElementById("des2").innerHTML = snap.val(); });
    price.on('value', function(snap) {
    document.getElementById("pri2").innerHTML = snap.val(); });  
    //
    var name3 = firebase.database().ref().child('tab1').child('name3').child('name');
    var des = firebase.database().ref().child('tab1').child('name3').child('des');
    var price = firebase.database().ref().child('tab1').child('name3').child('pri');
    name3.on('value', function(snap) {
    document.getElementById("na3").innerHTML = snap.val(); });
    des.on('value', function(snap) {
    document.getElementById("des3").innerHTML = snap.val(); });
    price.on('value', function(snap) {
    document.getElementById("pri3").innerHTML = snap.val(); });  
    //
    var name4 = firebase.database().ref().child('tab1').child('name4').child('name');
    var des = firebase.database().ref().child('tab1').child('name4').child('des');
    var price = firebase.database().ref().child('tab1').child('name4').child('pri');
    name4.on('value', function(snap) {
    document.getElementById("na4").innerHTML = snap.val(); });
    des.on('value', function(snap) {
    document.getElementById("des4").innerHTML = snap.val(); });
    price.on('value', function(snap) {
    document.getElementById("pri4").innerHTML = snap.val(); });  
    //
    var name5 = firebase.database().ref().child('tab1').child('name5').child('name');
    var des = firebase.database().ref().child('tab1').child('name5').child('des');
    var price = firebase.database().ref().child('tab1').child('name5').child('pri');
    name5.on('value', function(snap) {
    document.getElementById("na5").innerHTML = snap.val(); });
    des.on('value', function(snap) {
    document.getElementById("des5").innerHTML = snap.val(); });
    price.on('value', function(snap) {
    document.getElementById("pri5").innerHTML = snap.val(); });  
    //
    var name6 = firebase.database().ref().child('tab1').child('name6').child('name');
    var des = firebase.database().ref().child('tab1').child('name6').child('des');
    var price = firebase.database().ref().child('tab1').child('name6').child('pri');
    name6.on('value', function(snap) {
    document.getElementById("na6").innerHTML = snap.val(); });
    des.on('value', function(snap) {
    document.getElementById("des6").innerHTML = snap.val(); });
    price.on('value', function(snap) {
    document.getElementById("pri6").innerHTML = snap.val(); });


  let signInButton = document.getElementById('login')
  signInButton.addEventListener("click", (e) => {
    //Prevent Default Form Submission Behavior
    e.preventDefault()
    console.log("clicked")

    var email = document.getElementById("ticket-quantity")
    var password = document.getElementById("email")

    auth.signInWithEmailAndPassword(email.value, password.value) 
    .then((userCredential) => {
      // location.reload();
      // Signed in 
      var user = userCredential.user;
      console.log("user",user.email)
      window.location = "dash.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // alert("error code", errorCode)
      alert( errorMessage)
    });
   })



//This method gets invoked in the UI when there are changes in the authentication state:
// 1). Right after the listener has been registered
// 2). When a user is signed in
// 3). When the current user is signed out
// 4). When the current user changes

//Lifecycle hooks
auth.onAuthStateChanged(function(user) {
  if (user) {

    var email = user.email
  
    var users = document.getElementById("user")
    var text = document.createTextNode(email);

    users.appendChild(text);

    console.log(users)
    //is signed in
  } else {
    //no user signed in
  }
})
