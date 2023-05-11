const TransactionRepository = require("../repositories/TransactionRepository");

const getAllTransactionByCheckout = async (req, res) => {
    try {
        const transactions = await TransactionRepository.findTransactionByCheckout(req.params.checkoutId);
        res.json({ message: "Ok", transactions });
    } catch (error) {
        res.json({ message: error.message });
    }
} 

const createTransaction = async (req, res) => {
    try {
        const transaction = await TransactionRepository.create(req.body);
        res.json({ message: "Ok", transaction });
    } catch (error) {
        res.json({ message: error.message });
    }
} 

module.exports = { 
    createTransaction,
    getAllTransactionByCheckout
}