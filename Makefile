dev:
	yarn dev -p 3005

remix-pull:
	docker pull remixproject/remix-ide:latest

remix-start:
	docker run -p 3004:80 remixproject/remix-ide:latest

remix-open:
	./node_modules/.bin/open-cli http://localhost:3004

get-abis:
	cp ../wizards-contracts/artifacts/contracts/ForgottenRunesWizardsCult.sol/ForgottenRunesWizardsCult.json contracts/ForgottenRunesWizardsCult.json
	cp ../wizards-contracts/artifacts/contracts/BookOfLore.sol/BookOfLore.json contracts/BookOfLore.json

start-ipfs:
	ipfs daemon