const form = document.querySelector('form');

const d = {
    async b(ra) {
        const apiUrl = 'https://aksor.vercel.app/post/submit';
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ numero: ra })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error);
        }
        
        return result;
    }
};

const a = {
    a: document.querySelector("input"), 
    b: document.querySelector("button"), 
    c: document.querySelector("p"), 
    d() { 
        form.addEventListener("submit", (t) => {
            t.preventDefault(); 
            e(); 
        });
        this.a.addEventListener("input", () => { this.h("") });
    },
    e() { 
        return this.a.value.trim();
    },
    g(enable) { 
        this.b.disabled = !enable;
    },
    h(message) { 
        this.c.textContent = message;
    }
};

async function e() {
    const ra = a.e();

    if (!ra) {
        return void a.h("Digite seu RA.");
    }
    
    if (isNaN(ra)) {
        return void a.h("O RA deve ser um número.");
    }
    
    const parsedRA = parseInt(ra, 10);
    
    if (parsedRA <= 7189 || parsedRA > 506999) {
        a.h("RA não encontrado.");
        return;
    }
    
    a.g(!1); 
    a.h("Confirmando...");
    
    try {
        const result = await d.b(ra); 
        
        a.h(result.message); 
        window.location.href = "ok/"; 
        
    } catch (error) {
        a.h("Prazo encerrado");
    } finally {
        a.g(!0); 
    }
}


a.d();
