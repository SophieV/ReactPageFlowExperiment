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
    {index: 0, data: "<h1>Lorem Ipsum</h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat tortor nec ornare ullamcorper. Praesent sed molestie sapien. Nunc vel diam vulputate purus dictum viverra nec sed metus. In vitae imperdiet ante. Nulla ut iaculis mauris. Suspendisse pharetra placerat ornare. Praesent in tortor arcu. Maecenas nisi nibh, ornare vitae faucibus in, sodales sagittis sapien. Morbi rutrum suscipit libero, eu sodales est aliquet vel. Sed maximus massa pretium, pulvinar enim vitae, feugiat lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed mauris ut ipsum scelerisque porttitor. Ut nec velit et massa consequat suscipit. Vivamus eget vulputate sem. Phasellus ac scelerisque lorem.<h2>Lorem Ipsum</h2> In molestie velit nec ullamcorper efficitur. Sed euismod sodales magna in mattis. Duis rhoncus odio quis fermentum efficitur. Quisque tincidunt ex pretium, tincidunt neque at, faucibus libero. Curabitur sapien tortor, tincidunt ac magna eget, sodales porttitor nunc. Donec convallis purus elit, iaculis consequat sapien euismod eu. Cras dignissim volutpat eros, vitae rhoncus massa sodales et. Maecenas mollis libero eget eros elementum, ac gravida ante efficitur. Nulla ut facilisis nibh. Mauris scelerisque ligula vitae sem consequat tempor. In justo ipsum, hendrerit quis felis eget, vestibulum tincidunt felis. Vestibulum a ante vitae tortor cursus dapibus vitae id dolor. Maecenas volutpat commodo lacus nec sollicitudin. Vivamus dapibus felis sed metus pharetra luctus. Proin sagittis magna non dolor interdum, et eleifend dolor aliquam. Mauris ac fringilla dui. Duis eu est cursus, viverra orci quis, auctor ligula. Fusce eget ultrices risus. Suspendisse justo sapien, convallis eu lacinia sed, consectetur ac ante. Vestibulum sed ornare nibh. Phasellus volutpat, nunc eget rhoncus mattis, orci sapien eleifend quam, et venenatis diam mi ut neque. <br/>Aliquam sed ornare sem, et rutrum nibh. Mauris ornare, purus nec dignissim molestie, odio lectus rhoncus velit, vel venenatis sapien metus non nisl. In sit amet lectus eu libero tincidunt ornare a id tortor. Proin rhoncus purus ante, eu suscipit tortor rutrum non. Proin at egestas nisl. Nullam consectetur diam rhoncus, facilisis augue ut, tincidunt dui. Aliquam euismod erat diam, sed maximus tellus maximus eget. Pellentesque a sollicitudin erat. Aliquam erat volutpat. Donec viverra, lorem ac sodales interdum, ipsum ex ultricies sapien, nec aliquet sapien felis sed dui. Nam quis risus neque. Nulla mattis leo sit amet mauris facilisis, ut consectetur velit ullamcorper. Donec a elit ornare, iaculis ex sed, fringilla justo. Integer sagittis dolor volutpat felis convallis, id tempor nibh dictum. Vivamus fermentum arcu eu dolor commodo, ac auctor ex tincidunt. Vivamus in augue eu ligula bibendum molestie. Ut maximus venenatis ipsum, blandit dapibus neque bibendum et. Nullam aliquet dignissim felis id lobortis. In et massa dictum, euismod purus luctus, tempor eros.<br/> Suspendisse iaculis aliquam odio, eget vehicula ex sodales sit amet. Aliquam erat volutpat. Ut rhoncus erat nec libero accumsan, elementum imperdiet urna venenatis. Integer non laoreet massa. Fusce eleifend vestibulum orci at tempor. Integer convallis finibus velit, eu mattis elit pulvinar a. Aliquam condimentum nisi a risus sollicitudin, in iaculis nunc lobortis. Aliquam efficitur, nunc vitae consectetur semper, augue metus aliquet ipsum, luctus laoreet diam massa a leo. Suspendisse accumsan viverra sem, non euismod orci congue et. Nulla nec est et turpis imperdiet posuere."}],
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