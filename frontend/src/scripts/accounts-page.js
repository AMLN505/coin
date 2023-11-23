import { el, mount, setChildren } from 'redom';
import { getAccounts, createAccount } from './api.js';
import { Account } from './account-class.js';
import Choices from 'choices.js';
import { createError } from './errors.js';

function createAccountsPageSkeleton(container) {
	const $skeleton = el('ul.accounts__acc-skeleton.acc-skeleton');
	mount(container, $skeleton);

	for (let i = 0; i < 6; i++) {
		const $skelenonItem = el('li.acc-skeleton__item');
		mount($skeleton, $skelenonItem);
	}
}

export async function createAccountsPage() {
	const $main = document.querySelector('main');
	const token = localStorage.getItem('token');

	const $container = el('.accounts');
	setChildren($main, $container);

	const $navigationBlock = el('.accounts__top');
	const $accountsList = el('ul.accounts__list');
	setChildren($container, [$navigationBlock, $accountsList]);

	const $heading = el('h1.accounts__heading', 'Ваши счета');
	const $sort = el('select.accounts__sort');
	const $addButton = el(
		'button.accounts__button',
		{ disabled: true },
		'Создать новый счёт'
	);
	setChildren($navigationBlock, [$heading, $sort, $addButton]);
	createAccountsPageSkeleton($container);

	const $sortByNumber = el(
		'option.accounts__sort-option',
		{ value: 'number' },
		'По номеру'
	);
	const $sortByBalance = el(
		'option.accounts__sort-option',
		{ value: 'balance' },
		'По балансу'
	);
	const $sortByLastTransaction = el(
		'option.accounts__sort-option',
		{ value: 'last-transaction' },
		'По последней транзакции'
	);
	const $sortPlaceholder = el(
		'option.accounts__sort-option',
		{ value: 'placeholder' },
		'Сортировка'
	);
	setChildren($sort, [
		$sortPlaceholder,
		$sortByNumber,
		$sortByBalance,
		$sortByLastTransaction,
	]);

	const choices = new Choices($sort, {
		searchEnabled: false,
		itemSelectText: '',
		shouldSort: false,
	});

	choices.disable();

	$sort.addEventListener('change', () => {
		$accountsList.innerHTML = '';
		console.log(accountsArray.payload);

		switch ($sort.value) {
			case 'number':
				accountsArray.payload = accountsArray.payload.sort(
					(a, b) => a.account - b.account
				);
				break;
			case 'balance':
				accountsArray.payload = accountsArray.payload.sort(
					(a, b) => a.balance - b.balance
				);
				break;
			case 'last-transaction':
				accountsArray.payload = accountsArray.payload.sort(function (
					a,
					b
				) {
					if (
						a.transactions.length == 1 &&
						b.transactions.length == 0
					) {
						return 1;
					} else if (
						b.transactions.length == 1 &&
						a.transactions.length == 0
					) {
						return -1;
					} else if (
						a.transactions.length == 0 &&
						b.transactions.length == 0
					) {
						return 0;
					} else
						return new Date(a.transactions[0].date) >
							new Date(b.transactions[0].date)
							? 1
							: new Date(b.transactions[0].date) >
							  new Date(a.transactions[0].date)
							? -1
							: 0;
				});
				break;
		}
		renderAccounts();
	});

	$addButton.addEventListener('click', async () => {
		const accountItem = await createAccount(token);
		if (accountItem.error) {
			createError(accountItem.error);
		} else {
			new Account($accountsList, accountItem.payload);
			accountsArray.payload.push(accountItem.payload);
		}
	});

	function renderAccounts() {
		if (accountsArray.payload.length != 0) {
			for (const oneAccount of accountsArray.payload) {
				new Account($accountsList, oneAccount);
			}
		}
	}

	const accountsArray = await getAccounts(token);
	if (accountsArray.error) {
		createError(accountsArray.error);
	} else {
		if (document.querySelector('.acc-skeleton')) {
			document.querySelector('.acc-skeleton').remove();
		}
		$addButton.disabled = false;
		choices.enable();
		renderAccounts();
	}
}
