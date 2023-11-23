import { el, setChildren, unmount } from 'redom';
import {
	createNavBlock,
	createTransactionsBlock,
} from './extendedinfo-page.js';
import { Dynamic, DynamicFromTo } from './dynamic-class.js';
import { getInfoAboutAccount } from './api.js';
import { createError } from './errors.js';

export async function createPayHistoryPage(accNumber) {
	const token = localStorage.getItem('token');

	const $main = document.querySelector('main');
	const $container = el('.pay-history');
	setChildren($main, $container);

	const $navSkeleton = el('.pay-history__nav-skeleton.nav-skeleton');
	const $grid = el('.pay-history__grid');
	setChildren($container, [$navSkeleton, $grid]);

	const $dynamicSkeleton = el(
		'.pay-history__dynamic-skeleton.dynamic-skeleton.dynamic-skeleton_year'
	);
	const $fromToSkeleton = el(
		'.pay-history__dynamic-skeleton.dynamic-skeleton.dynamic-skeleton_year'
	);
	const $transSkeleton = el(
		'.pay-history__transactions-skeleton.transactions-skeleton.transactions-skeleton_year'
	);
	setChildren($grid, [$dynamicSkeleton, $fromToSkeleton, $transSkeleton]);

	const response = await getInfoAboutAccount(token, accNumber);
	if (response.error) {
		createError(response.error);
	} else {
		createNavBlock(
			response.payload,
			$container,
			'История баланса',
			`accounts/${response.payload.account}`,
			'pay-history'
		);

		new Dynamic(response.payload, $grid, 'pay-history', 12).createChart();
		new DynamicFromTo(
			response.payload,
			$grid,
			'pay-history',
			12
		).createChart();
		createTransactionsBlock(response.payload, $grid, 'pay-history');

		const $historyBlock = document.querySelector('.transactions');
		const $dynamicBlock = document.querySelector('.dynamic_year');
		const $fromToBlock = document.querySelectorAll('.dynamic_from-to');

		if (
			$dynamicBlock &&
			$historyBlock &&
			$fromToBlock &&
			document.querySelector('.nav')
		) {
			unmount($grid, $dynamicSkeleton);
			unmount($grid, $fromToSkeleton);
			unmount($grid, $transSkeleton);
			unmount($container, $navSkeleton);
		}
	}
}
