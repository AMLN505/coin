import { el, setChildren, mount } from 'redom';
import { createExtendedInfoPage } from './extendedinfo-page.js';
import { router } from './header.js';

const options = {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
};

export class Account {
	constructor(container, accountObject) {
		this.body = el('li.accounts__item.account-item');
		this.number = el('h2.account-item__number', accountObject.account);
		this.balance = el(
			'p.account-item__balance',
			`${accountObject.balance.toLocaleString('ru-RU')} ₽`
		);
		this.lastTransactionHeading = el(
			'h3.account-item__lt-heading',
			'Последняя транзакция:'
		);
		if (accountObject.transactions.length != 0) {
			this.lastTransaction = el(
				'p.account-item__lt-date',
				new Date(accountObject.transactions[0].date)
					.toLocaleString('ru', options)
					.slice(0, -3)
			);
		} else {
			this.lastTransaction = el('p.account-item__lt-date', '');
		}

		this.button = el('button.account-item__button', 'Открыть', {
			onclick: () => {
				router.navigate(`accounts/${accountObject.account}`);
			},
		});

		setChildren(this.body, [
			this.number,
			this.balance,
			this.lastTransactionHeading,
			this.lastTransaction,
			this.button,
		]);

		mount(container, this.body);

		router.on(`accounts/${accountObject.account}`, () => {
			createExtendedInfoPage(accountObject.account);
		});
	}
}
