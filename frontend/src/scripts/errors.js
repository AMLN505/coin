import { el, setChildren, mount } from 'redom';

export function createError(text) {
	const $container = document.querySelector('.errors');
	const $item = el('.errors__item');
	mount($container, $item);

	const $text = el('p.errors__text', text);
	const $closeButton = el('button.errors__close-button');
	setChildren($item, [$text, $closeButton]);

	$closeButton.addEventListener('click', () => {
		$item.remove();
	});

	setTimeout(() => {
		if ($item) {
			$item.remove();
		}
	}, 5000);
}
