let React = require('react'),
    _ = require('underscore'),
    objectAssign = require('react/lib/Object.assign'),
    EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('./AppDispatcher'),
    actionsConstants = require('./actionsConstants'),
    eventsConstants = require('./eventsConstants');

let _store = {
  defaultContent: [
    {route: "/home", data: "This is home. Here is an overview of everything."}, 
    {route: "/work", data: "This is work. We can do this, and that. And this, and that."}, 
    {route: 0, data: "<h1>Lorem Ipsum</h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat tortor nec ornare ullamcorper. Praesent sed molestie sapien. Nunc vel diam vulputate purus dictum viverra nec sed metus. In vitae imperdiet ante. Nulla ut iaculis mauris. Suspendisse pharetra placerat ornare. Praesent in tortor arcu. Maecenas nisi nibh, ornare vitae faucibus in, sodales sagittis sapien. Morbi rutrum suscipit libero, eu sodales est aliquet vel. Sed maximus massa pretium, pulvinar enim vitae, feugiat lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed mauris ut ipsum scelerisque porttitor. Ut nec velit et massa consequat suscipit. Vivamus eget vulputate sem. Phasellus ac scelerisque lorem.<h2>Lorem Ipsum</h2> In molestie velit nec ullamcorper efficitur. Sed euismod sodales magna in mattis. Duis rhoncus odio quis fermentum efficitur. Quisque tincidunt ex pretium, tincidunt neque at, faucibus libero. Curabitur sapien tortor, tincidunt ac magna eget, sodales porttitor nunc. Donec convallis purus elit, iaculis consequat sapien euismod eu. Cras dignissim volutpat eros, vitae rhoncus massa sodales et. Maecenas mollis libero eget eros elementum, ac gravida ante efficitur. Nulla ut facilisis nibh. Mauris scelerisque ligula vitae sem consequat tempor. In justo ipsum, hendrerit quis felis eget, vestibulum tincidunt felis. Vestibulum a ante vitae tortor cursus dapibus vitae id dolor. Maecenas volutpat commodo lacus nec sollicitudin. Vivamus dapibus felis sed metus pharetra luctus. Proin sagittis magna non dolor interdum, et eleifend dolor aliquam. Mauris ac fringilla dui. Duis eu est cursus, viverra orci quis, auctor ligula. Fusce eget ultrices risus. Suspendisse justo sapien, convallis eu lacinia sed, consectetur ac ante. Vestibulum sed ornare nibh. Phasellus volutpat, nunc eget rhoncus mattis, orci sapien eleifend quam, et venenatis diam mi ut neque. <br/>Aliquam sed ornare sem, et rutrum nibh. Mauris ornare, purus nec dignissim molestie, odio lectus rhoncus velit, vel venenatis sapien metus non nisl. In sit amet lectus eu libero tincidunt ornare a id tortor. Proin rhoncus purus ante, eu suscipit tortor rutrum non. Proin at egestas nisl. Nullam consectetur diam rhoncus, facilisis augue ut, tincidunt dui. Aliquam euismod erat diam, sed maximus tellus maximus eget. Pellentesque a sollicitudin erat. Aliquam erat volutpat. Donec viverra, lorem ac sodales interdum, ipsum ex ultricies sapien, nec aliquet sapien felis sed dui. Nam quis risus neque. Nulla mattis leo sit amet mauris facilisis, ut consectetur velit ullamcorper. Donec a elit ornare, iaculis ex sed, fringilla justo. Integer sagittis dolor volutpat felis convallis, id tempor nibh dictum. Vivamus fermentum arcu eu dolor commodo, ac auctor ex tincidunt. Vivamus in augue eu ligula bibendum molestie. Ut maximus venenatis ipsum, blandit dapibus neque bibendum et. Nullam aliquet dignissim felis id lobortis. In et massa dictum, euismod purus luctus, tempor eros.<br/> Suspendisse iaculis aliquam odio, eget vehicula ex sodales sit amet. Aliquam erat volutpat. Ut rhoncus erat nec libero accumsan, elementum imperdiet urna venenatis. Integer non laoreet massa. Fusce eleifend vestibulum orci at tempor. Integer convallis finibus velit, eu mattis elit pulvinar a. Aliquam condimentum nisi a risus sollicitudin, in iaculis nunc lobortis. Aliquam efficitur, nunc vitae consectetur semper, augue metus aliquet ipsum, luctus laoreet diam massa a leo. Suspendisse accumsan viverra sem, non euismod orci congue et. Nulla nec est et turpis imperdiet posuere.<h1>Lorem Ipsum</h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat tortor nec ornare ullamcorper. Praesent sed molestie sapien. Nunc vel diam vulputate purus dictum viverra nec sed metus. In vitae imperdiet ante. Nulla ut iaculis mauris. Suspendisse pharetra placerat ornare. Praesent in tortor arcu. Maecenas nisi nibh, ornare vitae faucibus in, sodales sagittis sapien. Morbi rutrum suscipit libero, eu sodales est aliquet vel. Sed maximus massa pretium, pulvinar enim vitae, feugiat lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed mauris ut ipsum scelerisque porttitor. Ut nec velit et massa consequat suscipit. Vivamus eget vulputate sem. Phasellus ac scelerisque lorem.<h2>Lorem Ipsum</h2> In molestie velit nec ullamcorper efficitur. Sed euismod sodales magna in mattis. Duis rhoncus odio quis fermentum efficitur. Quisque tincidunt ex pretium, tincidunt neque at, faucibus libero. Curabitur sapien tortor, tincidunt ac magna eget, sodales porttitor nunc. Donec convallis purus elit, iaculis consequat sapien euismod eu. Cras dignissim volutpat eros, vitae rhoncus massa sodales et. Maecenas mollis libero eget eros elementum, ac gravida ante efficitur. Nulla ut facilisis nibh. Mauris scelerisque ligula vitae sem consequat tempor. In justo ipsum, hendrerit quis felis eget, vestibulum tincidunt felis. Vestibulum a ante vitae tortor cursus dapibus vitae id dolor. Maecenas volutpat commodo lacus nec sollicitudin. Vivamus dapibus felis sed metus pharetra luctus. Proin sagittis magna non dolor interdum, et eleifend dolor aliquam. Mauris ac fringilla dui. Duis eu est cursus, viverra orci quis, auctor ligula. Fusce eget ultrices risus. Suspendisse justo sapien, convallis eu lacinia sed, consectetur ac ante. Vestibulum sed ornare nibh. Phasellus volutpat, nunc eget rhoncus mattis, orci sapien eleifend quam, et venenatis diam mi ut neque. <br/>Aliquam sed ornare sem, et rutrum nibh. Mauris ornare, purus nec dignissim molestie, odio lectus rhoncus velit, vel venenatis sapien metus non nisl. In sit amet lectus eu libero tincidunt ornare a id tortor. Proin rhoncus purus ante, eu suscipit tortor rutrum non. Proin at egestas nisl. Nullam consectetur diam rhoncus, facilisis augue ut, tincidunt dui. Aliquam euismod erat diam, sed maximus tellus maximus eget. Pellentesque a sollicitudin erat. Aliquam erat volutpat. Donec viverra, lorem ac sodales interdum, ipsum ex ultricies sapien, nec aliquet sapien felis sed dui. Nam quis risus neque. Nulla mattis leo sit amet mauris facilisis, ut consectetur velit ullamcorper. Donec a elit ornare, iaculis ex sed, fringilla justo. Integer sagittis dolor volutpat felis convallis, id tempor nibh dictum. Vivamus fermentum arcu eu dolor commodo, ac auctor ex tincidunt. Vivamus in augue eu ligula bibendum molestie. Ut maximus venenatis ipsum, blandit dapibus neque bibendum et. Nullam aliquet dignissim felis id lobortis. In et massa dictum, euismod purus luctus, tempor eros.<br/> Suspendisse iaculis aliquam odio, eget vehicula ex sodales sit amet. Aliquam erat volutpat. Ut rhoncus erat nec libero accumsan, elementum imperdiet urna venenatis. Integer non laoreet massa. Fusce eleifend vestibulum orci at tempor. Integer convallis finibus velit, eu mattis elit pulvinar a. Aliquam condimentum nisi a risus sollicitudin, in iaculis nunc lobortis. Aliquam efficitur, nunc vitae consectetur semper, augue metus aliquet ipsum, luctus laoreet diam massa a leo. Suspendisse accumsan viverra sem, non euismod orci congue et. Nulla nec est et turpis imperdiet posuere.<h1>Lorem Ipsum</h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat tortor nec ornare ullamcorper. Praesent sed molestie sapien. Nunc vel diam vulputate purus dictum viverra nec sed metus. In vitae imperdiet ante. Nulla ut iaculis mauris. Suspendisse pharetra placerat ornare. Praesent in tortor arcu. Maecenas nisi nibh, ornare vitae faucibus in, sodales sagittis sapien. Morbi rutrum suscipit libero, eu sodales est aliquet vel. Sed maximus massa pretium, pulvinar enim vitae, feugiat lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed mauris ut ipsum scelerisque porttitor. Ut nec velit et massa consequat suscipit. Vivamus eget vulputate sem. Phasellus ac scelerisque lorem.<h2>Lorem Ipsum</h2> In molestie velit nec ullamcorper efficitur. Sed euismod sodales magna in mattis. Duis rhoncus odio quis fermentum efficitur. Quisque tincidunt ex pretium, tincidunt neque at, faucibus libero. Curabitur sapien tortor, tincidunt ac magna eget, sodales porttitor nunc. Donec convallis purus elit, iaculis consequat sapien euismod eu. Cras dignissim volutpat eros, vitae rhoncus massa sodales et. Maecenas mollis libero eget eros elementum, ac gravida ante efficitur. Nulla ut facilisis nibh. Mauris scelerisque ligula vitae sem consequat tempor. In justo ipsum, hendrerit quis felis eget, vestibulum tincidunt felis. Vestibulum a ante vitae tortor cursus dapibus vitae id dolor. Maecenas volutpat commodo lacus nec sollicitudin. Vivamus dapibus felis sed metus pharetra luctus. Proin sagittis magna non dolor interdum, et eleifend dolor aliquam. Mauris ac fringilla dui. Duis eu est cursus, viverra orci quis, auctor ligula. Fusce eget ultrices risus. Suspendisse justo sapien, convallis eu lacinia sed, consectetur ac ante. Vestibulum sed ornare nibh. Phasellus volutpat, nunc eget rhoncus mattis, orci sapien eleifend quam, et venenatis diam mi ut neque. <br/>Aliquam sed ornare sem, et rutrum nibh. Mauris ornare, purus nec dignissim molestie, odio lectus rhoncus velit, vel venenatis sapien metus non nisl. In sit amet lectus eu libero tincidunt ornare a id tortor. Proin rhoncus purus ante, eu suscipit tortor rutrum non. Proin at egestas nisl. Nullam consectetur diam rhoncus, facilisis augue ut, tincidunt dui. Aliquam euismod erat diam, sed maximus tellus maximus eget. Pellentesque a sollicitudin erat. Aliquam erat volutpat. Donec viverra, lorem ac sodales interdum, ipsum ex ultricies sapien, nec aliquet sapien felis sed dui. Nam quis risus neque. Nulla mattis leo sit amet mauris facilisis, ut consectetur velit ullamcorper. Donec a elit ornare, iaculis ex sed, fringilla justo. Integer sagittis dolor volutpat felis convallis, id tempor nibh dictum. Vivamus fermentum arcu eu dolor commodo, ac auctor ex tincidunt. Vivamus in augue eu ligula bibendum molestie. Ut maximus venenatis ipsum, blandit dapibus neque bibendum et. Nullam aliquet dignissim felis id lobortis. In et massa dictum, euismod purus luctus, tempor eros.<br/> Suspendisse iaculis aliquam odio, eget vehicula ex sodales sit amet. Aliquam erat volutpat. Ut rhoncus erat nec libero accumsan, elementum imperdiet urna venenatis. Integer non laoreet massa. Fusce eleifend vestibulum orci at tempor. Integer convallis finibus velit, eu mattis elit pulvinar a. Aliquam condimentum nisi a risus sollicitudin, in iaculis nunc lobortis. Aliquam efficitur, nunc vitae consectetur semper, augue metus aliquet ipsum, luctus laoreet diam massa a leo. Suspendisse accumsan viverra sem, non euismod orci congue et. Nulla nec est et turpis imperdiet posuere.<h1>Lorem Ipsum</h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat tortor nec ornare ullamcorper. Praesent sed molestie sapien. Nunc vel diam vulputate purus dictum viverra nec sed metus. In vitae imperdiet ante. Nulla ut iaculis mauris. Suspendisse pharetra placerat ornare. Praesent in tortor arcu. Maecenas nisi nibh, ornare vitae faucibus in, sodales sagittis sapien. Morbi rutrum suscipit libero, eu sodales est aliquet vel. Sed maximus massa pretium, pulvinar enim vitae, feugiat lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed mauris ut ipsum scelerisque porttitor. Ut nec velit et massa consequat suscipit. Vivamus eget vulputate sem. Phasellus ac scelerisque lorem.<h2>Lorem Ipsum</h2> In molestie velit nec ullamcorper efficitur. Sed euismod sodales magna in mattis. Duis rhoncus odio quis fermentum efficitur. Quisque tincidunt ex pretium, tincidunt neque at, faucibus libero. Curabitur sapien tortor, tincidunt ac magna eget, sodales porttitor nunc. Donec convallis purus elit, iaculis consequat sapien euismod eu. Cras dignissim volutpat eros, vitae rhoncus massa sodales et. Maecenas mollis libero eget eros elementum, ac gravida ante efficitur. Nulla ut facilisis nibh. Mauris scelerisque ligula vitae sem consequat tempor. In justo ipsum, hendrerit quis felis eget, vestibulum tincidunt felis. Vestibulum a ante vitae tortor cursus dapibus vitae id dolor. Maecenas volutpat commodo lacus nec sollicitudin. Vivamus dapibus felis sed metus pharetra luctus. Proin sagittis magna non dolor interdum, et eleifend dolor aliquam. Mauris ac fringilla dui. Duis eu est cursus, viverra orci quis, auctor ligula. Fusce eget ultrices risus. Suspendisse justo sapien, convallis eu lacinia sed, consectetur ac ante. Vestibulum sed ornare nibh. Phasellus volutpat, nunc eget rhoncus mattis, orci sapien eleifend quam, et venenatis diam mi ut neque. <br/>Aliquam sed ornare sem, et rutrum nibh. Mauris ornare, purus nec dignissim molestie, odio lectus rhoncus velit, vel venenatis sapien metus non nisl. In sit amet lectus eu libero tincidunt ornare a id tortor. Proin rhoncus purus ante, eu suscipit tortor rutrum non. Proin at egestas nisl. Nullam consectetur diam rhoncus, facilisis augue ut, tincidunt dui. Aliquam euismod erat diam, sed maximus tellus maximus eget. Pellentesque a sollicitudin erat. Aliquam erat volutpat. Donec viverra, lorem ac sodales interdum, ipsum ex ultricies sapien, nec aliquet sapien felis sed dui. Nam quis risus neque. Nulla mattis leo sit amet mauris facilisis, ut consectetur velit ullamcorper. Donec a elit ornare, iaculis ex sed, fringilla justo. Integer sagittis dolor volutpat felis convallis, id tempor nibh dictum. Vivamus fermentum arcu eu dolor commodo, ac auctor ex tincidunt. Vivamus in augue eu ligula bibendum molestie. Ut maximus venenatis ipsum, blandit dapibus neque bibendum et. Nullam aliquet dignissim felis id lobortis. In et massa dictum, euismod purus luctus, tempor eros.<br/> Suspendisse iaculis aliquam odio, eget vehicula ex sodales sit amet. Aliquam erat volutpat. Ut rhoncus erat nec libero accumsan, elementum imperdiet urna venenatis. Integer non laoreet massa. Fusce eleifend vestibulum orci at tempor. Integer convallis finibus velit, eu mattis elit pulvinar a. Aliquam condimentum nisi a risus sollicitudin, in iaculis nunc lobortis. Aliquam efficitur, nunc vitae consectetur semper, augue metus aliquet ipsum, luctus laoreet diam massa a leo. Suspendisse accumsan viverra sem, non euismod orci congue et. Nulla nec est et turpis imperdiet posuere.<h1>Lorem Ipsum</h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat tortor nec ornare ullamcorper. Praesent sed molestie sapien. Nunc vel diam vulputate purus dictum viverra nec sed metus. In vitae imperdiet ante. Nulla ut iaculis mauris. Suspendisse pharetra placerat ornare. Praesent in tortor arcu. Maecenas nisi nibh, ornare vitae faucibus in, sodales sagittis sapien. Morbi rutrum suscipit libero, eu sodales est aliquet vel. Sed maximus massa pretium, pulvinar enim vitae, feugiat lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed mauris ut ipsum scelerisque porttitor. Ut nec velit et massa consequat suscipit. Vivamus eget vulputate sem. Phasellus ac scelerisque lorem.<h2>Lorem Ipsum</h2> In molestie velit nec ullamcorper efficitur. Sed euismod sodales magna in mattis. Duis rhoncus odio quis fermentum efficitur. Quisque tincidunt ex pretium, tincidunt neque at, faucibus libero. Curabitur sapien tortor, tincidunt ac magna eget, sodales porttitor nunc. Donec convallis purus elit, iaculis consequat sapien euismod eu. Cras dignissim volutpat eros, vitae rhoncus massa sodales et. Maecenas mollis libero eget eros elementum, ac gravida ante efficitur. Nulla ut facilisis nibh. Mauris scelerisque ligula vitae sem consequat tempor. In justo ipsum, hendrerit quis felis eget, vestibulum tincidunt felis. Vestibulum a ante vitae tortor cursus dapibus vitae id dolor. Maecenas volutpat commodo lacus nec sollicitudin. Vivamus dapibus felis sed metus pharetra luctus. Proin sagittis magna non dolor interdum, et eleifend dolor aliquam. Mauris ac fringilla dui. Duis eu est cursus, viverra orci quis, auctor ligula. Fusce eget ultrices risus. Suspendisse justo sapien, convallis eu lacinia sed, consectetur ac ante. Vestibulum sed ornare nibh. Phasellus volutpat, nunc eget rhoncus mattis, orci sapien eleifend quam, et venenatis diam mi ut neque. <br/>Aliquam sed ornare sem, et rutrum nibh. Mauris ornare, purus nec dignissim molestie, odio lectus rhoncus velit, vel venenatis sapien metus non nisl. In sit amet lectus eu libero tincidunt ornare a id tortor. Proin rhoncus purus ante, eu suscipit tortor rutrum non. Proin at egestas nisl. Nullam consectetur diam rhoncus, facilisis augue ut, tincidunt dui. Aliquam euismod erat diam, sed maximus tellus maximus eget. Pellentesque a sollicitudin erat. Aliquam erat volutpat. Donec viverra, lorem ac sodales interdum, ipsum ex ultricies sapien, nec aliquet sapien felis sed dui. Nam quis risus neque. Nulla mattis leo sit amet mauris facilisis, ut consectetur velit ullamcorper. Donec a elit ornare, iaculis ex sed, fringilla justo. Integer sagittis dolor volutpat felis convallis, id tempor nibh dictum. Vivamus fermentum arcu eu dolor commodo, ac auctor ex tincidunt. Vivamus in augue eu ligula bibendum molestie. Ut maximus venenatis ipsum, blandit dapibus neque bibendum et. Nullam aliquet dignissim felis id lobortis. In et massa dictum, euismod purus luctus, tempor eros.<br/> Suspendisse iaculis aliquam odio, eget vehicula ex sodales sit amet. Aliquam erat volutpat. Ut rhoncus erat nec libero accumsan, elementum imperdiet urna venenatis. Integer non laoreet massa. Fusce eleifend vestibulum orci at tempor. Integer convallis finibus velit, eu mattis elit pulvinar a. Aliquam condimentum nisi a risus sollicitudin, in iaculis nunc lobortis. Aliquam efficitur, nunc vitae consectetur semper, augue metus aliquet ipsum, luctus laoreet diam massa a leo. Suspendisse accumsan viverra sem, non euismod orci congue et. Nulla nec est et turpis imperdiet posuere."}],
  contentToTileMapping: [],
  contentFromRoute: [],
  maxTileIndexBelow: -1,
  minTileIndexAbove: 0,
  nextAvailableRoute: 0,
  lastTileIndexGeneratedBelow: 0,
  lastTileIndexGeneratedAbove: -1,
  lastRoutePopulatedBelow: null,
  lastRoutePopulatedAbove: null
};

