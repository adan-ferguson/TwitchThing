const db = require('../db.js')

/**
 * How often a user can get a bonus for chatting in any registered channel.
 * @type {number} Delay in milliseconds
 */
const CHAT_BONUS_TIMEOUT = 1000 * 60 * 5

/**
 * Amount of money given for a chat bonus.
 * @type {number}
 */
const CHAT_BONUS_AMOUNT = 10

/**
 * How often a user can get a large bonus for chatting in a registered channel
 * (about once per stream).
 * @type {number} Delay in milliseconds
 */
const CHANNEL_CHAT_BONUS_TIMEOUT = 1000 * 60 * 60 * 12

/**
 * Amount of money given for a large bonus.
 * @type {number}
 */
const CHANNEL_CHAT_BONUS_AMOUNT = 100

const DEFAULTS = {
  username: '???',
  channelname: '???',
  type: '???',
  amount: 0,
  date: new Date(0)
}

const BonusTypes = {
  CHAT: 'chat',
  CHANNEL_CHAT: 'channel_chat'
}

class Bonus {

  static async createNew(username, channelname, type, amount){
    const bonus = new Bonus({
      username, channelname, type, amount, date: new Date()
    })
    await db.conn().collection('bonuses').insertOne(bonus.doc)
    return bonus
  }

  constructor(doc){
    this.doc = fixBackwardsCompatibility(doc)
  }
}


function fixBackwardsCompatibility(user){
  return Object.assign({}, DEFAULTS, user)
}

/**
 * Check if this user/channel combo is elligible for a large chat bonus. If yes,
 * then create the bonus and return it. Otherwise return false.
 * @param user {User}
 * @param channel {Channel}
 * @returns {Promise<Bonus|false>}
 */
async function giveChannelChatBonus(user, channel) {

  const targetDate = new Date(Date.now - CHANNEL_CHAT_BONUS_TIMEOUT)
  const lastBonus = await lastChannelChatBonus(user, channel)
  if (lastBonus && lastBonus.doc.date > targetDate) {
    return false
  }

  return Bonus.createNew(user.username, channel.name, BonusTypes.CHANNEL_CHAT, CHANNEL_CHAT_BONUS_AMOUNT)
}

/**
 * Get the most recent large bonus given for this user/channel combo,
 * or false if this bonus has never been given.
 * @param user {User}
 * @param channel {Channel}
 * @returns {Promise<Bonus|boolean>}
 */
async function lastChannelChatBonus(user, channel) {

  const bonusRecord = await db.conn().collection('bonuses')
    .find({
      username: user.username,
      channel: channel.name,
      type: BonusTypes.CHANNEL_CHAT
    })
    .limit(1)
    .sort({ date: -1 })
    .toArray()

  return bonusRecord.length ? new Bonus(bonusRecord[0]) : false
}

/**
 * Check if this user is elligible for a small chat bonus. If yes,
 * then create the bonus and return it. Otherwise return false.
 * @param user {User}
 * @param channel {Channel}
 * @returns {Promise<Bonus|false>}
 */
async function giveChatBonus(user, channel){

  const targetDate = new Date(Date.now - CHAT_BONUS_TIMEOUT)
  const lastBonus = await lastChatBonus(user)
  if (lastBonus && lastBonus.doc.date > targetDate) {
    return false
  }

  return Bonus.createNew(user.username, channel.name, BonusTypes.CHAT, CHAT_BONUS_AMOUNT)
}

/**
 * Get the most recent small bonus given for this user,
 * or false if this bonus has never been given.
 * @param user {User}
 * @returns {Promise<Bonus|false>}
 */
async function lastChatBonus(user){

  const bonusRecord = await db.conn().collection('bonuses')
    .find({
      username: user.username,
      type: BonusTypes.CHAT
    })
    .limit(1)
    .sort({ date: -1 })
    .toArray()

  return bonusRecord.length ? new Bonus(bonusRecord[0]) : false
}

module.exports = {
  giveChannelChatBonus,
  lastChannelChatBonus,
  giveChatBonus,
  lastChatBonus
}