import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
collection,
getDocs,
addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAnOVab4rmcr1QzUy8z9sj01mzEujNAcKw",
  authDomain: "store-one-dripe-2766a.firebaseapp.com",
  projectId: "store-one-dripe-2766a",
  storageBucket: "store-one-dripe-2766a.firebasestorage.app",
  messagingSenderId: "845635604631",
  appId: "1:845635604631:web:37b13ed9ee4f2827d759d2"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let panier = [];

async function chargerProduits(){

    const produitsDiv = document.getElementById("products");

    produitsDiv.innerHTML = "";

    const snapshot = await getDocs(collection(db,"products"));

    snapshot.forEach((doc)=>{

        const p = doc.data();

        produitsDiv.innerHTML += `

        <div class="card">

            <img src="${p.image}" alt="${p.name}">

            <h3>${p.name}</h3>

            <p>${p.description}</p>

            <div class="price">${p.price} DH</div>

            <button onclick="ajouterPanier('${p.name}',${p.price})">

                Ajouter au panier

            </button>

        </div>

        `;

    });

}

chargerProduits();
// ==========================
// Ajouter au panier
// ==========================

window.ajouterPanier = function(name, price){

    panier.push({
        name: name,
        price: Number(price)
    });

    afficherPanier();

};


// ==========================
// Afficher le panier
// ==========================

function afficherPanier(){

    const panierDiv = document.getElementById("panier");
    const totalSpan = document.getElementById("total");

    if(panier.length === 0){

        panierDiv.innerHTML = "Votre panier est vide";
        totalSpan.textContent = "0";

        return;

    }

    let html = "";
    let total = 0;

    panier.forEach((p,index)=>{

        total += p.price;

        html += `

        <p>

            <span>${p.name} - ${p.price} DH</span>

            <button onclick="supprimerProduit(${index})">

                Supprimer

            </button>

        </p>

        `;

    });

    panierDiv.innerHTML = html;

    totalSpan.textContent = total;

}


// ==========================
// Supprimer produit
// ==========================

window.supprimerProduit = function(index){

    panier.splice(index,1);

    afficherPanier();

};
// ==========================
// Confirmation de commande
// ==========================

const formulaire = document.getElementById("commandeForm");

formulaire.addEventListener("submit", async function(e){

    e.preventDefault();

    if(panier.length === 0){

        alert("Votre panier est vide !");

        return;

    }

    const formData = new FormData(formulaire);

    const commande = {

        nom: formData.get("nom"),

        prenom: formData.get("prenom"),

        telephone: formData.get("telephone"),

        adresse: formData.get("adresse"),

        panier: panier,

        total: panier.reduce((total,p)=>total+p.price,0),

        date: new Date().toLocaleString("fr-FR")

    };

    try{

        await addDoc(
            collection(db,"commandes"),
            commande
        );

        alert("Commande envoyée avec succès !");

        panier=[];

        afficherPanier();

        formulaire.reset();

    }
    catch(error){

        console.error(error);

        alert("Erreur lors de l'envoi de la commande.");

    }

});