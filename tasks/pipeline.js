/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'styles/**/*.css',
  'bower_components/leaflet/dist/leaflet.css',
  'bower_components/dcjs/dc.css',
  'bower_components/leaflet-sidebar/src/L.Control.Sidebar.css',
  'bower_components/bootstrap/dist/css/bootstrap.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  
  // Load sails.io before everything else
  'js/dependencies/sails.io.js',
  // Dependencies like jQuery, or Angular are brought in here
  'bower_components/jquery/dist/jquery.js',
  'bower_components/d3/d3.min.js',
  'bower_components/leaflet/dist/leaflet.js',
  'bower_components/leaflet-sidebar/src/L.Control.Sidebar.js',
  'bower_components/crossfilter/crossfilter.min.js',
  'bower_components/dcjs/dc.min.js',
  'bower_components/bootstrap/dist/js/bootstrap.js',
  'bower_components/colorbrewer/colorbrewer.js',
  'js/src/mapQuery.js',
  'js/src/barChartDraw.js',
  'js/src/barChartQuery.js',
  'js/src/lineComposite.js',
  'js/src/lineChartDraw.js',
  'js/src/lineChartQuery.js',
  'js/src/mapDraw.js',
  'data/us-states.js',
  //'js/src/index.js',
  'js/src/clorIndex.js'



  // All of the rest of your client-side js files
  // will be injected here in no particular order.

];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
