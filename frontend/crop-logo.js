const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'the_artist_factory_logo-04 (1).png');
const outputPath = path.join(__dirname, 'public', 'the_artist_factory_logo-04 (1)-cropped.png');

async function cropImage() {
  try {
    console.log('Processing:', inputPath);
    await sharp(inputPath)
      .trim() // This trims transparent bordersss
      .toFile(outputPath);
    
    // Replace original file
    fs.renameSync(outputPath, inputPath);
    console.log('Successfully cropped image');
  } catch (error) {
    console.error('Error cropping image:', error);
  }
}

cropImage();
