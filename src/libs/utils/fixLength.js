export default (num, length) => ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;