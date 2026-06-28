const pet = document.createElement('img');
pet.id = 'custom-chrome-pet';
pet.className = 'floating-element';

pet.src = chrome.runtime.getURL('idle.png');

document.body.appendChild(pet);

pet.addEventListener('click', () => {
    pet.src = chrome.runtime.getURL('happy.png');

    setTimeout(() => {
        pet.src = chrome.runtime.getURL('idle.png');
    }, 2000);

});

function injectPet() {
    if (document.body && !document.body.contains(pet)) {
        document.body.appendChild(pet);
        console.log("Pet image safely injected!");
    }
}

if (document.body) {
    injectPet();
} else {
    window.addEventListener('DOMContentLoaded', injectPet);
}

const observer = new MutationObserver(() => {
    if (document.body && !document.body.contains(pet)) {
        injectPet();
    }
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

