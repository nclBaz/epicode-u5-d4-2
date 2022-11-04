import { DataTypes } from "sequelize"
import sequelize from "../../db.js"
import UsersModel from "../users/model.js"
import CategoriesModel from "../categories/model.js"
import BlogsCategoriesModel from "./blogsCategoriesModel.js"

const BlogsModel = sequelize.define("blog", {
  blogsId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

// 1 to many relationship
UsersModel.hasMany(BlogsModel)
BlogsModel.belongsTo(UsersModel)

// many to many relationship
BlogsModel.belongsToMany(CategoriesModel, {
  through: BlogsCategoriesModel,
  foreignKey: {
    name: "blogId",
    allowNull: false,
  },
})
CategoriesModel.belongsToMany(BlogsModel, {
  through: BlogsCategoriesModel,
  foreignKey: {
    name: "categoryId",
    allowNull: false,
  },
})

export default BlogsModel
