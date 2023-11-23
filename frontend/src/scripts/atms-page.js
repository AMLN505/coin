import { el, setChildren, unmount } from 'redom';
import { getBanks } from './api.js';
import ymaps from 'ymaps';
import { createError } from './errors.js';

export async function createATMsPage() {
	const $main = document.querySelector('main');
	const $container = el('.atms');
	setChildren($main, $container);

	const $heading = el('h1.atms__heading', 'Карта банкоматов');
	const $map = el('.atms__map');
	setChildren($container, [$heading, $map]);

	const $skeleton = el('.atms__skeleton.atms-skeleton');
	setChildren($map, $skeleton);

	const atmsArray = await getBanks();

	if (atmsArray.error) {
		createError(atmsArray.error);
	} else {
		ymaps
			.load(
				'https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=API_KEY'
			)
			.then((maps) => {
				unmount($map, $skeleton);
				const myMap = new maps.Map($map, {
					center: [55.758468, 37.601088],
					zoom: 11,
				});
				for (const atm of atmsArray.payload) {
					const placemark = new maps.Placemark(
						[atm.lat, atm.lon],
						{}
					);
					myMap.geoObjects.add(placemark);
				}
			})
			.catch((error) => createError(error));
	}
}
