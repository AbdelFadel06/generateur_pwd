

const range = document.getElementById("range");
const display_range_value = document.getElementById("range_value");
display_range_value.textContent = range.value;
let savedPasswords = [];


range.addEventListener('input', ()=>{
    display_range_value.textContent = range.value;
})

const generate = document.getElementById("generate");


const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

function updateStats() {
    const total = savedPasswords.length;
    const strongCount = savedPasswords.filter(p => p.score >= 70).length;
    const avgLength = total ? Math.round(savedPasswords.reduce((sum, p) => sum + p.password.length, 0) / total) : 0;

    document.getElementById("total_count").textContent = total;
    document.getElementById("strong_count").textContent = strongCount;
    document.getElementById("avg_length").textContent = avgLength;
}

function saveToLocalStorage(){
    localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem("savedPasswords");
    if (data) {
        savedPasswords = JSON.parse(data);
        savedPasswords.forEach(p => addPasswordToDOM(p.site, p.password, p.score, p.date));
        updateStats();
    }
}

function addPasswordToDOM(site, password, score, date) {
    const container = document.getElementById("saved_passwords");

    const colorClass = score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";

    const block = document.createElement("div");

    block.className = "bg-white flex border-l-4 border-blue-500 rounded px-5 items-center justify-between";
       block.innerHTML = `
        <div class="text-sm p-3">
            <h3 class="font-semibold">${site}</h3>
            <p>Créé le ${date}</p>
            <div class="flex items-center space-x-5">
                <p>Force: <span>${score}</span>/100</p>
                <div class="h-[15px] w-[15px] rounded-full ${colorClass}"></div>
            </div>
        </div>
        <div>
            <button class="bg-green-400 px-4 py-1 rounded text-white text-sm">Copier</button>
            <button class="bg-red-500 px-4 py-1 rounded text-white text-sm">Supprimer</button>
        </div>
    `
    ;

    block.querySelector(".bg-green-400").addEventListener("click", () => {
        navigator.clipboard.writeText(password);
        alert("Mot de passe copié !");
    });

    block.querySelector(".bg-red-500").addEventListener("click", () => {
        block.remove();
        savedPasswords = savedPasswords.filter(p => p.password !== password);
        saveToLocalStorage();
        updateStats();
    });

    
    container.prepend(block);

}


function savePassword(site, password, score) {
    const date = new Date().toLocaleDateString();
    savedPasswords.push({site, password, score, date });
    addPasswordToDOM(site, password, score, date);
    saveToLocalStorage();
    updateStats();
}




generate.addEventListener('click', (e)=>{

    e.preventDefault();

    const site = document.querySelector('input[type="text"]').value.trim();
   
   
    if (!site) {
        alert("Veuillez saisir le nom du site web");
        return;
    }


    let characters = "";

    if (document.getElementById("maj").checked) characters += uppercaseChars;
    if (document.getElementById("min").checked) characters += lowercaseChars;
    if (document.getElementById("num").checked) characters += numberChars;
    if (document.getElementById("sym").checked) characters += symbolChars;

    

    if (characters ===""){
        alert(
            "Veuillez selectionner au moins un type de caractere"
        );
        return;
    }



    const lenght = parseInt(range.value);


    let password = "";

    for(let i = 0; i< lenght; i++){
        const randomIndex = Math.floor(Math.random()*characters.length);
        password += characters[randomIndex];
    }

    document.getElementById('result').textContent = password;
    


    
        let score  = 0;

        if (password.length >= 8 && password.length <= 10) score += 20;
        else if (password.length >= 11 && password.length <= 14) score += 30;
        else if (password.length > 14) score += 40;

        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 10;

        let repeats = password.match(/(.)\1{2,}/g);
        if (!repeats) score += 20;
        else score += Math.max(0, 20 - repeats.length * 5);

        const strength = document.getElementById("pwd_strength");
        const strengthText = document.getElementById("strength_text");


            strength.textContent = score;

            if (score < 40) strengthText.textContent = "Faible";
            else if (score < 70) strengthText.textContent = "Moyen";
            else strengthText.textContent = "Fort";

    
    savePassword(site, password, score);



})




const result = document.getElementById("result");
const copyMessage = document.getElementById("copy-message");


result.addEventListener('click', ()=>{
    const result_copy = result.textContent

    navigator.clipboard.writeText(result_copy).then(() => {
      
      copyMessage.classList.toggle("hidden")
      setTimeout(() => {
        copyMessage.style.display = "none";
      }, 1500);
    }).catch(err => {
      console.error('Erreur lors de la copie :', err);
    });
})


window.addEventListener('load', () => {
    loadFromLocalStorage();
});
