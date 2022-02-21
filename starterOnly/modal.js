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
const modalBody = document.querySelector(".modal-body");
const modalConfirm = document.querySelector(".modal-confirmation");
const closeModalBtn = document.querySelector(".close");
const closeConfirmBtn = document.querySelector(".close-confirm")
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

//Get URL Parameter
const urlParams = new URLSearchParams(window.location.search);
const first = urlParams.get('first')
const last = urlParams.get('last')
const email = urlParams.get('email')
const birthdate = urlParams.get('birthdate')
const quantity = urlParams.get('quantity')
const city = urlParams.get('location')

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}
// launch modal event
closeModalBtn.addEventListener("click", closeModal);
// Désactiver l'affichage de la modal
function closeModal() {
  modalbg.style.display = "none";
}
closeConfirmBtn.addEventListener("click", closeModalConfirmation);
// Fermer la modal de confirmation et réinitialisation du formulaire
function closeModalConfirmation(){
  errors = []
  modalbg.style.display = "none";
  modalBody.style.display = "block";
  modalConfirm.style.display = "none";
}

//if all parameters are present, we run a last check 
if(first || last || email || birthdate || quantity || city){
  launchModal()
  errors = checkEntryName("first", first, errors);
  errors = checkEntryName("last", last, errors);
  errors = checkEntryEmail("email",email, errors, true);
  errors = checkEntryBirthdate("birthdate", birthdate, errors, true);
  errors = checkEntryQuantity("quantity", quantity, errors);
  if(!city || city.length <= 0){
    var bodyError = {}
    bodyError['location'] = "Vous n'avez pas sélectionné de tournoi";
    errors.push(bodyError);
  }
  if( errors.length === 0){
    modalConfirm.style.display = "block";
    modalBody.style.display = "none"
  }else{
    setValueInput(first, last, email, birthdate, quantity, city)
    displayErrors(errors)
  }
}


//A chaque fois que l'utilisateur appuyera sur une touche du clavier (lorsqu'il sera entrain de remplir des input dont le parent est la classe "modal-btn")
//la fonction verifyEntryForm sera exécuté
formData.forEach((data) => data.addEventListener('keyup', function() { errors = verifyEntryForm(this, false, errors); displayErrors(errors) }));

//Permet de vérifier que les champs "last", "first", "email", "birthdate", "quantity" soient correctement rempli
function verifyEntryForm(data, confirm, errors){
  data = data.childNodes[3]
  const idElement = data.nextSibling.id
  if(idElement){
    errors = clearError(idElement)
  }
  if(data && (idElement == "first" || idElement == "last" )){
    errors = checkEntryName(idElement, data.nextSibling.value, errors);
  }
  if(data && idElement == "email"){
    errors = checkEntryEmail(idElement, data.nextSibling.value, errors, confirm);
  }
  if(data && idElement == "birthdate"){
    errors = checkEntryBirthdate(idElement, data.nextSibling.value, errors, confirm);
  }
  if(data && idElement == "quantity"){
    errors = checkEntryQuantity(idElement, data.nextSibling.value, errors);
  }
  return errors
}

//Fonction permettant de vérifier que la valeur saisie est bien composé d'au moins de caractères et de caractère alphanumérique
function checkEntryName(id, value, errors){
    if(id === "last"){var fieldname = "nom"}
    else if(id === "first"){var fieldname = "prénom"}
    if(!/^[a-zA-Z0-9-]+$/.test(value)){
      var bodyError = {}
      bodyError[id] = "Le "+fieldname+" ne peut qu'être constitué de caractère alphanumérique (pas d'espace)."
      errors.push(bodyError);
    }
    if(value.length < 2){
      var bodyError = {}
      bodyError[id] = "Veuillez entrer 2 caractères ou plus pour le champ du "+fieldname,+".";
      errors.push(bodyError);
    }
    return errors
}

