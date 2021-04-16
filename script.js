/**
 *  calling the People API to create the Characters Dropdown 
 */
var filmsList;
swapiModule.getFilms().then(function (res) {
	filmsList = res.results;
	swapiModule.getPeople().then(function (res) {
		createPeopleDropDown(res.results)
	}, function (err) {
		alert('failure')
	})
}, function (err) {
	alert('failure')
})

/**
 * 
 * this will be called when the dropdown values get changed
 * will call the individual api to get the list of Films
 */
function changeValue() {
	document.getElementById('spinner').className = 'd-block';
	let val = document.getElementById('character').value;
	if (val) {
		document.getElementById("listContainer") ? document.getElementById("listContainer").remove() : "";
		document.getElementById("lastMovie") ? document.getElementById("lastMovie").remove() : "";
		var id = val.split("/")[5];
		swapiModule.getPerson(id).then(function (res) {
			showFilms(res.films);
		}, function (err) {
			alert('failure')
		})
	} else {
		console.log('nothing selected');
	}
}

/**
 * 
 * show the list of films 
 * we are creating the dynamic elements.
 * 
 */
function showFilms(charFilms) {
	var filmNames = [];
	charFilms.forEach(function (filmUrl) {
		var filmData = filmsList.find(function (film) {
			return film.url == filmUrl
		})

		filmNames.push({
			name: filmData.title,
			year: filmData.release_date.split("-")[0]
		})
	});

	// create the html elements
	var listContainer = document.createElement("div");
	listContainer.id = "listContainer";

	var lastMovie = document.createElement("div");
	lastMovie.id = "lastMovie";
	lastMovie.innerHTML = "Last Movie Details";

	var lastMovieData = document.createElement("span");
	lastMovieData.id = "lastMovieData";
	lastMovie.appendChild(lastMovieData);

	for (const film of filmNames) {
		var newNode = document.createElement('div');
		newNode.className = 'film';
		newNode.innerHTML = film.name;
		lastMovieData.innerHTML = film.name + " - " + film.year;
		listContainer.appendChild(newNode);
	}
	//appending the movies list
	document.getElementById("container").appendChild(listContainer);
	//appending the last movies details
	document.getElementById("container").appendChild(lastMovie);
	document.getElementById('spinner').className = 'd-none';
}

/**
 * 
 * create the dropdown 
 * 
 */
function createPeopleDropDown(people) {
	var select = document.createElement("select");
	select.name = "character";
	select.id = "character";
	select.className = "form-select form-select-lg";

	var selectOption = document.createElement("option");
	selectOption.value = "";
	selectOption.text = 'Select a character';
	select.appendChild(selectOption);
	for (const val of people) {
		var option = document.createElement("option");
		option.value = val.url;
		option.text = val.name;
		select.appendChild(option);
	}

	// creating the dropdown element
	document.getElementById("container").appendChild(select);
	//adding the onchange event listener
	document.querySelector('#container select').addEventListener('change', changeValue);
	document.getElementById('spinner').className = 'd-none';
}
