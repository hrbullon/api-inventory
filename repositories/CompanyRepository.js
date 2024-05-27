
const Company = require("../models/CompanyModel");

class CompanyRepository {

    static async findAll() {
        return await Company.findAll();
    }
   
    static async findById(id) {
        return await Company.findByPk(id);
    }
    
    static async create(data) {
        return await Company.create(data);
    }
    
    static async update(data, id) {
        return await Company.update(data, {
            where: {
              id: id
            }
        });
    }
}

module.exports = CompanyRepository;