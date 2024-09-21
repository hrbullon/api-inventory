const DailySalesRepository = require("../repositories/DailySalesRepository");

const getAllDailySales = async (req, res) => {
    try {
        const dailySales = await DailySalesRepository.getAllDailySales(req.query);
        return res.json({ message: "Ok", data: dailySales });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = { 
    getAllDailySales
}