import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import UsersModel from "./model.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await UsersModel.create(req.body)

    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const query = {}
    if (req.query.firstName) query.firstName = { [Op.iLike]: `${req.query.firstName}%` }
    if (req.query.ageRange) query.age = { [Op.between]: req.query.ageRange.split(",") }

    const users = await UsersModel.findAll({
      where: {
        ...query,
      },
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
    })
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] }, // pass an array for the include list, use an object for the exclude list
    })
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update(req.body, {
      where: { id: req.params.userId },
      returning: true, // DO NOT FORGET ABOUT THIS!
    })

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await UsersModel.destroy({ where: { id: req.params.userId } })
    if (numberOfDeletedRows) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
