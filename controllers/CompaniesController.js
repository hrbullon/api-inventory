const CompanyRepository = require("../repositories/CompanyRepository");

const { successResponse, handleError } = require("../utils/utils");

const getAllCompanies = async (req, res) => {
    try {
        const companies = await CompanyRepository.findAll();
        successResponse( res, { companies });
    } catch (error) {
        handleError(res, error);
    }
}

const getCompanyById = async (req, res) => {
    try {
        const company = await CompanyRepository.findById(req.params.id);
        successResponse( res, { company });
    } catch (error) {
        handleError(res, error);
    }
}

const createCompany = async (req, res) => {
    try {
        const company = await CompanyRepository.create(req.body);
        successResponse( res, { company });
    } catch (error) {
        handleError(res, error);
    }
}

const updateCompany = async (req, res) => {
    try {
        const company = await CompanyRepository.update(req.body, req.params.id);
        successResponse( res, { company });
    } catch (error) {
        handleError(res, error);
    }
}

module.exports = {
    getCompanyById,
    createCompany,
    updateCompany,
    getAllCompanies
}