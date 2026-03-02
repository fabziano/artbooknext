class AppLayout extends HTMLElement {
    connectedCallback() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        document.body.insertAdjacentHTML('afterbegin', `
            <header>
                <nav>
                    <a href="index.html" class="${currentPath === 'index.html' ? 'active' : ''}">Início</a>
                    <a href="faculdade.html" class="${currentPath === 'faculdade.html' ? 'active' : ''}">Faculdade</a>
                </nav>
            </header>
        `);
        
        this.remove();
    }
}
customElements.define('app-layout', AppLayout);