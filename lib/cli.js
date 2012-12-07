/*jshint node:true white:false */
/*global module:false */
module.exports = function () {
    'use strict';

    var args, arg,
        tags = [],
        getTags = false,
        fs = require('fs'),
        sys = require('sys'),
        jsdev = require('./jsdev'),
        quiet = false,
        result,
        file,
        comment,
        output = 'stdout';

    function showHelp() {
        sys.print([
            'USAGE: jsdev [--help|-h] [--output|-o file] [--tags|-t TAG1 TAG2] [file]',
            '', 
            'Options:', 
            '  --help (-h         - this help',
            '  --tags (-t)        - space separated list of tags (see jsdev docs for more info)',
            '  --output (-o)      - output file (default output is stdout)',
            '  --quiet  (-q)      - suppress confirmation message when writing output file',
            '  --comment (-c      - comment to insert at top of processed file (quoted)',
            ''
            ].join("\n"));
    }

    //parse arguments
    args = process.argv.slice(2);

    if (!args.length) {
        showHelp();
        process.exit(1);
    }

    file = args.pop(); //file is only required

    while (args.length) {

        arg = args.shift();

        switch (arg) {

        case '-o':
        case '--output':
            output = args.shift();
            getTags = false;
            break;

        case '-c':
        case '--comment':
            comment = args.shift();
            getTags = false;
            break;

        case '-h':
        case '--help':
            showHelp();
            process.exit(0);
            break;

        case '-t':
        case '--tags':
            //start collecting tags..
            getTags = true;
            break;

        case '-q':
        case '--quiet':
            quiet = true;
            break;

        default:
            if (getTags) {
                tags.push(arg);
            }
            if (arg.match(/^--/)) {
                showHelp();
                process.exit(0);
            }
            break;
        }
    }

    if (!file) {
        showHelp();
        process.exit(1);
    }

    //read file
    fs.readFile(file, 'utf8', function (err, source) {
        if (err) throw err;
        result = jsdev.JSDEV(source, tags, comment); 
            if (output === 'stdout') {
                sys.print(result);
            } else {
                fs.writeFile(output, result, function (err) {
                    if (err) {
                        throw err;
                    } 
                    if (!quiet) {
                        console.log('jsdev wrote output to ' + output);
                    }
                });
            }
    });
};
