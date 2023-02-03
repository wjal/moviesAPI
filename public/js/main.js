let page = 1;
let perPage = 10;


//checks if each movie has a rating.  If so returns rating, else return 'N/A'
checkRating = (rating) =>{
    if(rating === 'UNRATED' || rating === `NOT RATED` || rating === undefined){
        return `N/A`
    }else
        return rating;
}

//convert the runtime in minutes to hours and minutes.  return in a string
convertRuntime = (time) =>{
    let hours = Math.floor(time/60);
    let minutes = (time % 60).toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
}

//update the current page of results
currentPage = (page) => {
    document.querySelector('#current-page').innerHTML = page;
}

displayPagination = (data) =>{
    if(data.length < perPage){
        paginator.classList.add('d-none'); //hide the pagination when the amount of movies is less than per page
    }else{
        paginator.classList.remove('d-none'); //show the pagination element when more movies to display that the perPage
        }
    currentPage(page);
}



//promise based, receives movie array returned to api/movies/ and populates table rows. 
//resolves with rows in string literal for table rows 
createTableRow = (data) =>{
    return new Promise ((resolve, reject) => {
        let postRows = `
            ${data.map(post => (
                `<tr data-id=${post._id}>
                    <td>${post.year}</td>
                    <td>${post.title}</td>
                    <td>${post.plot}</td>
                    <td>${checkRating(post.rated)}</td>
                    <td>${convertRuntime(post.runtime)}</td>
                </tr>`
            )).join('')}
        `;
        resolve(postRows);
    })
}




setModalTitle = (data) => { 
        document.querySelector('#movie-title').innerHTML = `${data.title}`;
}


//only returns image tag if there is a poster for the movie object.
checkImage = (data) =>{
    if (data.poster){
        return `<img class="img-fluid w-100" src="${data.poster}"></img>`;
    }
    return ``;
}
//check for and return if full plot is available.  if not return the plot value.  some movies dont have full plot
checkPlot = (data) => {
    if(data.fullplot){
        return `<p>${data.fullplot}</p>`
    }
    return `<p>${data.plot}</p>`
}



createBodyContent = (data) => {
    return new Promise ((resolve, reject) => {
        let content = `
            ${checkImage(data)}<br><br>
            <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
            ${checkPlot(data)}
            <strong>Cast:</strong> ${data.cast.join(', ')}<br><br>
            <strong>Awards:</strong> ${data.awards.text}<br>
            <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} Votes)`
        resolve(content);
    });
}

//add the content of a clicked movie row to the modal window body

setModalBody = (data) => {
    createBodyContent(data)
    .then(content=>{
        document.querySelector('#modal-body').innerHTML = content;
    })
}



addClickEventsToRows = () =>{
    document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
    row.addEventListener('click', (e) => {
      let clickedId = row.getAttribute('data-id');
      
      fetch(`api/movies/${clickedId}`)
        .then((res) => res.json())
        .then((data) => {
            setModalTitle(data);
            setModalBody(data);
        }).then(()=>{
            let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                    backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
                    keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
                    focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
                });
                myModal.show();
            })
        })
    })
}

noResults = (data) => {
    //if no results then make noResults div visible.  hidden if no results.  Starts as hidden on first DOMLoad            
    if(data.length >= 1)
    document.querySelector('#noResults').style.visibility = 'hidden';
    else
    document.querySelector('#noResults').style.visibility = 'visible';
}


//load movie data.  first fetch the url, with appropriate page number and title.  perPage is set to 10.
//use createTableRow function to map the data to table rows.  checks for rating, and converts runtime within that function. use promise to make sure click events are added after id has been set for a row
//addClickEvents
//


loadMovieData = (title = null) => {
    
    let paginator = document.getElementById('paginator');
    
    let url =  title ? `/api/movies?page=${page}&perPage=${perPage}&title=${title}`
                    : `/api/movies?page=${page}&perPage=${perPage}`;
      
    fetch(url)
    .then((res) => res.json())
    .then((data) => {     
        createTableRow(data)
        .then(postRows=>{
            document.querySelector('#moviesTable tbody').innerHTML = postRows;
        }).then(()=>{
            addClickEventsToRows();
                
        })
        //if no results then make noResults div visible.  hidden if no results.
        noResults(data);
        //check length of array of movies returned.  More than perPage, then hide the pagination element
        displayPagination(data);
    }); 
}





///////////////////////////////////////////////////////////
//
// Event listeners on DOMContentLoaded
//
///////////////////////////////////////////////////////////





document.addEventListener('DOMContentLoaded', function(){
    //load on dom load
    loadMovieData();
    //clickEvent for previous page button of pagination
    document.querySelector('#previous-page').addEventListener('click', (event)=>{
        if(page > 1)
        page -= 1;
        loadMovieData();
    })
    //click event for next page button of pagination
    document.querySelector('#next-page').addEventListener('click', (event)=>{
        //if(page > 1)
        page += 1;
        loadMovieData();
    })
    //event listener for submission of searchForm.  sets title for loadMovieData function to the value of #title form
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        // prevent the form from from 'officially' submitting
        event.preventDefault();
        // set page back to 1 for search results
        page = 1;
        loadMovieData(document.querySelector('#title').value);
      });
      
     document.querySelector('#clearForm').addEventListener('click', (event) => {
        // set page back to 1 after clearing, returns to full results
        page = 1;
        document.querySelector('#title').value = '';
        loadMovieData();
    });

})
