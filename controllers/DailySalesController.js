const DailySalesRepository = require("../repositories/DailySalesRepository");

const getAllDailySales = async (req, res) => {
    try {
        const dailySales = await DailySalesRepository.getAllDailySales(req);
        return res.json({ message: "Ok", dailySales });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = { 
    getAllDailySales
}