const test = require("ava")
const h = require("./helpers")
const api = require("./api.json")
const waitAll = require("folktale/concurrency/task").waitAll
const assert = require("assert")

test("request() - will make a request to an API endpoint", async t => {
  const r = await h.req("get", api.transfers).run().promise()

  t.is(r.data[0].status, "complete")
})

test("getTransfers() - will recieve a list of transfers excluding corrupt data from API", async t => {
  const r = await h.getTransfers().run().promise()

  const filtered = h.filterCorruptData(r.data)

  t.is(filtered[0].status, "complete")
})

test("getTransferById() - will recieve a transfer by id", async t => {
  const r = await h.getTransferById(3).run().promise()

  t.is(r.data[0].amount, 2500)
})

test("getLikes() - will recieve a list of likes", async t => {
  const r = await h.getLikes().run().promise()

  t.is(r.data[0].user, 2)
})

test("getLikeById() - will recieve a like by id", async t => {
  const r = await h.getLikeById(3).run().promise()

  t.is(r.data[0].user, 4)
})

test("getAccounts() - will recieve a list of accounts", async t => {
  const r = await h.getAccounts().run().promise()

  t.is(r.data[0].balance, 120000)
})

test("getAccountById() - will recieve a account by id", async t => {
  const r = await h.getAccountById(3).run().promise()

  t.is(r.data[0].balance, 15260)
})

test("getUsers() - will recieve a list of users", async t => {
  const r = await h.getUsers().run().promise()

  t.is(r.data[0].lastName, "Howard")
})

test("getUserById() - will recieve a user by id", async t => {
  const r = await h.getUserById(3).run().promise()

  t.is(r.data[0].lastName, "Smith")
})

test("buildSocialTransfers() - will convert to social data", async t => {

  const all = await waitAll([
    h.getUsers(),
    h.getTransfers(),
    h.getAccounts(),
    h.getLikes(),
  ]).run().promise()

  // TODO: need to refactored
  const result = h.buildSocialTransfers({
    users: all[0].data,
    transfers: h.filterCorruptData(all[1].data),
    accounts: all[2].data,
    likes: all[3].data
  })

  t.deepEqual(result[0], {
    amount: 10000,
    description: 'Consider us even >:|',
    likesCount: 2,
    originUserName: 'Aaron Howard',
    targetUserName: 'Larry Smith',
  }, 'not the same objects')
})

test("buildSocialTransfers() - will exclude transactions that failed", async t => {

  const all = await waitAll([
    h.getUsers(),
    h.getTransfers(),
    h.getAccounts(),
    h.getLikes(),
  ]).run().promise()

  // TODO: need to refactored
  const result = h.buildSocialTransfers({
    users: all[0].data,
    transfers: h.filterCorruptData(all[1].data),
    accounts: all[2].data,
    likes: all[3].data
  })

  t.is(result[4], undefined)
})

test('postTransfer() will return a new transfer object', async t => {

  const transferData = {
    originAccount: 3,
    targetAccount: 1,
    amount: 1230,
    description: "Thanks for the laughs!",
    status: "initiated",
    initiatedAt: "2019-05-30T12:53:38-04:00" // For an extra challenge, set this value to the current time
  }

  const accounts = await h.getAccountById().run().promise()

  const result = await h.postTransfer(transferData, accounts.data)

  t.deepEqual(result.data, {
    "id": 4,
    "status": "initiated",
    "originAccount": 3,
    "targetAccount": 1,
    "amount": 1230,
    "description": "Thanks for the laughs!",
    "initiatedAt": "2019-05-30T12:53:38-04:00",
    "completedAt": null,
    "failedAt": null
  })
})