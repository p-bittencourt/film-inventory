const axios = require('axios');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const checkAndResizeImageFromURL = asyncHandler(async (req, res, next) => {
  const { picture } = req.body;

  if (!picture) {
    return next();
  }

  const response = await axios.get(picture, { responseType: 'arraybuffer ' });
  const imageBuffer = response.data;

  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  if (metadata.width !== 150 || metadata.height !== 225) {
    const resizedImageBuffer = await image
      .resize(150, 225, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();

    req.bosy.picture = `data:image/${
      metada.format
    };base64,${resizedImageBuffer.toString('base64')}`;

    next();
  }
});

module.exports = { checkAndResizeImageFromURL };
