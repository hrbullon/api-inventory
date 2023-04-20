const Customer = require("../models/CustomerModel");

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            attributes: ['id','dni','name','phone','email','address']
        });
        res.json({ message: "Ok", customers });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        res.json({ message: "Ok", customer });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getCustomerByDni = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            where: {
                dni: req.params.dni
            }
        });
        res.json({ message: 'ok', customer});
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.json({ message: "Ok", customer });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.update(req.body, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", customer });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.destroy({
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", customer });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getCustomerById,
    getCustomerByDni,
    createCustomer,
    updateCustomer,
    getAllCustomers,
    deleteCustomer
}