fetch("http://localhost:5678/api/works").then(function (reponse) {
      return reponse.json();
}).then(function(json){
    console.log(json)
    generateWorks(json);
});

function generateWorks(works){
    for (let i = 0; i < works.length; i++) {

        const work = works[i];

        const sectionGallery = document.querySelector(".gallery");
        const workElement = document.createElement("figure");

        const imgElement = document.createElement("img");
        imgElement.src = work.imageUrl;

        const nomElement = document.createElement("figcaption");
        nomElement.innerText = work.title;
        
        sectionGallery.appendChild(workElement);
        workElement.appendChild(imgElement);
        workElement.appendChild(nomElement);
    
     }
}