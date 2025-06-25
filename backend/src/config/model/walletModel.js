require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL) 

const walletDB = sequelize.define(
  'WalletDB',
  {
    privateKey: { type: DataTypes.STRING, allowNull: false },
    //"PublicKey" : walletMnemonic.publicKey,
    accountAddress:{ type: DataTypes.STRING, allowNull: false },
    mnemonics: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true
  }
);

//sequelize.sync({});
sequelize.sync({ alter: true });

module.exports = sequelize.models.WalletDB;
