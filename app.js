/* ---------------------------------------
   Effet machine à écrire (rejoue à chaque retour sur #home)
--------------------------------------- */
const subtitle = document.querySelector(".sous-titre");
const homeSection = document.querySelector("#home");

if (subtitle && homeSection) {
    const text = "La ville impériale du Japon.";
    let index = 0;
    let timerId = null;

    subtitle.classList.add("typing");

    function tick() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index++);
            timerId = setTimeout(tick, 80); // vitesse écriture
        } else {
            timerId = null; // terminé
        }
    }

    // Observe l’entrée/sortie de la section Accueil
    const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            // reset avant de rejouer
            subtitle.textContent = "";
            index = 0;
            if (!timerId) tick();
        }
    }, { threshold: 0.4 }); // #home est visible à au moins 40%

    io.observe(homeSection);
}




/* ---------------------------------------
		Menu burger
--------------------------------------- */
const menuBtn = document.querySelector('.logo-menu');
const navList = document.querySelector('.liste-nav');

menuBtn.addEventListener('click', () => {
	const open = navList.classList.toggle('active');
	menuBtn.setAttribute('aria-expanded', String(open));
	document.body.classList.toggle('no-scroll', open);
});

// Ferme le menu quand on clique sur un lien
document.querySelectorAll('.item-nav a').forEach(link => {
	link.addEventListener('click', () => {
		navList.classList.remove('active');
		menuBtn.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('no-scroll');
	});
});

// Réinitialise le menu quand on revient en desktop
window.addEventListener('resize', () => {
	if (window.innerWidth > 900) {
		navList.classList.remove('active');
		menuBtn.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('no-scroll');
	}
});



/* ---------------------------------------
	 Boutons "En savoir plus"
--------------------------------------- */
const moreBtns = document.querySelectorAll('.bloc button');
const itineraire = document.querySelector('#itineraire-3j');

moreBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		itineraire.scrollIntoView({ behavior: 'smooth' });
	});
});


/* ---------------------------------------
	 Compteur tarifs
--------------------------------------- */
const prices = document.querySelectorAll(".price");

function animateCounter(el) {
	const target = +el.dataset.target;
	let current = 0;
	const increment = Math.ceil(target / 100);

	function updateCounter() {
		current += increment;
		if (current < target) {
			el.textContent = current + "€";
			requestAnimationFrame(updateCounter);
		} else {
			el.textContent = target + "€";
		}
	}
	updateCounter();
}

// Observer → déclenche l’animation quand visible
const priceObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			animateCounter(entry.target);
			// priceObserver.unobserve(entry.target); // option : une seule fois
		}
	});
}, { threshold: 0.6 });

prices.forEach(price => priceObserver.observe(price));


/* ---------------------------------------
	 Formulaire de contact
--------------------------------------- */
const form = document.querySelector('.form-bloc');

// Validation en français pour les champs requis
form.querySelectorAll('[required]').forEach(input => {
	input.addEventListener('invalid', () => {
		if (input.validity.valueMissing) {
			input.setCustomValidity("Ce champ est obligatoire.");
		} else if (input.validity.typeMismatch && input.type === "email") {
			input.setCustomValidity("Veuillez entrer une adresse e-mail valide.");
		} else {
			input.setCustomValidity("");
		}
	});

	// Réinitialise le message quand l’utilisateur tape
	input.addEventListener('input', () => input.setCustomValidity(""));
});


// Message de confirmation
form.addEventListener('submit', (e) => {
	e.preventDefault();
	
	const msg = document.createElement('p');
	msg.textContent = "✅ Votre message a bien été envoyé !";
	msg.classList.add("confirmation");

	// Supprime un ancien message si déjà présent
	form.querySelector(".confirmation")?.remove();
	form.appendChild(msg);

	// Réinitialise le formulaire
	form.reset();

	// Supprime le message après 8s
	setTimeout(() => msg.remove(), 8000);

	// Effet confetti 🎉
	launchConfetti();
});

