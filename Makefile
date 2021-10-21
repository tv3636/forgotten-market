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
	cp ../wizards-contracts/artifacts/contracts/ForgottenSouls.sol/ForgottenSouls.json contracts/ForgottenSouls.json
	cp ../wizards-contracts/artifacts/contracts/ForgottenRunesInfinityVeil.sol/ForgottenRunesInfinityVeil.json contracts/ForgottenRunesInfinityVeil.json

start-ipfs:
	ipfs daemon

start-graph:
	cargo run -p graph-node --release -- \
	--postgres-url postgresql://frwc:@localhost:5432/graphprotocol \
	--ethereum-rpc rinkeby:https://rinkeby.infura.io \
	--ipfs 127.0.0.1:5001 \
	--debug

cdn-images:
	s3cmd sync -P --acl-public -v ./public/static/cdn/ s3://nftz.forgottenrunes.com/website/cdn/