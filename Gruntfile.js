/*jshint camelcase:false */
/*
 * crude
 *
 */

module.exports = function( grunt ) {
  var pkg = grunt.file.readJSON('package.json');
  require('load-grunt-tasks')(grunt);

  //
  // Grunt configuration:
  //
  //
  grunt.initConfig({
    // Project configuration
    // ---------------------
    //
    pkg: pkg,

    jshint: {
      options: {
        jshintrc: true,
      },
      backend: ['lib/**/*.js'],
    },

    release: {
      options: {
        bump: true, //default: true
        file: 'package.json', //default: package.json
        add: true, //default: true
        commit: true, //default: true
        tag: true, //default: true
        push: true, //default: true
        pushTags: true, //default: true
        npm: true, //default: true
        tagName: 'v<%= version %>', //default: '<%= version %>'
        commitMessage: 'releasing v<%= version %>', //default: 'release <%= version %>'
        tagMessage: 'v<%= version %>' //default: 'Version <%= version %>'
      }
    },
  });

  grunt.registerTask('start', 'Start all required services', ['startMongo', 'startPostgres']);
  grunt.registerTask('stop', 'Stop all services', ['stopMongo', 'stopPostgres']);
};
