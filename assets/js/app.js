/* ========== AUTENTICACION FIREBASE =========== */
var counterPending = 0;
var counterViews = 0;

// SIGN UP:
function signUp() {

  var newUserName = $('#newUserName').val();
  var newName = $('#newName').val();
  var newLastName = $('#newLastName').val();
  var newUserName = $('#newUserName').val();
  var newEmail = $('#newEmail').val();
  var newPassword = $('#newPassword').val();

  firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}

// SIGN IN:
function signIn() {

  var email = $('#email').val();
  var password = $('#password').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // console.log('Ingreso exitoso!');
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}

// OBSERVADOR DE ESTADO:
function watcher() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log('Usuario activo!');
      console.log(user);
      $('#btnProfileUser').show();
      $('#logInBtn').hide();
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // ...
    } else {
      // User is signed out.
      $('#videoCover').show();
      $('#catchPhrase').show();
      $('#btnProfileUser').hide();
      $('#logInBtn').show();
      console.log('No hay usuario activo!');
    }
  });
}
watcher();

// Autenticación Google;
var provider = new firebase.auth.GoogleAuthProvider();

function google() {
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

/* ========== FIN AUTENTICACION FIREBASE =========== */


$(document).ready(function () {

  // Inicializa plugins de Materialize
  $('.modal').modal();
  $('.dropdown-button').dropdown();
  $('.carousel').carousel();
  $('ul.tabs').tabs();

  //Cambio de vistas
  $('#btnProfileUser').click(function () {
    $('#home').addClass("hide");
    $('footer').addClass("hide");
    $('#userProfile').removeClass("hide");
    $('#myList').addClass("hide");
  });

  $('#btnHome').click(function () {
    $('#home').removeClass("hide");
    $('footer').removeClass("hide");
    $('#userProfile').addClass("hide");
    $('#myList').addClass("hide");
  });

  $('#btnMylist').click(function () {
    $('#home').addClass("hide");
    $('footer').addClass("hide");
    $('#userProfile').addClass("hide");
    $('#myList').removeClass("hide");
  });


  /* ====== FUNCIONES DE BÚSQUEDA ====== */

  function randomYear(min, max) {
  return Math.round(Math.random() * (max - min) + min);
	}

  // Tabs:
  $("ul.tabs").tabs({
    onShow: function (tab) {
      var yearValue = randomYear(1980, 2018);
      // console.log(yearValue);
      var url = 'http://www.omdbapi.com/?apikey=942bd4df&s="a"&y=' + yearValue + '&type=' + tab[0].id;
      console.log(this.name);
      var request = new XMLHttpRequest();
      request.open('GET', url);
      request.responseType = 'json';
      request.send();

      request.onload = function () {
        var movies = request.response;
        console.log(movies);
        // console.log(movies.Search);

        //Busqueda por año. Todas las peliculas del año que introduce el usuario que contengan la letra a
        var listAllMovies;
        if (tab[0].id == 'movie') {
          listAllMovies = $('#collection-movie');
        } else {
          listAllMovies = $('#collection-serie');
        }
        listAllMovies.html("");
        for (let i = 0; i < movies.Search.length; i++) {
        	$('#' + tab[0].id).append(
	    			"<div class='col s3'>" +
							"<div class='card cardXL'>" +
								"<div class='card-image imageXL waves-effect waves-block waves-light'>" +
				    			"<img class='activator' src='" + movies['Search'][i]['Poster'] + "'>" +
				    		"</div>" +
				    		"<div class='card-content'>" +
				    			"<div class='row'>" +
									  "<div class='boxTitleXL col s11'>" +
									    "<span class='card-title title activator grey-text text-darken-4'>" + movies['Search'][i]['Title'] + "</span>" +
									  "</div>" +
									  "<div class='col s1'>" +
									    "<i class='material-icons right'>more_vert</i>" +
									  "</div>" +
									"</div>" +
									"<div class='row'>" +
									  "<div class='col s6'>" +
									    "<span>" + movies['Search'][i]['Year'] + "</span>" +
									  "</div>" +
									  "<div class='col s6'>" +
									    "<a class='btnMylist right'><i class='btnList material-icons'>add</i></a>" +
				      				"<a class='btnPending right'><i class='btnList material-icons'>access_time</i></a>" +
            					"<a class='btnViewed right'><i class='btnList material-icons'>done</i></a>" +
									  "</div>" +
									"</div>" +
				    		"</div>" +
				    		"<div class='card-reveal'>" +
				    			"<span class='card-title grey-text text-darken-4'>" + movies['Search'][i]['Title'] + "<i class='material-icons right'>close</i></span>" +
				      		"<p>" + movies['Search'][i]['Year'] + "</p>" +
				    		"</div>" +
							"</div>" +
						"</div>"
	 				);
        }
      };
    }
  });
  
  // Función de búsqueda Search Bar:
	$('#btnSearch').click(function() {
		$('#searchResults').children().remove();
		var searchTitle = $('#search').val().replace(/ /g, '+');
    
	  $.getJSON('http://www.omdbapi.com/?apikey=3a181f1c&s=' + searchTitle, function(result) {
	  	console.log(result);
		  for (i in result['Search']) {
		   	$('#searchResults').append(
			    "<div class='col s3'>" +
						"<div class='card cardXS'>" +
							"<div class='card-image imageXS waves-effect waves-block waves-light'>" +
				    		"<img class='activator' src='" + result['Search'][i]['Poster'] + "'>" +
				    	"</div>" +
				    	"<div class='card-content'>" +
				    			"<div class='row'>" +
									  "<div class='boxTitleXS col s11'>" +
									    "<span class='card-title title activator grey-text text-darken-4'>" + result['Search'][i]['Title'] + "</span>" +
									  "</div>" +
									  "<div class='col s1'>" +
									    "<i class='material-icons right'>more_vert</i>" +
									  "</div>" +
									"</div>" +
									"<div class='row'>" +
									  "<div class='col s6'>" +
									    "<span>" + result['Search'][i]['Year'] + "</span>" +
									  "</div>" +
									  "<div class='col s12 m10'>" + //cambio para mostrar iconos en linea estaba en s6
									    "<a class='btnMylist right'><i class='btnList material-icons white-text'>add</i></a>" + //cambie color a blanco el icono
				      				"<a class='btnPending right'><i class='btnList material-icons white-text'>access_time</i></a>" +
            					"<a class='btnViewed right'><i class='btnList material-icons white-text'>done</i></a>" +
									  "</div>" +
									"</div>" +
				    	"</div>" +
				    	"<div class='card-reveal'>" +
				    			"<span class='card-title grey-text text-darken-4'>" + result['Search'][i]['Title'] + "<i class='material-icons right'>close</i></span>" +
				      		"<p>" + result['Search'][i]['Year'] + "</p>" +
				    	"</div>" +
						"</div>" +
					"</div>"
		   	);
		  }
    });
  });


  $(document).on('click', '.btnMylist', function () {
    // Your Code
    var searchMylist = ($(this).parent().parent().find('.title').text());
    var urlMylist = 'http://www.omdbapi.com/?apikey=942bd4df&s=' + searchMylist;

    var request = new XMLHttpRequest();
    request.open('GET', urlMylist);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
      var infoTitle = request.response;
      // console.log(infoTitle);
      var PosterModal = infoTitle.Poster;
      var titleModal = infoTitle.Title;
      var yearModal = infoTitle.Year;
      var actorsModal = infoTitle.Actors;
      var directorModal = infoTitle.Director;
      var plotModal = infoTitle.Plot;
      // console.log(PosterModal, titleModal, yearModal, actorsModal, directorModal, plotModal);
      var newName = $('.modalList')
        .append(titleModal);
    };
  });

  $(document).on('click', '.btnPending', function () {

    // Contador:
    var containerNumberPending = $('.containerNumberPending');
    counterPending++;
    containerNumberPending.html('');
    containerNumberPending.append(counterPending);

    var searchPending = ($(this).parent().parent().parent().find('.title').text());
    var urlPending = 'http://www.omdbapi.com/?apikey=942bd4df&t=' + searchPending;
    var request = new XMLHttpRequest();
    request.open('GET', urlPending);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
      var infoTitlePending = request.response;
      console.log(infoTitlePending);
      var PosterModalPending = infoTitlePending.Poster;
      var titleModalPending = infoTitlePending.Title;
      var yearModalPending = infoTitlePending.Year;
      var actorsModalPending = infoTitlePending.Actors;
      var directorModalPending = infoTitlePending.Director;
      var plotModalPending = infoTitlePending.Plot;

      // console.log(PosterModal, titleModal, yearModal, actorsModal, directorModal, plotModal);
      
      //Agregar a Modal=================
      var newNameP = $('.modalPending');
      var divContent = $('<div></div>');
      divContent.addClass('divContentP');
      var imgContent = $('<img>')
        .attr({
          'src': PosterModalPending,
          'alt': ""
        })
        .addClass('imgContent');
      var texto = $('<h5></h5>')
        .text(titleModalPending)
        .addClass('texto');
      divContent.append(imgContent, texto);
      newNameP.append(divContent);

      //Agregar a Perfil=================
      var newNamePP = $('.listPending');
      var divContentP = $('<div></div>')
        .addClass('slide');
      var imgContentP = $('<img>')
        .attr({
          'src': PosterModalPending,
          'alt': ""
        });
      imgContentP.addClass('posterList responsive-img');
      var textoP = $('<h5></h5>')
        .text(titleModalPending)
        .addClass('texto');
      divContentP.append(imgContentP, textoP);
      newNamePP.append(divContentP);
    };
  });

  $(document).on('click', '.btnViewed', function () {
    // Your Code

    console.log('Presionado Visto');
    var containerNumberViews = $('.containerNumberViews');
    counterViews++;
    containerNumberViews.html('');
    containerNumberViews.append(counterViews);

    var searchViewed = ($(this).parent().parent().parent().find('.title').text());
    var urlViewed = 'http://www.omdbapi.com/?apikey=942bd4df&t=' + searchViewed;
    var request = new XMLHttpRequest();
    request.open('GET', urlViewed);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
      var infoTitleViewed = request.response;
      // console.log(infoTitleViewed);
      var PosterModalViewed = infoTitleViewed.Poster;
      var titleModalViewed = infoTitleViewed.Title;
      var yearModalViewed = infoTitleViewed.Year;
      var actorsModalViewed = infoTitleViewed.Actors;
      var directorModalViewed = infoTitleViewed.Director;
      var plotModalViewed = infoTitleViewed.Plot;
      // console.log(PosterModal, titleModal, yearModal, actorsModal, directorModal, plotModal);

      //Agregar a Modal=================
      var newName = $('.modalViewed');
      var divContent = $('<div></div>')
        .addClass('divContent');
      var imgContent = $('<img>')
        .attr({
          'src': PosterModalViewed,
          'alt': ""
        })
        .addClass('imgContent');
      var texto = $('<h5></h5>')
        .text(titleModalViewed)
        .addClass('texto');
      divContent.append(imgContent, texto);
      newName.append(divContent);

      //Agregar a Perfil=================
      var newNameV = $('.listViews');
      var divContentV = $('<div></div>')
        .addClass('slide');
      var imgContentV = $('<img>')
        .attr({
          'src': PosterModalViewed,
          'alt': ""
        })
        .addClass('posterList responsive-img');
      var textoV = $('<h5></h5>')
        .text(titleModalViewed)
        .addClass('texto');
      divContentV.append(imgContentV, textoV);
      newNameV.append(divContentV);
    };
  });
});

