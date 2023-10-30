fetch("http://localhost:5678/api/works").then(function (reponse) {
      return reponse.json();
}).then(function(json){
    console.log(json)
    generateWorks(json);
});