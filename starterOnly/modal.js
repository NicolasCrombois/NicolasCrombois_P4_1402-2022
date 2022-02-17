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
const errorBirthdate = document.getElementById("errorBirthdate");
const errorQuantity = document.getElementById("errorQuantity");
const errorLocation = document.getElementById("errorLocation");
const errorCondition = document.getElementById("errorCondition");


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
formData.forEach((data) => data.addEventListener('keyup', function() { errors = verifyEntryForm(this, false, errors); displayErrors(errors) }));

function verifyEntryForm(data, confirm, errors){
  data = data.childNodes[3]
  const idElement = data.nextSibling.id
  if(idElement){
    errors = clearError(idElement)
  }
  if(data && (idElement == "first" || idElement == "last" )){
    errors = checkEntryName(data, errors);
  }
  if(data && idElement == "email"){
    errors = checkEntryEmail(data, errors, confirm);
  }
  if(data && idElement == "birthdate"){
    errors = checkEntryBirthdate(data, errors, confirm);
  }
  if(data && idElement == "quantity"){
    errors = checkEntryQuantity(data, errors);
  }
  return errors
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

    var bodyError = {}
    bodyError[email.nextSibling.id] = "L'adresse email saisie est mal orthographié.";

    if( !confirm && email.nextSibling.value.indexOf("@") == -1 && !email.nextSibling.value.match(regexBeforeAt)){
      errors.push(bodyError);
    }
    if( !confirm && !email.nextSibling.value.match(regexAfterAt) && email.nextSibling.value.indexOf("@") !== -1){
      errors.push(bodyError);
    }
    if( confirm && !email.nextSibling.value.match(regex) ){
      errors.push(bodyError);
    }
  }else if(confirm){
    var bodyError = {}
    bodyError[email.nextSibling.id] = "Aucune adresse email n'a été entrée.";
    errors.push(bodyError);
  }
  return errors
}
function checkEntryBirthdate(date, errors, confirm){
  if(confirm === true){
    const birthdate = Date.parse(date.nextSibling.value)
    var bodyError = {}
    if(birthdate){
      if( birthdate > new Date()){
        bodyError[date.nextSibling.id] = "La date de naissance saisie n'est pas correct";
        errors.push(bodyError);
      }
    }else{
      bodyError[date.nextSibling.id] = "Aucune date de naissance n'a été saisie.";
      errors.push(bodyError);
    }
  }
  return errors
}
function checkEntryQuantity(quantity, errors,){
  var bodyError = {}
  if(typeof Math.floor(quantity.nextSibling.value) !== 'number' || !quantity.nextSibling.value.match(regex = new RegExp("^[0-9]+$","g"))){
    bodyError[quantity.nextSibling.id] = "Le nombre de participation aux tournois GameOn a mal été saisi.";
    errors.push(bodyError);
  }else{
    if( Math.floor(quantity.nextSibling.value) < 0 || Math.floor(quantity.nextSibling.value) > 99 ){
      bodyError[quantity.nextSibling.id] = "Le nombre de participation aux tournois GameOn doit être compris entre 0 et 99 (inclus).";
      errors.push(bodyError);
    }
  }
  return errors
}

function checkEntryLocation(errors){
  const locationchecked = document.querySelectorAll('input[name=location]:checked');
  var bodyError = {}
  if(locationchecked.length > 1){
    bodyError['location'] = "Vous ne pouvez sélectionner plus d'une ville";
    errors.push(bodyError);
  }else if(locationchecked.length === 0){
    bodyError['location'] = "Vous n'avez pas sélectionné de tournoi";
    errors.push(bodyError);
  }
  return errors
}

function checkCondition(errors){
  const conditionIsChecked = document.querySelector('input#checkbox1').checked;
  if(!conditionIsChecked){
    var bodyError = {}
    bodyError['condition'] = "Vous devez accepter les conditions d'utilisation";
    errors.push(bodyError);
  }
  return errors
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
      if('birthdate' in element) { var key = 'birthdate' ; var errorElement = errorBirthdate }
      if('quantity' in element) { var key = 'quantity' ; var errorElement = errorQuantity }
      if('location' in element) { var key = 'location' ; var errorElement = errorLocation }
      if('condition' in element) { var key = 'condition' ; var errorElement = errorCondition }
      errorElement.appendChild(document.createElement("p").appendChild(document.createTextNode(element[key])));
      errorElement.appendChild(document.createElement("br"));
    });
  }
}

function validate(){
  const form = document.querySelectorAll('.formData');
  let index = 0
  form.forEach(item => {
    if(index <= 4){
      console.log(item)
      errors = verifyEntryForm(item, true, errors)
      displayErrors(errors)
    }
    index++
  })

  clearError('location')
  clearError('condition')
  errors = checkEntryLocation(errors)
  errors = checkCondition(errors)

  displayErrors(errors)
  return false
}



