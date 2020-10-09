// CONSTANTES

const affichage = document.querySelector('.affichage');
const btns = document.querySelectorAll('button');           // Renvoie un tableau avec plusieurs éléments
const inputs = document.querySelectorAll('input');
const infoTxt = document.querySelector('.info-txt')
let dejaFait = false;

// DATE

const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // Ajout une semaine en millisecondes

let day = ('0' + nextWeek).slice(9, 11);                   // Transformer objet date en string, slice pour récupérer le jour
let month = ('0' + (today.getMonth() + 1)).slice(-2);      // Décompte de 1 à 11
let year = today.getFullYear();

document.querySelector('input[type=date]').value = `${year}-${month}-${day}`;   // Format international (y-m-d)



// BOUTONS 

btns.forEach(btn => {
    btn.addEventListener('click', btnAction)    // Pour chaque btn on déclenche un event click qui va lancer une fonction
})


function btnAction(e) {    
    
    let nouvelObj = {};             // Objet plus simple pour définir propriétes : valeur

    inputs.forEach(input => {
        let attrName = input.getAttribute('name');   // GetAttribute : methode qui retourne l'attr d'un élement (input)
        let attrValeur = attrName !== "cookieExpire" ? input.value : input.valueAsDate;
        nouvelObj[attrName] = attrValeur
        
        // Est-ce que attrName est différent de cookieExpire : si oui on prend la value de l'input, sinon la valueAsDate(format spécial pour les dates)
    })
    // console.log(nouvelObj);

    let description = e.target.getAttribute('data-cookie');  // élément sur lequel j'ai cliqué
    
    // console.log(description)  // "creer ou toutAfficher"

    if (description === "creer") {
        creerCookie(nouvelObj.cookieName, nouvelObj.cookieValue, nouvelObj.cookieExpire)
    }
    else if (description === "toutAfficher") {
        listeCookies();
    }
}



// FUNCTION CREER COOKIE 

function creerCookie(name, value, exp) {

    infoTxt.innerText = "";

    affichage.innerHTML = "";   // Remettre à 0 si les cookies sont affichés et que l'on en créé un nouveau

    // TEST si le cookie a le meme nom
    let cookies = document.cookie.split(';');  // Transformer les éléments en tableau avec split 
    
    cookies.forEach(cookie => {
        
        cookie = cookie.trim();                     // Enlève les espaces vides
        let formatCookie = cookie.split('=');       // Tableau avec caract de chaque cookie ["Robe", "50"]
        console.log(formatCookie);

        if(formatCookie[0] === encodeURIComponent(name)) {
            dejaFait = true;
        }
    })

    if(dejaFait) {
        infoTxt.innerText = "Un cookie possède déjà ce nom !";
        dejaFait = false;
        return
    }

   


    // TEST si le cookie n'a pas de nom
    if (name.length === 0) {
        infoTxt.innerText = `Impossible de définir un cookie sans nom`;
        return;
    }


    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${exp.toUTCString()}`;
    let info = document.createElement('li');
    info.innerText = `Cookie ${name} créé.`
    affichage.appendChild(info);
    
    setTimeout(() => {
        info.remove();              // Message info qui s'efface au bout de 2s
    }, 2000)


}



// FUNCTION AFFICHER LISTE COOKIES

function listeCookies() {

    let cookies = document.cookie.split(';');
    console.log(cookies);

    if (cookies.join() === "") {                    // Tranforme le tableau cookies en chaines de caractères
        infoTxt.innerText = "Pas de cookies à afficher"
        return;
    }
  
    cookies.forEach(cookie => {

        cookie.trim();
        let formatCookie = cookie.split('=');
        // console.log(formatCookie);

        let item = document.createElement('li');

        infoTxt.innerText = "Cliquer sur un cookie dans la liste pour le supprimer";
        item.innerText = `Nom du cookie : ${decodeURIComponent(formatCookie[0])}, Valeur : ${decodeURIComponent(formatCookie[1])} `;
        affichage.appendChild(item);


        // SUPPRIMER COOKIE

        item.addEventListener('click', () => {

            document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`;
            item.innerText = `Cookie ${formatCookie[0]} supprimé`;
            
            setTimeout(() => {
                item.remove();
            }, 1000)
        })

    })

}