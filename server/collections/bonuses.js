const db = require('../db.js')

/**
 * How often a user can get a bonus for chatting in any registered channel.
 * @type {number}
 */
const CHAT_BONUS_TIMEOUT = 60 * 5

/**
 * Amount of money given for a chat bonus.
 * @type {number}
 */
const CHAT_BONUS_AMOUNT = 10

/**
 * How often a user can get a large bonus for chatting in a registered channel
 * (about once per stream).
 * @type {number}
 */
const CHANNEL_CHAT_BONUS_TIMEOUT = 60 * 60 * 12

/**
 * Amount of money given for a large bonus.
 * @type {number}
 */
const CHANNEL_CHAT_BONUS_AMOUNT = 100

/**
 * @param user {User}
 * @param channel {Channel}
 * @returns {Promise<number>}
 */
async function checkForChannelChatBonus(user, channel){
  const bonusRecord = await db.conn().collection('bonuses')
    .find({
      username: user.username,
      channel: channel.name
    })
    .limit(1)
    .sort({ date: -1 })
    .toArray()
}

/**
 * @param user {User}
 * @returns {Promise<void>}
 */
async function checkForChatBonus(user){
  const bonusRecord = await db.conn().collection('bonuses')
    .find({
      username: user.username
    })
    .limit(1)
    .sort({ date: -1 })
    .toArray()
}

module.exports = { checkForChannelChatBonus, checkForChatBonus }