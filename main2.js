var request = require('request');
var cheerio = require('cheerio');
var JSSoup = require('jssoup').default;
var espree = require("espree");



url = 'https://animeflv.net/ver/13874/detective-conan-67';

    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);

            var scripts = $('script').filter(function() {
                return ($(this).html().indexOf('var video =') > -1);
            });
            if (scripts.length === 1) {
                var text = $(scripts[0]).html();
                
                var ast = espree.parse(text);
                var iframes = []
                var index = 6
                var links = []
                while(ast.body[index]){
                    if(typeof ast.body[index+1] === 'undefined'){
                        break
                    }else{
                        iframes.push(ast.body[index].expression.right.value)
                    }
                    index++
                }
                iframes.forEach(element => {
                    links.push(new JSSoup(element).find('iframe').attrs.src)
                });
                links.forEach(function(element, index) {
                    // Do your thing, then:
                    if (index != 0) {
                        request(element, function(error, response, html){
                            if(!error){
                                var $ = cheerio.load(html);
                                var script = $('script').filter(function() {
                                    return ($(this).html().indexOf('window.location.href') > -1);
                                });
                                if (script.length === 1) {
                                    var text = $(script[0]).html();
                                    var ast = espree.parse(text);
                                    console.log(ast.body[0].consequent.body[0].expression.right.value)
                                }
                            }
                        })    
                    }
                    
                    

                })
                
            }

        }

    })