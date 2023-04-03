const Company = require("../models/CompanyModel");

const getAllCompanies = async (req, res) => {
    try {
        const categories = await Company.findAll();
        res.json({ message: "Ok", categories });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        res.json({ message: "Ok", company });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createCompany = async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.json({ message: "Ok", company });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateCompany = async (req, res) => {
    try {
        const company = await Company.update(req.body, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", company });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteCompany = async (req, res) => {
    try {
        const company = await Company.destroy({
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", company });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getCompanyById,
    createCompany,
    updateCompany,
    getAllCompanies,
    deleteCompany
}