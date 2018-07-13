Number.isInteger = Number.isInteger || function(value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

require('es6-promise').polyfill();