let addTileBelow = function(route) {
  let routeUsed;
  _store.maxTileIndexBelow++;

  if (route == null){
    if (_store.lastRoutePopulatedBelow == "/home") {
      // second content when displayed in order
      routeUsed = "/work";
    } else {
      let routeNotRenderedYet = false;

      while(!routeNotRenderedYet) {
        _store.nextAvailableRoute++;
        if (_.findWhere(_store.contentToTileMapping, {route: _store.nextAvailableRoute}) == null) {
          routeNotRenderedYet = true;
        }
      }

      routeUsed = _store.nextAvailableRoute;   
    }
  } else {
    routeUsed = route;
  }

  console.log('retrieving data for #C' + routeUsed);

  _store.contentToTileMapping.push({tileIndex: _store.maxTileIndexBelow, route: routeUsed});

  _store.lastTileIndexGeneratedBelow = _store.maxTileIndexBelow;

  _store.lastRoutePopulatedBelow = routeUsed;

  retrieveFakeData(routeUsed);
};

let retrieveFakeData = function(route) {
  let fakeData;
  switch (route) {
    case "/home":
      fakeData = _.findWhere(_store.defaultContent, {route: "/home"}).data;
    break;
    case "/work":
      fakeData = _.findWhere(_store.defaultContent, {route: "/work"}).data;
    break;
    default:
      fakeData = _.findWhere(_store.defaultContent, {route: 0}).data;
    break;
  }

  if (fakeData != null) {
    _store.contentFromRoute.push({route: route, data: fakeData});
  }
}

