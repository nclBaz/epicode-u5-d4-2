import express from "express"
import BlogsModel from "./model.js"
import UsersModel from "../users/model.js"
import createHttpError from "http-errors"

const blogsRouter = express.Router()

blogsRouter.post("/", async (req, res, next) => {
  try {
    const { blogsId } = await BlogsModel.create(req.body)
    res.status(201).send({ id: blogsId })
  } catch (error) {
    next(error)
  }
})

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogsModel.findAll({
      include: { model: UsersModel, attributes: ["firstName", "lastName"] },
    })
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findByPk(req.params.blogId, { include: { model: UsersModel } })
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

export default blogsRouter
