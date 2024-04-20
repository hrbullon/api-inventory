const { Op } = require('sequelize');
const Category = require("../models/CategoryModel");

class CategoryRepository { 

    static async findAll({ search }) {
        const condition = search? { name: { [Op.like]: `%${search}%` } } : null;
        return await Category.findAll({ where: condition, order: [ [ 'id', 'DESC' ]] });
    }

    static async findByPk({ id }) {
        return await Category.findByPk(id);
    }

    static async create({ model }) {
        return await Category.create(model);
    }

    static async update({ model, id }) {
        return await Category.update(model, {
            where: {
              id: id
            }
        });
    }
}


module.exports = CategoryRepository;