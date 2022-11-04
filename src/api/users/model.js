import { DataTypes } from "sequelize"
import sequelize from "../../db.js"

const UserModel = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // without default pg is expecting us to pass an uuid every time we do an insert
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
  }
  /*   { timestamps: false } */
) // timestamps are true by default, if you want to disable --> {timestamps: false}

export default UserModel
