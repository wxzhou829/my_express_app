var form = document.querySelector('form');
form.onsubmit = function(e){
	var genre_input  = document.getElementById('name').value.trim();
	if (!genre_input){
		e.preventDefault();
	}
}
