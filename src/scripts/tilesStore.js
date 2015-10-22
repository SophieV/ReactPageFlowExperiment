let React = require('react'),
    _ = require('underscore'),
    objectAssign = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./AppDispatcher'),
    actionsConstants = require('./actionsConstants'),
    eventsConstants = require('./eventsConstants');

let _store = {
  defaultContentToReturn: [
    {index: "/home", data: "This is home. Here is an overview of everything."}, 
    {index: "/work", data: "This is work. We can do this, and that. And this, and that."}, 
    {index: 0, data: "Generic Content. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum."}],
  contentToTileMapping: [],
  contentFromIndex: [],
  maxTileIndex: -1,
  minTileIndex: 0,
  defaultContentIndex: 0
};

let addTileDown = function(contentIndex) {
  let associatedContentIndex;
  _store.maxTileIndex++;

  if (contentIndex == null){
    let contentIndexNotRenderedYet = false;

    while(!contentIndexNotRenderedYet) {
      _store.defaultContentIndex++;
      if (_.findWhere(_store.contentToTileMapping, {contentIndex: _store.defaultContentIndex}) == null) {
        contentIndexNotRenderedYet = true;
      }
    }

    associatedContentIndex = _store.defaultContentIndex;   
  } else {
    associatedContentIndex = contentIndex;
  }

  console.log('retrieving data for #C' + associatedContentIndex);
  _store.contentToTileMapping.push({tileIndex: _store.maxTileIndex, contentIndex: associatedContentIndex});

  retrieveFakeContent(associatedContentIndex);
};

let retrieveFakeContent = function(contentIndex) {
  let fakeData;
  switch (contentIndex) {
    case "/home":
      fakeData = _.findWhere(_store.defaultContentToReturn, {index: "/home"}).data;
    break;
    case "/work":
      fakeData = _.findWhere(_store.defaultContentToReturn, {index: "/work"}).data;
    break;
    default:
      fakeData = _.findWhere(_store.defaultContentToReturn, {index: 0}).data;
    break;
  }

  if (fakeData != null) {
    _store.contentFromIndex.push({index: contentIndex, data: fakeData});
  }
}

let addTileUp = function(contentIndex) {
  let associatedContentIndex;
  _store.minTileIndex--;

  if (contentIndex == null){
    let contentIndexNotRenderedYet = false;

    while(!contentIndexNotRenderedYet) {
      _store.defaultContentIndex--;
      if (_.findWhere(_store.contentToTileMapping, {contentIndex: _store.defaultContentIndex}) == null) {
        contentIndexNotRenderedYet = true;
      }
    }

    associatedContentIndex = _store.defaultContentIndex;   
  } else {
    associatedContentIndex = contentIndex;
  }

  console.log('retrieving data for #C' + associatedContentIndex);
  _store.contentToTileMapping.push({tileIndex: _store.minTileIndex, contentIndex: associatedContentIndex});

  retrieveFakeContent(associatedContentIndex);
};

let addFirstTileDown = function(contentIndex) {
    // reset store
    _store.contentToTileMapping = [];
    _store.maxTileIndex = -1;
    _store.minTileIndex = 0;
    _store.defaultContentIndex = 0;

    addTileDown(contentIndex);
};

let tilesStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(eventsConstants.CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(eventsConstants.CHANGE_EVENT, cb);
  },
  getTilesDownCount: function(){
    return _store.maxTileIndex;
  },
  getTilesUpCount: function(){
    return _store.minTileIndex;
  },
  getContentToTilesMapping: function(){
    return _store.contentToTileMapping;
  },
  getContentFromIndex: function(contentIndex){
    let contentOfEntry;
    let entry = _.findWhere(_store.contentFromIndex, {index: contentIndex});

    if (entry != null) {
      contentOfEntry = entry.data;
    }
    return contentOfEntry;
  }
});

AppDispatcher.register(function(payload)
{
  let action = payload.action;
  switch(action.actionType)
  {
    case actionsConstants.ADD_TILE_DOWN:
      addTileDown(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    case actionsConstants.ADD_TILE_UP:
      addTileUp(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    case actionsConstants.ADD_FIRST_TILE:
      addFirstTileDown(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    default:
      return true;
  }
});

module.exports = tilesStore;