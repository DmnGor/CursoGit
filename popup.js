document.addEventListener('DOMContentLoaded', function() {
    const wordElement = document.getElementById('word');
    const translationElement = document.getElementById('translation');
    const showTranslationButton = document.getElementById('showTranslation');
    const nextFlashcardButton = document.getElementById('nextFlashcard');

    let vocabulario = {};
    let currentWord = '';

    // Función para cargar datos del JSON y guardarlos en localStorage
    function loadDataFromJSON() {
        const jsonURL = chrome.runtime.getURL('vocabulario.json');
        
        fetch(jsonURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('vocabulario', JSON.stringify(data['en-es']));
                vocabulario = data['en-es'];
                mostrarNuevaFlashcard();
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
                wordElement.textContent = 'Error al cargar datos';
            });
    }

    // Función para cargar datos desde localStorage
    function loadDataFromLocalStorage() {
        const storedData = localStorage.getItem('vocabulario');
        if (storedData) {
            vocabulario = JSON.parse(storedData);
            mostrarNuevaFlashcard();
        } else {
            loadDataFromJSON(); // Si no hay datos en localStorage, cargar del JSON
        }
    }

    function mostrarNuevaFlashcard() {
        const palabras = Object.keys(vocabulario);
        if (palabras.length === 0) {
            wordElement.textContent = 'No hay palabras disponibles';
            return;
        }
        currentWord = palabras[Math.floor(Math.random() * palabras.length)];
        wordElement.textContent = currentWord;
        translationElement.textContent = '';
    }

    function mostrarTraduccion() {
        if (vocabulario[currentWord]) {
            translationElement.textContent = vocabulario[currentWord].translation;
        } else {
            console.error('La palabra actual no tiene una traducción en el vocabulario');
            translationElement.textContent = 'Traducción no disponible';
        }
    }

    showTranslationButton.addEventListener('click', mostrarTraduccion);
    nextFlashcardButton.addEventListener('click', mostrarNuevaFlashcard);

    // Cargar datos desde localStorage al iniciar
    loadDataFromLocalStorage();
});
