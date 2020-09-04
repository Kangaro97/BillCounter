export default class TableMaker {
  #infoTemplate = '<td colspan="2"><table class="table__info"><tr class="info__cell"><td class="info__shop" colspan="2">{{user}}</td></tr><tr class="info__cell"><td colspan="2">{{retailPlaceAddress}}</td></tr><tr><td class="info__cell cell--left"><span>ИНН</span><span class="info__inn">{{userInn}}</span></td><td class="info__cell cell--right"><span>Дата:</span><span class="info__date">{{dateTime}}</span></td></tr><tr><td class="info__cell cell--left"><span>Чек №</span><span class="info__number">{{requestNumber}}</span></td><td class="info__cell cell--right"><span class="info__type">{{operationType}}</span></td></tr><tr><td class="info__cell cell--left"><span>Смена №</span><span class="info__shift">{{shiftNumber}}</span></td><td class="info__cell cell--right"><span class="info__operator">{{operator}}</span></td></tr></table></td>';
  #itemListHeaderTemplate = '<th class="cell--left">Товар</th><th class="cell--right">Стоимость</th>';
  #itemTemplate = '<td class="cell--left">{{name}}</td><td class="cell--right"><div>{{sum}}</div><div class="minor-text"><span>{{price}}</span><span>×</span><span>{{quantity}}</span></div></td>';
  #totalTemplate = '<td class="cell--right">Итого:</td><td class="cell--right">{{totalSum}}</td>';
  #paymentTemplate = '<td colspan="2"><table class="table__payment minor-text"><tr><td class="cell--left">Наличными</td><td class="cell--right">{{cashTotalSum}}</td></tr><tr><td class="cell--left">Электронными</td><td class="cell--right">{{ecashTotalSum}}</td></tr><tr><td class="cell--left">НДС 20%</td><td class="cell--right">{{nds18}}</td></tr><tr><td class="cell--left">НДС 10%</td><td class="cell--right">{{nds10}}</td></tr></table></td>';
  #fiscalTemplate = '<td colspan="2"><table class="table__fiscal minor-text"><tr><td class="cell--left"><span>ФН №</span><span>{{fiscalSign}}</span></td><td class="cell--right"><span>ФД №</span><span>{{fiscalDocumentNumber}}</span></td></tr><tr><td class="cell--left"><span>ФПД</span><span>{{fiscalDriveNumber}}</span></td><td class="cell--right"><span>Рег. № ККТ</span><span>{{kktRegId}}</span></td></tr></table></td>';

  //удаление оставшихся макреров из-за отсутствия таких свойств в чеке
  #clearTemplate(template) {
    return template.replace(/{{[^}}]+}}/g, '');
  }

  #replaceKeysInTemplate(template, keys, data) {
    let innerHTML = template;
    if (Object.keys(keys).length != 0 && Object.keys(data).length != 0) {
      keys.forEach((key) => {
        innerHTML = innerHTML.replace('{{' + key + '}}', data[key]);
      });
    }
    innerHTML = this.#clearTemplate(innerHTML);
    return innerHTML;
  }

  #createRow(text) {
    let row = document.createElement('tr');
    row.className = 'table__row';
    row.innerHTML = text;
    return row;
  }

  createTable(bill) {
    let table = document.createElement('table');
    table.className = 'table';

    let keys = Object.keys(bill);
    let tableRows = {};
    tableRows.info = this.#createRow(
      this.#replaceKeysInTemplate(this.#infoTemplate, keys, bill)
    );
    tableRows.itemListHeader = this.#createRow(
      this.#replaceKeysInTemplate(this.#itemListHeaderTemplate, keys, bill)
    );
    for (let i = 0; i < bill.items.length; i++) {
      tableRows['item' + i] = this.#createRow(
        this.#replaceKeysInTemplate(
          this.#itemTemplate,
          Object.keys(bill.items[i]),
          bill.items[i]
        )
      );
    }
    tableRows.total = this.#createRow(
      this.#replaceKeysInTemplate(this.#totalTemplate, keys, bill)
    );
    tableRows.payment = this.#createRow(
      this.#replaceKeysInTemplate(this.#paymentTemplate, keys, bill)
    );
    tableRows.fiscal = this.#createRow(
      this.#replaceKeysInTemplate(this.#fiscalTemplate, keys, bill)
    );

    for (const key in tableRows) {
      if (tableRows.hasOwnProperty(key)) {
        table.append(tableRows[key]);
      }
    }

    return table;
  }
}
