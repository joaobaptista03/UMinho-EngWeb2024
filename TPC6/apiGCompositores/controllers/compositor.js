var Compositor = require('../models/compositor');

module.exports.list = () => {
    return Compositor
        .find()
        .sort({nome: 1})
        .exec();
}

module.exports.findById = id => {
    return Compositor
        .findOne({_id: id})
        .exec();
}

module.exports.insert = compositor => {
    return Compositor.create(compositor);
}

module.exports.update = compositor => {
    return Compositor.updateOne({_id: compositor._id}, compositor);
}

module.exports.remove = id => {
    return Compositor.deleteOne({_id: id});
}