let addTileAbove = function(route) {
  let routeUsed;
  _store.minTileIndexAbove--;

  if (route == null){
    let routeNotRenderedYet = false;

    while(!routeNotRenderedYet) {
      _store.nextAvailableRoute--;
      if (_.findWhere(_store.contentToTileMapping, {route: _store.nextAvailableRoute}) == null) {
        routeNotRenderedYet = true;
      }
    }

    routeUsed = _store.nextAvailableRoute;   
  } else {
    routeUsed = route;
  }

  console.log('retrieving data for #C' + routeUsed);

  _store.contentToTileMapping.push({tileIndex: _store.minTileIndexAbove, route: routeUsed});

  _store.lastTileIndexGeneratedAbove = _store.minTileIndexAbove;

  _store.lastRoutePopulatedAbove = routeUsed;

  retrieveFakeData(routeUsed);
};

let addFirstTile = function(route) {
    // reset store
    _store.contentToTileMapping = [];
    _store.maxTileIndexBelow = -1;
    _store.minTileIndexAbove = 0;
    _store.nextAvailableRoute = 0;
    _store.lastRoutePopulatedAbove = null;
    _store.lastRoutePopulatedBelow = null;
    _store.lastTileIndexGeneratedAbove = 0;
    _store.lastTileIndexGeneratedBelow = -1;

    addTileBelow(route);
};

let tilesStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(eventsConstants.CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(eventsConstants.CHANGE_EVENT, cb);
  },
  getMaxTileIndex: function(){
    return _store.maxTileIndexBelow;
  },
  getMinTileIndex: function(){
    return _store.minTileIndexAbove;
  },
  getContentToTilesMapping: function(){
    return _store.contentToTileMapping;
  },
  getContent: function(routeRequested){
    let contentOfEntry;
    let entry = _.findWhere(_store.contentFromRoute, {route: routeRequested});

    if (entry != null) {
      contentOfEntry = entry.data;
    }
    return contentOfEntry;
  },
  getLastTileIndexGenerated: function() {
    return _store.lastTileIndexGeneratedBelow;
  },
  getLastContentIndexGenerated: function() {
    return _store.lastRoutePopulatedBelow;
  }
});

AppDispatcher.register(function(payload)
{
  let action = payload.action;
  switch(action.actionType)
  {
    case actionsConstants.ADD_TILE_DOWN:
      addTileBelow(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    case actionsConstants.ADD_TILE_UP:
      addTileAbove(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    case actionsConstants.ADD_FIRST_TILE:
      addFirstTile(action.data);
      tilesStore.emit(eventsConstants.CHANGE_EVENT);
    break;
    default:
      return true;
  }
});

module.exports = tilesStore;