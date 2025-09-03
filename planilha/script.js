const SPREADSHEET_ID = '1xwBz5CrQ3es75YkNK2pxoLK8HtG-5I9dnjFpxfudiC8';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwEOXdEU_ZubUOHxrG2yVDay_HBmY344JI7mQyonU21K1YSP6DvjxiAuGMmwcwyWV56/exec';

let itemList = [];

const displayList = () => {
    const ul = document.getElementById('item-list');
    ul.innerHTML = '';
    itemList.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.style.marginLeft = '10px';
        deleteButton.onclick = () => deleteItem(index);
        li.appendChild(deleteButton);
        ul.appendChild(li);
    });
};

async function loadList() {
    const query = encodeURIComponent('Select A where A is not null');
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tq=${query}`;
    try {
        const response = await fetch(gvizUrl);
        const responseText = await response.text();
        const jsonString = responseText.match(/google\.visualization\.Query\.setResponse\((.*)\)/s)[1];
        const gvizData = JSON.parse(jsonString);
        itemList = gvizData.table.rows.map(row => row.c[0] ? row.c[0].v : '');
    } catch (error) {
        itemList = [];
    }
    displayList();
}

async function saveList() {
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(itemList)
        });
    } catch (error) {
        console.error('Erro ao salvar:', error);
    }
}

const addItem = (text) => {
    itemList.push(text);
    displayList();
    saveList();
};

const deleteItem = (index) => {
    itemList.splice(index, 1);
    displayList();
    saveList();
};

document.getElementById('add-item-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('item-text');
    if (input.value.trim()) {
        addItem(input.value.trim());
        input.value = '';
    }
});

document.addEventListener('DOMContentLoaded', loadList);