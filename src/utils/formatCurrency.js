export default (text = '') => {
    if (text.length > 1 && text.charAt(0) === '0') {
        return text.replace(text.charAt(0), '').toString().replace(/,|\./gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return text.toString().replace(/,|\./gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}