const Maybe = require("folktale/maybe")
const compose = require("folktale/core/lambda/compose")
const { task } = require("folktale/concurrency/task")

const Just = Maybe.Just
const Nothing = Maybe.Nothing

const axios = require("axios")
const R = require("ramda")
const api = require('./api.json')
const _t = require('./messages.json')

const log = err => {
  err.message == 'getaddrinfo ENOTFOUND dylan-takehome.glitch.me'
    ? console.log('Check your interenet connection.', "getaddrinfo ENOTFOUND dylan-takehome.glitch.me")
    : console.log(err)

  return err
}

const filterCorruptData = data =>
  data.filter(d => Object.keys(d).length > 1)

const req = (method, endpoint, data = {}) =>
  task(resolver =>
    axios[method](`${api.host}${endpoint}`, {params: data})
      .then(r => resolver.resolve(r))
      .catch(err => resolver.reject(err)))

const getTransfers = () =>
  req("get", api.transfers)

const getTransferById = id =>
  Just(id)
    .map(i => req("get", api.transfers, { id: id }))
    .getOrElse(null)

const getUsers = () =>
  req("get", api.users)

const getUserById = id =>
  Just(id)
    .map(i => req("get", api.users, { id: id }))
    .getOrElse(null)

const getAccounts = () =>
  req("get", api.accounts)

const getAccountById = id =>
  Just(id)
    .map(i => req("get", api.accounts, { id: id }))
    .getOrElse(null)

const getLikes = () =>
  req("get", api.likes)

const getLikeById = id =>
  Just(id)
    .map(i => req("get", api.likes, { id: id }))
    .getOrElse(null)

const findById = (arr, id) =>
  R.find(R.propEq('id', id))(arr)

const countLikes = (transferId, likes) =>
  likes.filter(l => transferId == l.transfer).length

const buildSocialTransfers = data =>
  data.transfers
    .filter(t => t.status !== 'failed')
    .map(t => {
      // TODO: Needs refactoring
      const likes = countLikes(t.id, data.likes)
      const originAccount = findById(data.accounts, t.originAccount)
      const originUser = findById(data.users, originAccount.user)
      const targetAccount = findById(data.accounts, t.targetAccount)
      const targetUser = findById(data.users, targetAccount.user)

      return {
        originUserName: `${originUser.firstName} ${originUser.lastName}`,
        targetUserName: `${targetUser.firstName} ${targetUser.lastName}`,
        amount: t.amount,
        description: t.description,
        likesCount: likes,
      }
  })

const postTransfer = (data, accounts) =>
  Just(data)
    .map(d => {
      const originAccount = findById(accounts, d.originAccount)

      return originAccount.balance >= data.amount
        ? req('post', api.transfers, {
            ...data,
            completedAt: null,
            failedAt: null,
          })
          .run()
          .promise()
          .then(transfer =>
            updateAccount({
              id: d.originAccount,
              amount: originAccount.balance + data.amount
            })
            .run()
            .promise())
        : log(_t.insufficient_funds)
    })
    .getOrElse(null)

const updateAccount = account =>
  Just(account)
    .map(a => req('put', api.accounts, a)).run().promise()
    .getOrElse()


module.exports = {
  req: req,
  getTransfers: getTransfers,
  getTransferById: getTransferById,
  getUsers: getUsers,
  getUserById: getUserById,
  getAccounts: getAccounts,
  getAccountById: getAccountById,
  getLikes: getLikes,
  getLikeById: getLikeById,
  buildSocialTransfers: buildSocialTransfers,
  filterCorruptData: filterCorruptData,
  postTransfer: postTransfer,
  updateAccount: updateAccount,
}