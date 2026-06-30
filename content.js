console.log("PET EXTENSION IS ACTIVE!");

const PetController = {
    pet: null,
    currentFrame: 0,
    frames: ['idle.png', 'swim2.png'],
    isInteracting: false,
    animationTimer: null,
    currentX: 100,
    targetX: 100,
    swimSpeed: 2,
    isFlipped: false,

    init() {
        if (this.pet) return;

        this.pet = document.createElement('img');
        this.pet.id = 'custom-chrome-pet';
        this.pet.className = 'floating-element';
        this.pet.src = chrome.runtime.getURL('idle.png');

        this.pet.addEventListener('click', () => this.handleHandshakeClick());

        this.inject();
    },

    inject() {
        if (document.body && !document.body.contains(this.pet)) {
            document.body.appendChild(this.pet);
            console.log("Pet image safely injected!");
            this.startLoopEngines();
        }
    },

    startLoopEngines() {
        if (!this.animationTimer) {
            this.animationTimer = setInterval(() => this.swimanimation(), 200);
            this.chooseNewDestination();
            this.updateMovement();
        }
    },

    swimanimation() {
        if (!this.pet || this.isInteracting) return;
        if (!chrome.runtime || !chrome.runtime.id) return;

        this.currentFrame = (this.currentFrame + 1) % this.frames.length;

        if (this.pet) {
            this.pet.src = chrome.runtime.getURL(this.frames[this.currentFrame]);
        }
    },


    updateMovement() {
        if (!this.pet || this.isInteracting) {
            requestAnimationFrame(() => this.updateMovement());
            return;
        }

        if (this.currentX < this.targetX) {
            this.currentX += this.swimSpeed;
            this.isFlipped = true;
        } else if (this.currentX > this.targetX) {
            this.currentX -= this.swimSpeed;
            this.isFlipped = false;
        }

        if (this.pet) {
            this.pet.style.left = this.currentX + 'px';

            if (this.isFlipped) {
                this.pet.style.setProperty('transform', 'scaleX(1)', 'important');
                this.swimSpeed = Math.floor(Math.random() * 3);
            } else {
                this.pet.style.setProperty('transform', 'scaleX(-1)', 'important');
                this.swimSpeed = Math.floor(Math.random() * 3);
            }
        }

        requestAnimationFrame(() => this.updateMovement());
    },

    chooseNewDestination() {
        if (!chrome.runtime || !chrome.runtime.id) return;

        const actualWidth = window.innerWidth || document.documentElement.clientWidth || 1000;
        const maxScreenWidth = actualWidth - 150;
        const currentScreenMiddle = maxScreenWidth / 2;

        if (maxScreenWidth < 200) {
            this.targetX = 50;
        }

        else if (this.currentX < currentScreenMiddle) {
            this.targetX = currentScreenMiddle + Math.floor(Math.random() * (currentScreenMiddle - 50));
        }
        else {
            this.targetX = Math.floor(Math.random() * (actualWidth));
        }

        const nextDecisionTime = 500 + Math.random(0, 10) * 30;
        setTimeout(() => this.chooseNewDestination(), nextDecisionTime);
    },

    handleHandshakeClick() {
        if (!this.pet) return;
        this.isInteracting = true;

        if (chrome.runtime && chrome.runtime.id) {
            this.pet.src = chrome.runtime.getURL('happy.png');
        }

        setTimeout(() => {
            if (chrome.runtime && chrome.runtime.id && this.pet) {
                this.currentFrame = 0;
                this.pet.src = chrome.runtime.getURL(this.frames[this.currentFrame]);
            }
            this.isInteracting = false;
        }, 2000);
    }
};

if (document.body) {
    PetController.init();
} else {
    window.addEventListener('DOMContentLoaded', () => PetController.init());
}

const observer = new MutationObserver(() => {
    if (document.body) {
        PetController.inject();
    }
});
observer.observe(document.documentElement, { childList: true, subtree: true });
