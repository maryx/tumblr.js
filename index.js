var async = require('async'),
    moment = require('moment'),
    tumblr = require('./lib/tumblr');
tumblr.request(require('request'));

module.exports = tumblr;
var client = tumblr.createClient({
    consumer_key: 'CPa7vG63ffYI8rHQJKZWHyiSEmSxXIi3XXzItJG3BcH2SmQRzs',
    consumer_secret: 'vE6NO6wpz2P31bKPbJut3nv3cUw5aCfIRVaYooUQ6GNETRjL9c',
    token: 'CPa7vG63ffYI8rHQJKZWHyiSEmSxXIi3XXzItJG3BcH2SmQRzs',
    token_secret: 'vE6NO6wpz2P31bKPbJut3nv3cUw5aCfIRVaYooUQ6GNETRjL9c'
});

// Trending by tag name
//var blogs = ['tastereceptor', 'food-wrappers'];
var blogs = ['coralcreationanchor',                                                                                     
             'leftfacegoatee',                                                                                          
             'ColdGardenerTale',                                                                                        
             'YoungChildCat',                                                                                           
             'BeardedCreatorTheorist',                                                                                  
             'JoyfullyUnadulteratedInternet',                                                                           
             'ValiantlyGlitterySalad',                                                                                  
             'TenaciousTimeMachineBeard',                                                                               
             'BeardedSecretaryCheese',                                                                                  
             'CasuallyScrumptiousKitten'                                                                                
            ]; 
var trending = {};
var allTimestamps = []; // for x-axis
var allTags = []; // for faster search for uniqueness
var OFFSET = 8;
var ZEROES = '00000'; // OFFSET + ZEROES = 13
async.eachSeries(blogs || [], function(blog, done) {
    client.posts(blog+'.tumblr.com', {}, function(err, res) {
        if (err) {
            console.log(err, 'error');
            return done(err, null);
        }
        res.posts.forEach(function(post) {
            var actualTimestamp = String(moment(post.date).valueOf());
            if (allTimestamps.indexOf(actualTimestamp.substring(0, OFFSET)+ZEROES) < 0) {
                allTimestamps.push(actualTimestamp.substring(0, OFFSET)+ZEROES);
            }
            // Something weird about timestamps from Tumblr only returning 1970 dates 
            var timestamp = actualTimestamp.substring(0, OFFSET); // grouping is helpful for summing trends
            post.tags.forEach(function(tag) {
                tag = tag.replace(/\s/g, ''); // remove spaces
                if (trending[tag] === undefined) {
                    trending[tag] = {};
                }
                if (trending[tag] && trending[tag][timestamp] === undefined) {
                    trending[tag][timestamp] = 0;
                }
                // if this tag is a superstring of an existing tag (e.g. 'potatosalad' vs. 'potato')
                allTags.forEach(function(existingTag) {
                    if (tag.indexOf(existingTag) > -1) {
                        console.log(existingTag);
                        trending[existingTag][timestamp] += 0.5;
                    }
                });
                if (trending[tag]){ 
                    trending[tag][timestamp] += 0.5;
                }
                trending[tag][timestamp] += 1;
            });
        });
        return done(null, trending);
    });
}, function(err) {
    if (err) {
        console.log('big errrrr');
    }
    console.log(trending);
    allTimestamps.sort(sortDate);
    console.log(allTimestamps);
});

function sortDate(a,b) {
    return a-b;
};


// Trending by date
// var blogs = ['tastereceptor', 'food-wrappers'];
// var trending = {}; // { timestamp: [{tag: frequency}]}
// async.eachSeries(blogs || [], function(blog, done) {
//     client.posts(blog+'.tumblr.com', {}, function(err, res) {
//         if (err) {
//             console.log(err, 'error');
//             return done(err, null);
//         }
//         res.posts.forEach(function(post) {
//             var timestamp = String(post.timestamp).substring(0, 6); // truncate - this should be tailored to audience
//             post.tags.forEach(function(tag) {
//                 if (trending[timestamp] === undefined) {
//                     trending[timestamp] = {};
//                 }
//                 if (trending[timestamp] && trending[timestamp][tag] === undefined) {
//                     trending[timestamp][tag] = 1;
//                 } else {
//                     trending[timestamp][tag] += 1;
//                 }
//             });
//         });
//         return done(null, trending);
//     });
// }, function(err) {
//     if (err) {
//         console.log('big errrrr');
//     }
//     console.log(trending);
//     console.log('done');
// });

// Tags
// var tag = 'kevin';
// client.tagged(tag, {limit: 20}, function(err, blogs) {
//     console.log(tag);
//     var secondTags = {},
//         uniqueTags = 0,
//         totalTags = 0,
//         totalgNotes = 0;
    
//     blogs.forEach(function(blog) {
//         console.log(blog.blog_name); //get tumblr blogs
//         totalNotes += blog.note_count;
//         blog.tags.forEach(function(tag) {
//             tag = tag.toLowerCase();
//             if (secondTags[tag] === undefined || secondTags[tag] === null) {
//                 secondTags[tag] = 1;
//                 uniqueTags += 1;
//             } else {
//                 secondTags[tag] += 1;
//             }
//             totalTags += 1;
//         });
//     });
//     console.log(secondTags);
//     console.log('Total Tags: ' + totalTags);
//     console.log('Total Unique Tags: ' + uniqueTags);
//     console.log('Total Notes: ' + totalNotes);
// });
