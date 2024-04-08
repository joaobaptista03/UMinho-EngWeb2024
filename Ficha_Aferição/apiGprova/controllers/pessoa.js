var Pessoa = require('../models/pessoa');

module.exports.list = () => {
    return Pessoa
        .find()
        .sort({nome: 1})
        .exec();
}

module.exports.findById = id => {
    return Pessoa
        .findOne({_id: id})
        .exec();
}

module.exports.insert = Pessoa => {
    return Pessoa.create(Pessoa);
}

module.exports.update = Pessoa => {
    return Pessoa.updateOne({_id: Pessoa._id}, Pessoa);
}

module.exports.remove = id => {
    return Pessoa.deleteOne({_id: id});
}