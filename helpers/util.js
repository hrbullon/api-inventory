
const formatToDecimal = (value) => {
    // Eliminar puntos y reemplazar la coma por un punto
    const formated = String(value).replace(/\./g, '').replace(',', '.');
    return parseFloat(formated);
}

module.exports = { formatToDecimal  }