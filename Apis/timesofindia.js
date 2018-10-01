var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=0017701c97394b24ad46555491db3411';
var req = new Request(url);
fetch(req)
    .then(function(response) {
        console.log(response.json());
    })