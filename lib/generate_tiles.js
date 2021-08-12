'use strict';

const sharp = require('sharp');

console.log ("here goes");

sharp('all_wizards_transparent.png', {limitInputPixels: false })
    .png()
    .tile({
        size: 256
    })
    .toFile('wizards.dz', function(err, info) {
        console.log(err)
    });