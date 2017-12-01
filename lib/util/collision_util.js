export const hasHorizontalCollision = (firstChar, secondChar) => {
  // get half width
  const firstCharHalfWidth = (firstChar.size.width / 2);
  // get center
  const firstCharCenter = firstChar.pos.left + firstCharHalfWidth;

  // get half width
  const secondCharHalfWidth = (secondChar.size.width / 2);
  // get center
  const secondCharCenter = secondChar.pos.left + secondCharHalfWidth;

  // if difference between centers l.t. sum of halves -> collide!
  const distBetwCenters = Math.abs(firstCharCenter - secondCharCenter);
  const sumWidthHalves = firstCharHalfWidth + secondCharHalfWidth;
  // horizontal collision
  const hasCollided = (distBetwCenters < sumWidthHalves);
  return hasCollided;
};

export const hasVerticalCollision = (firstChar, secondChar) => {
  const firstCharHalfWidth = (firstChar.size.height / 2);
  const firstCharCenter = firstChar.pos.bottom + firstCharHalfWidth;

  const secondCharHalfWidth = (secondChar.size.height / 2);
  const secondCharCenter = secondChar.pos.bottom + firstCharHalfWidth;

  const distBetwCenters = Math.abs(firstCharCenter - secondCharCenter);
  const sumWidthHalves = firstCharHalfWidth + secondCharHalfWidth;

  const hasCollided = (distBetwCenters < sumWidthHalves);
  return hasCollided;
};
