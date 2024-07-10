const mongoose = require('mongoose');

module.exports.initDbConnection = async () => {
  mongoose
    .connect('mongodb+srv://quanphammm8:UDB8sAS31J3M70mW@cluster0.fafhvmy.mongodb.net/watch-store')
    
    .then(() => {
      console.log(` Database connect successfully.`);
    })
    .catch((err) => {
      console.log(`Error connecting: ${err.message}`);
    });
};