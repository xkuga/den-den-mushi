var counter = 0;

/**
 * Avatar constructor.
 *
 * @param {Array} images
 * @param {Object} roleImages
 * @api public
 */
function Avatar(images, roleImages) {
  if (this instanceof Avatar) {
    this.images = images;
    this.roleImages = roleImages;
  } else {
    return new Avatar(images, roleImages);
  }
}

/**
 * get avatar from username
 *
 * @param {string} username
 * @api public
 */
Avatar.prototype.get = function(username) {
  username = username.toLowerCase();

  if (username in this.roleImages) {
    return this.roleImages[username];
  } else {
    return this.images[counter++ % this.images.length];
  }
};

module.exports = Avatar;
