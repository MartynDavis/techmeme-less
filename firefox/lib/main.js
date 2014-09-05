
var pageMod = require('sdk/page-mod'),
    self = require('sdk/self');
 
pageMod.PageMod({
  include: '*.techmeme.com',
  contentStyleFile: self.data.url('css/techmeme-less.css'),
  contentScriptFile: self.data.url('scripts/techmeme-less.js'),
});