//Fonction permettant de vérifier que la valeur saisie est bien le format d'une adresse mail
function checkEntryEmail(id, value, errors, confirm){
  if( value && value.length > 0 ){
    const regexBeforeAt = new RegExp("^[a-zA-Z0-9._-]+$","g");
    const regexAfterAt = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]*$","g");
    const regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$","g");

    var bodyError = {}
    bodyError[id] = "L'adresse email saisie est mal orthographié.";

    if( !confirm && value.indexOf("@") == -1 && !value.match(regexBeforeAt)){
      errors.push(bodyError);
    }
    if( !confirm && !value.match(regexAfterAt) && value.indexOf("@") !== -1){
      errors.push(bodyError);
    }
    if( confirm && !value.match(regex) ){
      errors.push(bodyError);
    }
  }else if(confirm){
    var bodyError = {}
    bodyError[id] = "Aucune adresse email n'a été entrée.";
    errors.push(bodyError);
  }
  return errors
}

//Vérifier la validité de la date
function checkEntryBirthdate(id, value, errors, confirm){
  if(confirm === true){
    const birthdate = Date.parse(value)
    var bodyError = {}
    if(birthdate){
      if( birthdate > new Date()){
        bodyError[id] = "La date de naissance saisie n'est pas correct";
        errors.push(bodyError);
      }
    }else{
      bodyError[id] = "Aucune date de naissance n'a été saisie.";
      errors.push(bodyError);
    }
  }
  return errors
}

//Vérification de la valeur de quantité saisie (compris entre 0 et 99)
function checkEntryQuantity(id, value, errors,){
  var bodyError = {}
  if(typeof Math.floor(value) !== 'number' || !value.match(regex = new RegExp("^[0-9]+$","g"))){
    bodyError[id] = "Le nombre de participation aux tournois GameOn a mal été saisi.";
    errors.push(bodyError);
  }else{
    if( Math.floor(value) < 0 || Math.floor(value) > 99 ){
      bodyError[id] = "Le nombre de participation aux tournois GameOn doit être compris entre 0 et 99 (inclus).";
      errors.push(bodyError);
    }
  }
  return errors
}

//Vérification qu'une et une seule location a été saisie
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

//Vérification de la case de condition d'utilisation (celle-ci doit-être obligatoirmeent cochée)
function checkCondition(errors){
  const conditionIsChecked = document.querySelector('input#checkbox1').checked;
  if(!conditionIsChecked){
    var bodyError = {}
    bodyError['condition'] = "Vous devez accepter les conditions d'utilisation";
    errors.push(bodyError);
  }
  return errors
}

//fonction permettant de réinitialisé l'erreur d'un champ de saisie dont l'id doit être passé en argument
function clearError(idError){
  const errorName = idError.charAt(0).toUpperCase() + idError.slice(1);
  document.getElementById('error'+errorName).innerHTML = ''
  return []
}

//fonction bouclant sur le tableau d'erreur, et affichant ces dernières dans les champs appropriés
function displayErrors(errors){
  if(errors.length > 0){
    errors.forEach(element => {
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

//Permet de réinserer les valeurs passées en paramètres de l'URL dans les champs de saisie correspondant
function setValueInput(first, last, email, birthdate, quantity, location){
  document.querySelector('input#first').value = first.trim();
  document.querySelector('input#last').value = last.trim();
  document.querySelector('input#email').value = email.trim();
  document.querySelector('input#birthdate').value = birthdate;
  document.querySelector('input#quantity').value = quantity;
  if(location && ['New York', 'San Francisco', 'Seattle', 'Chicago', 'Boston' ,'Portland'].includes(location)){ document.querySelector('input[name=location]#'+location.replace(/\s/g, '')).checked = true; }
}


//Lorsque l'utilisation appuyer pour valider le formulaire on vérifie en amount si les conditons ont été accepté
function validate(){
  errors = []
  clearError('condition')
  errors = checkCondition(errors)
  displayErrors(errors)
  if(errors.length > 0){
    return false
  }else{
    return true
  }
}