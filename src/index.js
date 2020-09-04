import './css/main.css';
import processFile from './js/processing'
import TableMaker from './js/table-maker'
import billsJSON from './assets/extract.json'

let bills = JSON.parse(JSON.stringify(billsJSON)).reverse()[4].ticket.document.receipt;
console.log(bills);
let uploadError = document.getElementById('upload__error');
let uploadInput = document.getElementById('upload__input');
let uploadForm = document.getElementById('upload__form');

let page = document.getElementById('page');

uploadInput.addEventListener('change', () => {
  processFile(uploadInput.files[0]).then(response => {
    uploadForm.style.display = 'none';
    page.classList.add('table__container');

    let tableMaker = new TableMaker();
    let tables = response.map((bill) => {
      return tableMaker.createTable(bill.ticket.document.receipt);
    });
    tables.reverse();

    let tableWrapper = document.createElement('div');
    tableWrapper.className = 'table__wrapper';
    tables.forEach((table) => {
      tableWrapper.append(table);
    })

    page.append(tableWrapper);

    console.log(bills[4].ticket.document.receipt)
  }).catch(() => {
    uploadError.style.display = 'block';
    setTimeout(() => {
      uploadError.style.display = 'none';
    }, 4000);
  });
});