function launchConfetti() {
	const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#577590", "#9d4edd"];

	for (let i = 0; i < 30; i++) {
		const confetti = document.createElement("span");
		confetti.classList.add("confetti");
		confetti.style.left = Math.random() * 100 + "vw";
		confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
		confetti.style.animationDuration = 2 + Math.random() * 3 + "s";
		confetti.style.opacity = Math.random();

		document.body.appendChild(confetti);

		// Supprime après 8s
		setTimeout(() => confetti.remove(), 8000);
	}
}


/* ---------------------------------------
	 Effet fade-in au scroll
--------------------------------------- */
const faders = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries, obs) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			obs.unobserve(entry.target); // pour ne pas répéter
		}
	});
}, { threshold: 0.2 });

faders.forEach(el => fadeObserver.observe(el));


/* ---------------------------------------
	 FAQ (accordéon accessible + anim)
--------------------------------------- */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
	const btn = item.querySelector(".faq-question");
	const panel = item.querySelector(".faq-answer");

	// Crée un wrapper interne pour padding/anim
	if (!panel.querySelector('.faq-answer-inner')) {
		const wrap = document.createElement('div');
		wrap.className = 'faq-answer-inner';
		while (panel.firstChild) wrap.appendChild(panel.firstChild);
		panel.appendChild(wrap);
	}

	btn.addEventListener("click", () => {
		const isOpen = btn.getAttribute("aria-expanded") === "true";

		// Ferme les autres items (style accordéon)
		faqItems.forEach(other => {
			if (other !== item) {
				const oBtn = other.querySelector(".faq-question");
				const oPanel = other.querySelector(".faq-answer");
				if (oBtn.getAttribute("aria-expanded") === "true") {
					collapse(oPanel, oBtn, other);
				}
			}
		});

		if (isOpen) {
			collapse(panel, btn, item);
		} else {
			expand(panel, btn, item);
		}
	});
});

function expand(panel, btn, item) {
	item.classList.add("active");
	btn.setAttribute("aria-expanded", "true");
	panel.hidden = false;

	const start = panel.offsetHeight;
	const end = panel.scrollHeight;
	panel.style.height = start + "px";
	panel.style.transition = "height .28s ease";

	requestAnimationFrame(() => {
		panel.style.height = end + "px";
	});

	panel.addEventListener("transitionend", function onEnd() {
		panel.style.height = "";
		panel.style.transition = "";
		panel.removeEventListener("transitionend", onEnd);
	});
}

function collapse(panel, btn, item) {
	item.classList.remove("active");
	btn.setAttribute("aria-expanded", "false");

	const start = panel.offsetHeight;
	panel.style.height = start + "px";
	panel.style.transition = "height .24s ease";

	requestAnimationFrame(() => {
		panel.style.height = "0px";
	});

	panel.addEventListener("transitionend", function onEnd() {
		panel.hidden = true;
		panel.style.height = "";
		panel.style.transition = "";
		panel.removeEventListener("transitionend", onEnd);
	});
}


/* ---------------------------------------
	 Onglets Itinéraire 3 jours
--------------------------------------- */
const tabs = document.querySelectorAll('.it-tab');
const panels = document.querySelectorAll('.it-panel');

tabs.forEach(tab => {
	tab.addEventListener('click', () => {
		tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
		panels.forEach(p => p.hidden = true);

		tab.setAttribute('aria-selected', 'true');
		const panel = document.getElementById(tab.getAttribute('aria-controls'));
		if (panel) panel.hidden = false;
	});

	// Navigation clavier (← →)
	tab.addEventListener('keydown', (e) => {
		const i = [...tabs].indexOf(tab);
		if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); }
		if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
	});
});


/* ---------------------------------------
	 Barre de progression scroll
--------------------------------------- */
const progress = document.createElement('div');
progress.style.position = 'fixed';
progress.style.top = 0;
progress.style.left = 0;
progress.style.height = '4px';
progress.style.background = '#000';
progress.style.zIndex = 9999;
document.body.appendChild(progress);

window.addEventListener('scroll', () => {
	const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
		progress.style.width = `${scrolled * 100}%`;
});
