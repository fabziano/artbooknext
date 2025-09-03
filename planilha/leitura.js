const SPREADSHEET_ID = '1xwBz5CrQ3es75YkNK2pxoLK8HtG-5I9dnjFpxfudiC8';

let itemList = [];

async function loadItems() {
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
    displayItems();
}

const displayItems = () => {
    const ul = document.getElementById('item-list');
    ul.innerHTML = '';

    itemList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
};

document.addEventListener('DOMContentLoaded', loadItems);