/* ====== CARRUSEL NETFLIX ====== */

var scaling = 1.50;
//count
var currentSliderCount = 0;
var videoCount = $(".slider-container").children().length;
var showCount = 4;
var sliderCount = videoCount / showCount;
var controlsWidth = 40;
var scollWidth = 0;

$(document).ready(function () {
  //$('.slider-container .slide:nth-last-child(-n+4)').prependTo('.slider-container');
  init();

});
$(window).resize(function () {
  init();
});

function init() {
  // elements
  var win = $(window);
  var sliderFrame = $(".slider-frame");
  var sliderContainer = $(".slider-container");
  var slide = $(".slide");

  //counts
  var scollWidth = 0;

  //sizes
  var windowWidth = win.width();
  var frameWidth = win.width() - 80;
  if (windowWidth >= 0 && windowWidth <= 414) {
    showCount = 2;
  } else if (windowWidth >= 414 && windowWidth <= 768) {
    showCount = 3;
  } else {
    showCount = 4;
  }
  var videoWidth = ((windowWidth - controlsWidth * 2) / showCount);
  var videoHeight = Math.round(videoWidth / (16 / 9));

  var videoWidthDiff = (videoWidth * scaling) - videoWidth;
  var videoHeightDiff = (videoHeight * scaling) - videoHeight;

  //set sizes
  sliderFrame.width(windowWidth);
  sliderFrame.height(videoHeight * scaling);

  //sliderFrame.css("top", (videoHeightDiff / 2));

  sliderContainer.height(videoHeight * scaling);
  sliderContainer.width((videoWidth * videoCount) + videoWidthDiff);
  sliderContainer.css("top", (videoHeightDiff / 2));
  sliderContainer.css("margin-left", (controlsWidth));

  slide.height(videoHeight);
  slide.width(videoWidth);

  //hover effect
  $(".slide").mouseover(function () {
    $(this).css("width", videoWidth * scaling);
    $(this).css("height", videoHeight * scaling);
    $(this).css("top", -(videoHeightDiff / 2));
    if ($(".slide").index($(this)) == 0 || ($(".slide").index($(this))) % 4 == 0) {
      // do nothing
    } else if (($(".slide").index($(this)) + 1) % 4 == 0 && $(".slide").index($(this)) != 0) {
      $(this).parent().css("margin-left", -(videoWidthDiff - controlsWidth));
    } else {
      $(this).parent().css("margin-left", -(videoWidthDiff / 2));
    }
  }).mouseout(function () {
    $(this).css("width", videoWidth * 1);
    $(this).css("height", videoHeight * 1);
    $(this).css("top", 0);
    $(this).parent().css("margin-left", controlsWidth);
  });

  // controls
  controls(frameWidth, scollWidth);
}

