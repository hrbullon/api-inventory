const filterFileType = (file) => {

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
        fs.unlinkSync(file.path);
        return { error: "Formato de imagen inválido, solo se permiten: (jpeg, png y gif)", fileName: null };
    }else{
        return { error: false, fileName: file.filename};
    } 
}

module.exports = filterFileType;