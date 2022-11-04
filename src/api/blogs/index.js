import express from "express"
import createHttpError from "http-errors"
import BlogsModel from "./model.js"
import UsersModel from "../users/model.js"
import BlogsCategoriesModel from "./blogsCategoriesModel.js"
import CategoriesModel from "../categories/model.js"

const blogsRouter = express.Router()

blogsRouter.post("/", async (req, res, next) => {
  try {
    const { blogsId } = await BlogsModel.create(req.body)
    console.log(blogsId)
    if (req.body.categories) {
      await BlogsCategoriesModel.bulkCreate(
        req.body.categories.map(category => {
          return { categoryId: category, blogId: blogsId }
        })
      )
    }
    res.status(201).send({ id: blogsId })
  } catch (error) {
    next(error)
  }
})

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogsModel.findAll({
      include: [
        { model: UsersModel, attributes: ["firstName", "lastName"] },
        { model: CategoriesModel, attributes: ["name"], through: { attributes: [] } },
      ],
    })
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findByPk(req.params.blogId, {
      include: [
        { model: UsersModel, attributes: ["firstName", "lastName"] },
        { model: CategoriesModel, attributes: ["name"], through: { attributes: [] } },
        // to exclude the junction table record from the result we have to use through: {attributes: []}
      ],
    })
    if (blog) {
      res.send(blog)
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await BlogsModel.update(req.body, {
      where: { id: req.params.blogId },
      returning: true,
    })

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const numberOfDeletedRecords = await BlogsModel.destroy({ where: { id: req.params.blogId } })
    if (numberOfDeletedRecords === 1) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post("/:blogId/category", async (req, res, next) => {
  try {
    const { id } = await BlogsCategoriesModel.create({
      blogId: req.params.blogId,
      categoryId: req.body.categoryId,
    })
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})

export default blogsRouter