function controls(frameWidth, scollWidth) {
  var prev = $(".prev");
  var next = $(".next");

  next.on("click", function () {
    // console.log(currentSliderCount);
    // console.log(sliderCount);
    scollWidth = scollWidth + frameWidth;
    $('.slider-container').animate({
      left: -scollWidth
    }, 300, function () {
      if (currentSliderCount >= sliderCount - 1) {
        $(".slider-container").css("left", 0);
        currentSliderCount = 0;
        scollWidth = 0;
      } else {
        currentSliderCount++;
      }
    });
  });
  prev.on("click", function () {
    scollWidth = scollWidth - frameWidth;
    $('.slider-container').animate({
      left: +scollWidth
    }, 300, function () {
      currentSliderCount--;
    });
    //$(".slider-container").css("left", scollWidth);
  });
};

//Función botón perfil desplegable
$(".button-collapse").sideNav();

//Funcion crea titulo nuevas listas
var idPin = 0;

function saveList() {
  var titulo = $("#titlelist").val(); //crea variable para rescatar valor escrito por usuario en titulo llamando ID desde HTML
  $("#lineNew").append(
  		"<div id='pin_" + idPin + " ' class='pin col-md-3'>" +
    	//este es el frente
    		"<h6 class='flow-text white-text titleList'>" + titulo + "</h6>" + 
    	"</div>");
  
  $('#titlelist').val("");
};