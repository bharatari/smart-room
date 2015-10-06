module.exports = function(grunt) {
    grunt.initConfig({
        clean: ["SmartRoomAPI/assets/SmartRoomOnline/"],
        copy: {
            main: {
                files: [ 
                    {expand: true, cwd: 'SmartRoomOnline/dist/', src: ['**'], dest: 'SmartRoomAPI/assets/SmartRoomOnline/'},
                ]
            }
        },
        replace: {
            index: {
                src: ['SmartRoomAPI/assets/SmartRoomOnline/index.html'], 
                dest: 'SmartRoomAPI/views/homepage.ejs', 
                replacements: [{
                    from: 'href="assets/',                   
                    to: 'href="/SmartRoomOnline/assets/'
                }, {
                    from: 'src="assets/',                   
                    to: 'src="/SmartRoomOnline/assets/'
                }, {
                    from: 'io.sails.url = "http://localhost:1337";',
                    to: ''
                }]
            },
            css: {
                src: ['SmartRoomAPI/assets/SmartRoomOnline/assets/*.css'], 
                overwrite: true,
                replacements: [{
                    from: "(/images/",                   
                    to: "(/SmartRoomOnline/images/"
                }]
            },
            js: {
                src: ['SmartRoomAPI/assets/SmartRoomOnline/assets/*.js'],
                overwrite: true,
                replacements: [{
                    from: '"images/',                   
                    to: '"/SmartRoomOnline/images/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.registerTask('default', ['clean', 'copy', 'replace'])
}