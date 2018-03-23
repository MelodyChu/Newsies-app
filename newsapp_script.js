$(document).ready(function() {

	var config = {
		    apiKey: "AIzaSyDNn4iKjCopdN7JXKNexZlm2i1D45nNc5w",
		    authDomain: "newsies-melody.firebaseapp.com",
		    databaseURL: "https://newsies-melody.firebaseio.com",
		    projectId: "newsies-melody",
		    storageBucket: "newsies-melody.appspot.com",
		    messagingSenderId: "269951118496"
		  };
		  firebase.initializeApp(config);


	// automatically load bbc news when page first loads
	displayNews('https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=ea2a4ec8eee0414589d6711ddfdcfab0')
	displayNewsSources() // call the displayNewsSources function below
	/* Auto loading bbc news when page initially loads*/
	
	// detect auth state changes
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$('#openModal').hide()
			console.log('success')
			$('#log-in').hide() 
			$('#sign-up').hide()
			$('#log-out').show()
			$('#update-pref').show()
		// there is a user logged in
		} else {
			// there is no user logged in
		}
	})

	// when log-in button clicked, show modal (otherwise modal is hidden)
	$('#log-in').click(function() {
		$('#openLoginModal').show()
		// console.log('#log-in')
	})
// hide sign in button when closed
	$('.close').click(function() {
		$('#openLoginModal').hide()	
		// console.log('.close')
	})

	$('#logInButton').click(function() {
		$('#openLoginModal').hide()	
		// console.log('#logInButton')
	})

	$('#update-pref').click(function() {
		$('#update-pref-modal').show()
	})
// allowing users to sign up & register
	$('#Register').click(function() {
		var email = $('#signup-email').val() /* var vs. let & const? */
		//console.log(email)
		var password = $('#signup-password').val()	
		//console.log(password)
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(function() {
			
		})
		.catch(function(error) {
			$("#signup-error").html(error.message)
			console.log('error')
		})

	})

// let users sign out 
	$('#log-out').click(function() {
		firebase.auth().signOut().then(function() {
  		console.log('success') /*don't have anyting here for logout bc saying logout is success is unneccessary? */
		$('#log-out').hide()
		$('#log-in').show() 
		$('#sign-up').show()
		}).catch(function(error) {
			$('#logout-error').html(error.message)
			console.log('error')
		});

	})
		// console.log('#logInButton')
	
// allowing users to sign into an existing account
	$('#logInButton').click(function() {
		var email = $('#login-email').val()
		var password = $('#logInButton-password').val()

		firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
			$('#openLoginModal').hide()
			console.log('success')
			$('#log-in').hide() 
			$('#sign-up').hide()
			$('#log-out').show()
		})
		.catch(function(error) {
			$('#login-error').html(error.message)
			console.log('error')

		})
	// if user hasn't logged in; show log in button. if user already logged in
	// show log out button

	})
	

	// $('#exampleModal').on('show.bs.modal', function (event) {
	//   var button = $(event.relatedTarget) // Button that triggered the modal
	//   var recipient = button.data('whatever') // Extract info from data-* attributes
	//   // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
	//   // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
	//   var modal = $(this)
	//   modal.find('.modal-title').text('New message to ' + recipient)
	//   modal.find('.modal-body input').val(recipient)
	// })

	// when clicking on buttons (class source); create button URL for news source & call display news function
	$('.source').click(function() { // Defining behavior when news button clicked
		var id = $(this).attr("id") // 'this' needs to be used locally; does 'this' represent .source? -- yes; and we're getting ID of source
		var buttonUrl = 'https://newsapi.org/v2/top-headlines?' +
          'sources=' + id +'&' +
          'apiKey=ea2a4ec8eee0414589d6711ddfdcfab0'
		displayNews(buttonUrl)
		// change the color of button when clicked; first default all buttons to original colors
		 $('.source').css({
		 	backgroundColor: 'lavender',
		 	color: 'blue',
		 })
		 $("#" + id).css({ 
			backgroundColor: '#000080',
			color: 'white'
		})
	})
	// Defining behavior when search bar's button clicked*/
	$('.searchButton').click(function() { 
		var searchTerm = $(".searchTerm").val() // defining searchTerm variable
		// searchTerm.focus();
		var searchURL = 'https://newsapi.org/v2/top-headlines?' +
          'q=' + searchTerm +'&' +
          'apiKey=ea2a4ec8eee0414589d6711ddfdcfab0'
		displayNews(searchURL) // is this effectively the 'return' statement of the function?
	})

	function displayNews(url) { // we're putting in the url instead of sourceID of the newssource
		$(".container").html('') // making sure to clear the HTML so articles don't keep building on e/ other
		
		$.getJSON(url, function(data) {
			console.log(data.articles) // data is the entire blob of info we get from the API
			var articles = data.articles;  // var is same as let; get list of articles; list of dictionaires
			for (let articleIndex = 0; articleIndex < articles.length; articleIndex++){
				// console.log((articles[articleIndex]).title); // do we need to console.log each time?
				// console.log((articles[articleIndex]).urlToImage); // testing out image URL

				$("<div></div>", { // element you want to add through each iteration
					class: "article", // are we naming the attributes of the div here?
					id: 'article' + articleIndex,
					text: articles[articleIndex].title
					// url: articles[articleIndex].url
				}).appendTo(".container") // where you want to put the thing

				$("<img></img>", { 
					src: (articles[articleIndex]).urlToImage,
					class: "articleImage"
				}).prependTo('#article' + articleIndex) //use prepend to put before the article div and have image appear above

				$("<a></a>", {
					href: articles[articleIndex].url,
					class: "articleURL"
				}).appendTo('#article' + articleIndex) // pulling in URL correctly but not shown on page

				//$('.articleImage').wrap("<a" + articleURL + "</a>") // append link into container; article into link;
			}
		})

		// function displayNews(category, query) {
		// 	url = ''
		// 	if (category == "search") {
		// 		url = ...
		// 	} else if (category == "source") {
		// 		url = ...
		// 	}
		// }

		// displayNews("search", query)
		// displayNews("source", sourceId)
	}
	// (don't need_ above this - we should define event handler for update preferences which calls the function
	function displayNewsSources() {
		//$("#update-pref-modal").
		var url = "https://newsapi.org/v2/sources?apiKey=ea2a4ec8eee0414589d6711ddfdcfab0"
		$.getJSON(url, function(data) { //.getJSON makes a get request to the endpointCALLS THE FUNCTION. needs 2 inputs - URL, and a callback
			// console.log(data.sources) // debug data sources into console; list them out
			var datasource = (data.sources) // est. datasource variable; data.sources = dictionary of all news sources
			for (let sourceIndex = 0; sourceIndex < datasource.length; sourceIndex++) {
				var source = datasource[sourceIndex].name // prints names of news sources into console
				console.log(source)
				$("<div></div>", { 
					id: "data-source-entry" // creating a new class called data source enty (class or ID?)
					// text: source 
				}).appendTo("#update-pref-modal")

			}
		}) // ugh brackets :(

	}
})



	




		

		
	






// for (let articleIndex = 0; articleIndex < articles.length; articleIndex++) {
		// ((articles[articleIndex]).title)