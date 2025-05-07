install:
	npm ci

lint:
	npx eslint .

test:
	npx jest --coverage
	
test-watch:
	npx jest --watch

lint-fix:
	npx eslint --fix .