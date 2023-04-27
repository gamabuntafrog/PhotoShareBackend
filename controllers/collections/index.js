const createCollection = require('./createCollection')
const getCurrent = require('./getCurrent')
const getPopulatedCollection = require('./getPopulatedCollection')
const savePostInCollection = require('./savePostInCollection')
const deletePostFromCollection = require('./deletePostFromCollection')
const deleteCollection = require('./deleteCollection')
const addAuthorToCollection = require('./addAuthorToCollection')
const deleteAuthorFromCollection = require('./deleteAuthorFromCollection')
const getCollections = require('./getCollections')
const changeIsPrivate = require('./changeIsPrivate')
const changeAuthorRole = require('./changeAuthorRole')
const addViewerToCollection = require('./addViewerToCollection')
const deleteViewerFromCollection = require('./deleteViewerFromCollection')
const changeCollectionInfo = require('./changeCollectionInfo')
const getCollectionsByTitle = require('./getCollectionsByTitle')
const sendRequestToJoinToCollection = require('./sendRequestToJoinToCollection')
const unsendRequestToJoinFromCollection = require('./unsendRequestToJoinFromCollection')
const deleteCurrentUserFromCollection = require('./deleteCurrentUserFromCollection')
const deleteRequestedUserFromCollection = require('./deleteRequestedUserFromCollection')
const getCollectionsByUserId = require('./getCollectionsByUserId')

module.exports = {
  createCollection,
  getCurrent,
  getPopulatedCollection,
  savePostInCollection,
  deletePostFromCollection,
  deleteCollection,
  addAuthorToCollection,
  deleteAuthorFromCollection,
  getCollections,
  changeIsPrivate,
  changeAuthorRole,
  addViewerToCollection,
  deleteViewerFromCollection,
  changeCollectionInfo,
  getCollectionsByTitle,
  sendRequestToJoinToCollection,
  unsendRequestToJoinFromCollection,
  deleteCurrentUserFromCollection,
  deleteRequestedUserFromCollection,
  getCollectionsByUserId
}
