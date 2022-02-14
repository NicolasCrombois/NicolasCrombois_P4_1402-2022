function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const closeModalBtn = document.querySelector(".close");
const formData = document.querySelectorAll(".formData");
const errorFirst = document.getElementById("errorFirst");
const errorLast = document.getElementById("errorLast");
const errorEmail = document.getElementById("errorEmail");


//Tableau qui stockera les erreurs de saisie du formulaire
var errors = [];

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// launch modal event
closeModalBtn.addEventListener("click", closeModal);
// Désactiver l'affichage du modal
function closeModal() {
  modalbg.style.display = "none";
}

//A chaque fois que l'utilisateur appuyera sur une touche du clavier (lorsqu'il sera entrain de remplir des input dont le parent est la classe "modal-btn")
//la fonction verifyEntryForm sera exécuté
formData.forEach((data) => data.addEventListener('keyup', function() { verifyEntryForm(this, false) }));

function verifyEntryForm(data, confirm){
  data = data.childNodes[3]
  const idElement = data.nextSibling.id
  console.log(idElement)
  if(idElement){
    console.log('===== ',idElement,' ======')
    errors = clearError(idElement)  //ne doit que clear le champ actuellement utilisé
  }
  if(data && (idElement == "first" || idElement == "last" )){
    errors = checkEntryName(data, errors);
  }
  if(data && idElement == "email"){
    errors = checkEntryEmail(data, errors, confirm);
  }
  displayErrors(errors);
}

function checkEntryName(elm, errors){
    const key = elm.nextSibling.id
    if(!/^\w+$/.test(elm.nextSibling.value)){
      var bodyError = {}
      bodyError[elm.nextSibling.id] = "Le nom ne peut qu'être constitué de caractère alphanumérique."
      errors.push(bodyError);
    }
    if(elm.nextSibling.value.length < 2){
      var bodyError = {}
      bodyError[elm.nextSibling.id] = "Veuillez entrer 2 caractères ou plus pour le champ du nom.";
      errors.push(bodyError);
    }
    return errors
}
function checkEntryEmail(email, errors, confirm){
  if( email.nextSibling.value && email.nextSibling.value.length > 0 ){
    const regexBeforeAt = new RegExp("^[a-zA-Z0-9._-]+$","g");
    const regexAfterAt = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]*$","g");
    const regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$","g");
    if( email.nextSibling.value.indexOf("@") == -1){
      if(!email.nextSibling.value.match(regexBeforeAt) ){
        var bodyError = {}
        bodyError[email.nextSibling.id] = "L'adresse email saisie est mal orthographié.";
        errors.push(bodyError);
      }
    }
    if( confirm && !email.nextSibling.value.match(regex) ){
      var bodyError = {}
      bodyError[email.nextSibling.id] = "L'adresse email saisie est mal orthographié.";
      errors.push(bodyError);
    }
    if( !confirm && !email.nextSibling.value.match(regexAfterAt) && email.nextSibling.value.indexOf("@") !== -1){
      var bodyError = {}
      bodyError[email.nextSibling.id] = "L'adresse email saisie est mal orthographié.";
      errors.push(bodyError);
    }
    if( !confirm && !email.nextSibling.value.match(regexAfterAt) && email.nextSibling.value.indexOf("@") !== -1){
      var bodyError = {}
      bodyError[email.nextSibling.id] = "L'adresse email saisie est mal orthographié.";
      errors.push(bodyError);
    }
    return errors
  }
}
function clearError(idError){
  const errorName = idError.charAt(0).toUpperCase() + idError.slice(1);
  document.getElementById('error'+errorName).innerHTML = ''
  return []
}

function displayErrors(errors){
  if(errors.length > 0){
    errors.forEach(element => {
      console.log(errors)
      if( 'first' in element || 'last' in element ){
        if('first' in element) { var key = 'first' ; var errorElement = errorFirst }
        if('last' in element) { var key = 'last' ; var errorElement = errorLast }
      }
      if('email' in element) { var key = 'email' ; var errorElement = errorEmail }
      errorElement.appendChild(document.createElement("p").appendChild(document.createTextNode(element[key])));
      errorElement.appendChild(document.createElement("br"));
    });
  }
}



