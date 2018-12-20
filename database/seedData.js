const Promise = require('bluebird');
const faker = require('faker');
const {mysql} = require('./index');
const db = Promise.promisifyAll(require('./index').db);

let NUM_PRODUCTS = 10;
let NUM_AUTHORS = 10;
let NUM_REVIEWS = 10;
let NUM_RATINGS = 10;
let NUM_RATINGS_FEATURE = 10;
let NUM_MEDIA = 5;

let generateProducts = function(num = NUM_PRODUCTS) {
	return Array.from({length:num},
		p => [faker.commerce.productName()]);
}

let generateAuthors = function(num = NUM_AUTHORS) {
	return Array.from({length:num}, a => {
			return [
				faker.internet.userName(),
				faker.internet.avatar()
			];
		});
}

let generateReviews = function(num = NUM_REVIEWS) {
	return Array.from({length:num}, r => {
		return [
			faker.company.catchPhrase(), //headline
			faker.hacker.phrase(), //body
			faker.date.past().toISOString().split('T')[0], //date
			getRandomInt(0, 1500), //helpful
			faker.random.boolean(), //verified
			getRandomInt(1, NUM_AUTHORS), //author
			getRandomInt(1, NUM_PRODUCTS) //product
		]
	});
}

let generateRatings = function(num = NUM_RATINGS) {
	return Array.from({length:num}, r => {
		return [
			getRandomInt(0, 6), //stars
			getRandomInt(1, NUM_REVIEWS) //review
		]
	})
}

let generateFeatureRatings = function(num = NUM_RATINGS_FEATURE) {
	return Array.from({length:num}, r => {
		return [
			faker.commerce.productAdjective(), //feature
			getRandomDouble(), //overall rating
			getRandomInt(0, 1000), //count: how many total votes cast
			getRandomInt(1, NUM_PRODUCTS) //product
		]
	})
}

let generateMedia = function(num = NUM_MEDIA) {
	return Array.from({length:num}, m => {
		return [
			'photo',//type
			faker.image.image(), //file
			getRandomInt(1, NUM_REVIEWS) //review
		]
	})
}

let getRandomInt = function(start, stop) {
	return Math.floor((Math.random() * (stop - start)) + start);
}

let getRandomDouble = function(start = 0, stop = 5) {
	return ((Math.random() * (stop - start)) + start).toFixed(1);
}

let products = generateProducts();
let authors = generateAuthors();
let ratings = generateRatings();
let reviews = generateReviews();
let features = generateFeatureRatings();
let media = generateMedia();

let mysqlReady = (arr) => {
	return arr.map(i => {
		return `(${['default'].concat(i.map(e => JSON.stringify(e))).join(',')})`;
	}).join(',');
};

let qProducts = `INSERT INTO products VALUES ${mysqlReady(products)}`;
let qAuthors = `INSERT INTO authors VALUES ${mysqlReady(authors)}`;
let qReviews = `INSERT INTO reviews VALUES ${mysqlReady(reviews)}`;
let qRatings = `INSERT INTO ratings VALUES ${mysqlReady(ratings)}`;
let qFeatures = `INSERT INTO ratings_feature VALUES ${mysqlReady(features)}`;
let qMedia = `INSERT INTO media VALUES ${mysqlReady(media)}`;

let queries = [qProducts, qAuthors, qReviews, qRatings];

db.queryAsync(qProducts)
	.then(ok => {
		console.log('done with products!');
		return db.queryAsync(qAuthors);
	})
	.then(ok => {
		console.log('done with authors!');
		return db.queryAsync(qReviews);
	})
	.then(ok => {
		console.log('done with reviews!');
		return Promise.all([
		db.queryAsync(qRatings),
		db.queryAsync(qFeatures),
		db.queryAsync(qMedia)
		]
		);
	})
	.then(ok => {
		console.log('done with ratings, feature ratings, media!')
		db.end();
	})
	.catch(err => {
		console.log('caught', err);
		db.end();
	});

