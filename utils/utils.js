const fs = require('fs');
const { HTTP_400, HTTP_404 } = require('../const/variables');

const filterFileType = (file) => {

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
        fs.unlinkSync(file.path);
        return { error: "Formato de imagen inválido, solo se permiten: (jpeg, png y gif)", fileName: null };
    }else{
        return { error: false, fileName: file.filename};
    } 
}

const successResponse = (res, response ) => {
    res.json({ message: 'ok', ...response });
}

const notFoundResponse = (res, response ) => {
    res.status(HTTP_404).json({ ...response });
}

const handleError = (res, error) => {
    res.status(HTTP_400).json({ message: error.message });
};
  

module.exports = {
    filterFileType,
    successResponse,
    notFoundResponse,
    handleError
};