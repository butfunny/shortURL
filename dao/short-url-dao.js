var mongoose = require('mongoose');

module.exports = mongoose.model('Url', {
    realURL: String,
    shortURL: String,
    created: {type: Date, default: Date.now}
}, "url");