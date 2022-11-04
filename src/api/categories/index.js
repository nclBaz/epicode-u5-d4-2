import express from "express"
import CategoriesModel from "./model.js"

const categoriesRouter = express.Router()

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoriesId } = await CategoriesModel.create(req.body)
    res.status(201).send({ id: categoriesId })
  } catch (error) {
    next(error)
  }
})

categoriesRouter.post("/bulk", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.bulkCreate([
      { name: "node.js" },
      { name: "backend" },
      { name: "react.js" },
      { name: "databases" },
    ])
    res.send(categories.map(c => c.categoryId))
  } catch (error) {
    next(error)
  }
})

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll()
    res.send(categories)
  } catch (error) {
    next(error)
  }
})

export default categoriesRouter
