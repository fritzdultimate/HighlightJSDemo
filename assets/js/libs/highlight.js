const DOC = document; const GC = 'getElementsByClassName'; const GI = 'getElementById'; const CE = 'createElement';
class Highlight { 
    constructor(list = true, styleObject) {
        this.listing = list;
        this.containterClass = 'highlight-snippet-container';
        this.defaultStyleObj = {
            /*** Object of Class names ***/
            /*** where object key equals to type of text to highlight ***/
            /*** where object values equals to class name ***/

            /*** HTML classes starts here ***/
            tag: 'highlight-s-tag',
            tagName: 'highlight-s-tag-name',
            attribute: 'highlight-s-attribute',
            attributeVal: 'highlight-s-attribute-value',
            attributeValMethod: 'highlight-s-attribute-value-method',
            doctype: 'highlight-s-doctype',

            /*** HTML classes ends here ****/

            /*** CSS classes starts here ***/
            cssId: 'highlight-s-css-id',
            cssClass: 'highlight-s-css-class',
            cssTag: 'highlight-s-css-tag',
            cssMediaQ: 'highlight-s-css-mq',
            cssProp: 'highlight-s-css-property',
            cssValue: 'highlight-s-css-value',
            cssSelector: 'highlight-s-css-selector',
            cssSelectorVal: 'highlight-s-css-selector-value',

            /*** CSS classes ends here ***/

            /*** JAVASCRIPT classes starts here ***/
            jsKeywords: 'highlight-s-js-keyword',
            jsString: 'highlight-s-js-string',
            jsNumber: 'highlight-s-js-number',
            jsProperty: 'highlight-s-js-property',
            jsSpecial: 'highlight-s-js-special',
            jsPropertyMeth: 'highlight-s-js-meth',
            jsFuncName: 'highlight-s-js-function-name',
            jsFuncCall: 'highlight-s-js-function-call',
            jsRegex: 'highlight-s-regular-expression',
            jsRegexSlash: 'highlight-s-regular-expression-slashes',
            jsRegexFlags: 'highlight-s-regular-expression-flags',
            jsRegexSpecial: 'highlight-s-regular-expression-special',
            jsBool: 'highlight-s-js-boolean',
            /*** JAVASCRIPT classes ends here ***/

            /*** General classes starts here ***/
            operators: 'highlight-s-operators',
            punctuations: 'highlight-s-punctuations',
            arithmethics: 'highlight-s-arithmethics',
            comments: 'highlight-s-comments',
            /*** General classes ends here ***/
            attributes: {},
            styles: {}
        }

        this.styles = !styleObject ? this.defaultStyleObj : this.analyseStyles(styleObject);
    }

    analyseStyles(styles) {
        let classes;
        if(styles.hasOwnProperty('className')) {
            if(styles.className.hasOwnProperty('container')) {
                if(styles.className.container.override == true) {
                    if(styles.className.container.className) {
                        this.containterClass = `${styles.className.container.className}`;
                    }
                } else {
                    if(styles.className.container.className) {
                        this.containterClass += ` ${styles.className.container.className}`;
                    }
                }
            }
            classes = Object.keys(styles.className);
            classes.forEach(el => {
                if(this.defaultStyleObj.hasOwnProperty(el)) {
                    this.defaultStyleObj[el] = styles.className[el];
                }
            })
        }
        if(styles.hasOwnProperty('attributes')) {
            let attributes = {}
            Object.keys(styles.attributes).forEach(el => {
                if(this.defaultStyleObj.hasOwnProperty(el)) {
                    attributes[el] = styles.attributes[el];
                }
            })
            this.defaultStyleObj.attributes = attributes;
        }
        if(styles.hasOwnProperty('styles')) {
            let style = {};
            Object.keys(styles.styles).forEach(el => {
                if(this.defaultStyleObj.hasOwnProperty(el)) {
                    style[el] = styles.styles[el];
                }
            });
            this.defaultStyleObj.styles = style;
        }
        return this.defaultStyleObj;
    }

    renderStyle(prop) {
        // console.log(this.defaultStyleObj)
        let result = "", done = "";
        if(this.defaultStyleObj.hasOwnProperty(prop)) {
            result += `class="${this.defaultStyleObj[prop]}" `
            
        }
        if(this.defaultStyleObj.attributes.hasOwnProperty(prop)) {
            Object.keys(this.defaultStyleObj.attributes[prop]).forEach(el => {
                result += `${el}="${this.defaultStyleObj.attributes[prop][el]}" `;
            })
        }

        if(this.defaultStyleObj.styles.hasOwnProperty(prop)) {
            Object.keys(this.defaultStyleObj.styles[prop]).forEach(el => {
                done += `${el}:${this.defaultStyleObj.styles[prop][el]};`;
            });
            result += ` style=${done}`;
        }
        
        return result;
    }

    style() {
        let content = DOC.body.innerHTML,
        regex = /(`{3}\w+)/;
        while(regex.test(content)) {
            let rest = '',
            len = content.match(regex)[0].length,
            i,
            startpos = content.search(regex),
            s = content.search(regex),
            end = content.indexOf('```', startpos+1);
            end = end == -1 ? content.length : end;

            let identifier = content.match(regex)[0].trim().match(/\w+/)[0];
            // console.log(identifier)
            if(identifier.toUpperCase() == 'HTML' || identifier.toUpperCase() == 'CSS' || identifier.toUpperCase() == 'JAVASCRIPT') {

                for(i = startpos + len ; i < end; i++) {
                    rest += content[i];
                }

                content = content.substring(0, s + len) + content.substring(end + 3, content.length);
                content = content.replace(regex, 'HIGHLIGHT_CODE_SNIPPET_CONSTANT');
                rest = this.excTag(rest);
                rest = this.match(identifier, rest); // Highlight Codes
                /*
                *******************************************************************
                ******************************************************************/
               /*              ADD LIST TO SNIPPET                                */

                if(this.listing){
                    rest = rest.replace(/(.+?)?\n/g, function(str) {
                        let li = DOC[CE]('li');
                        // li.style.color = 'inherit'
                        li.innerHTML = str;
                        let s = 0,i,dot = '',regex = /^\s+/;
                
                        s = li.innerHTML.search(/([^\s])/);
                        for(i = 0; i < s; i++) {
                            dot += '.'
                        }
                        // console.log(dot, s)
                        let span = DOC[CE]('span');
                        span.className = 'highlight-s-dot';
                        span.innerHTML = dot;
                        li.innerHTML = li.innerHTML.replace(regex, span.outerHTML);
                        // ol.children[j].innerHTML = html;
                        return li.outerHTML;
                    });
                } else{ 
                    rest = rest.replace(/(.+)?/gs, '<p>$1</p>');
                }

                if(this.listing) {
                    rest = `<pre class="${this.containterClass}"><code class="highlight-snippet"><ol class="highlight-markup">${rest}</ol></code></pre>`;
                } else {
                    rest = `<pre class="${this.containterClass}"><code class="highlight-snippet"><div class="highlight-markup">${rest}</div></code></pre>`;
                }
                
                content = content.replace('HIGHLIGHT_CODE_SNIPPET_CONSTANT', rest);

                // Update Whole DOM ==> (Performance issues)

            } else {
                break;
            }
        }
        DOC.body.innerHTML = content;
    }

    match(lang, snippet) {
        lang = lang.toUpperCase() == 'JAVASCRIPT' ? 'js' : lang.toLowerCase();
        snippet = this[lang + 'Mode'](snippet);
        return snippet;

    }

    jsMode(snippet) {
        let arr,
            strBacktickReg = /(`.*?`)/g,
            strSingleReg = /('.*?')/g,
            strDoubleReg = /(".*?")/g,
            inlineCommentReg = /(?<!\*)\/\/.*/g,
            keyWords = /\b(let|var|new|const|Object|function|class)\b(\s+?)/g,
            multilineCommentReg = /\/\*.+?\s*?\n*?\*\//gs,
            numReg = /(([-+]?\b\d+\.?\d*\b)(?=(?:[^"`'\\]*(?:\\.|["`'](?:[^"`'\\]*\\.)*[^"`'\\]*["`']))*[^"`']*$))/g,
            boolReg  = /((true|false)(?=(?:[^"`'\\]*(?:\\.|["`'](?:[^"`'\\]*\\.)*[^"`'\\]*["`']))*[^"`']*$))/g,
            jsPropReg = /\b[_$\w]+(\.[_$\w]+)+(\(.*\))?/g,
            classReg = /((?<=\s*(class|function|new|Function)\s+)[$_\w]+)/g,
            extendReg = /(?<=\s*class\s+[$_\w]+\s+extends\s+)[$_\w]+/g,
            specialSymbols = [
                [/(\(|\)|\}|\{|\[|\]|\$|\;)/, 'JS_SPECIALPUNC_HIGHLIGHT_CONSTANT', 'green', 'punctuations', ],
                [/\b(\+|\%|\/|\*)\b/g,'JS_SPECIALARITH_HIGHLIGHT_CONSTANT', 'blue', 'arithmethics'],
                [/\b(\==|\===|\!=|\!|\!==|\|\||\||\&\&)\b/g,'JS_SPECIALOPERA_HIGHLIGHT_CONSTANT', 'orange', 'operators']
            ],
            regularXpReg = /\b\/.+\/([a-z]?)\b/g,


            comment = this.sliceComment(snippet, [
                [
                    multilineCommentReg,
                    'MULTILINE_COMMENT_HIGHLIGHT_COSTANT',
                ],
                [
                    inlineCommentReg,
                    'INLINE_COMMENT_HIGHLIGHT_CONSTANT',
                ]
            ]);
        snippet = comment.snippet;

        /* Function names, class names, extenders etc */
        let specialFuncNames = this.jsSpecialNames(snippet, [
            [
                classReg,
                'JS_CLASSNAME_HIGHLIGHT_CONSTANT',
                'green'
            ],
            [
                extendReg,
                'JS_EXTEND_HIGHLIGHT_CONSTANT',
                'green'
            ]
        ]);
        snippet = specialFuncNames.snippet;

        let regArr = [
            [
                strBacktickReg,
                'Backtick_HIGHLIGHT_CONSTANT',
                'jsString',
            ],
            [
                strSingleReg,
                'SINGLEQ_HIGHLIGHT_CONSTANT',
                'jsString',
            ],
            [
                strDoubleReg,
                'DOUBLEQ_HIGHLIGHT_CONSTANT',
                'jsString',
            ],
            [
                keyWords,
                'JAVASCRIPT_KEYWORDS_HIGHLIGHT_CONSTANT',
                'jsKeywords',
            ],
        ];

        let strPos = this.strPos(snippet, regArr);
        arr = strPos.arr;
        snippet = strPos.snippet;

        // Highlight Number
        snippet = snippet.replace(numReg, `<span ${this.renderStyle('jsNumber')}>$1</span>`)
        
        arr.forEach(el => {
            snippet = snippet.replace(el.constant, `<span ${this.renderStyle(el.className)}>${el.string}</span>`);
        });
/**///

        let property = this.jsProp(snippet, jsPropReg);
        snippet = property.snippet;
        let jsSpecialSym = this.jsSpecialSymbols(snippet, specialSymbols);
        snippet = jsSpecialSym.snippet;
        
        property.arr.forEach(el => {
            snippet = snippet.replace(el.constant, el.string)
        })

        specialFuncNames.arr.forEach(el => {
            snippet = snippet.replace(el.constant, `<span ${this.renderStyle('jsSpecial')}>${el.string}</span>`);
        });

       
        jsSpecialSym.arr.forEach(el => {
            if(el.single) {
                snippet = snippet.replace(el.constant, el.string);
            } else {
                snippet = snippet.replace(el.constant, `<span ${this.renderStyle('punctuations')}>${el.string}</span>`);
            }
        });

        // highligh regular expressions
        // let r = snippet.match(/\s+\/.+\/[a-z]/g);
        let regularXpArr = [];
        while(snippet.match(/\s+\/.+\/[a-z]*\s+/)) {
            let match = snippet.match(/\s+\/.+\/[a-z]*\s*/)[0], arr = [],
            index = snippet.search(/\s+\/.+\/[a-z]*/);
            snippet = snippet.replace(/(\s+\/.+\/[a-z]*)/, `REGULAR_EXP_${index}`);
            // console.log(match)
            let regStart = /(^\s*\/)/,
            // regEnd = /(\/(?=[a-z]))/,
            regFlags = /((?<=\/.+)\/[a-z]+)/,
            regSpecial = /((?<!\\)(\||\+|\^|\$|\*|\(|\)|\{|\}|\[|\]|\.|\?))/g;

            match = match.replace(regFlags, (str) => {
                let ind = match.search(regFlags);
                console.log(match.match(regFlags))
                arr.push({
                    constant: `Flags_${ind}`,
                    string: `<span ${this.renderStyle('jsRegexSlash')}>/</span>`+ str.split('/').map(el => `<span ${this.renderStyle('jsRegexFlags')}>${el}</span>`).join('')
                })
                return  `Flags_${ind}`;
            }).replace(regStart, (str) => {
                let ind = match.search(regStart);
                // console.log(match.match(regStart))
                arr.push({
                    constant: `Start${ind}`,
                    string: `<span ${this.renderStyle('jsRegexSlash')}>${str}</span>`
                })
                return  `Start${ind}`;
            })
            .replace(regSpecial, (str) => {
                let ind = match.search(regSpecial);
                // console.log(match.match(regSpecial))
                arr.push({
                    constant: `Special${ind}`,
                    string: `<span ${this.renderStyle('jsRegexSpecial')}>${str}</span>`
                })
                return  `Special${ind}`;
            })
            
            arr.forEach(el => {
                match = match.replace(el.constant, el.string)
            })
            
            match = `<span ${this.renderStyle('jsRegex')}>${match}</span>`

            regularXpArr.push({
                match,
                constant: `REGULAR_EXP_${index}`
            });
        }

        if(regularXpArr.length) {
            regularXpArr.forEach(element => {
                snippet = snippet.replace(element.constant, element.match);
            })
        }

        // highligh boolean
        snippet = snippet.replace(boolReg, `<span ${this.renderStyle('jsBool')}>$1</span>`);

        comment.arr.forEach(el => {
            if(el.string.indexOf('/*') > -1 && el.string.lastIndexOf('*/') == el.string.length - 2) {
                let end = el.string.lastIndexOf('*/') + 1;
                let done = el.string.split('\n').map(e => `<span ${this.renderStyle('comments')}>${e}</span>`).join('\n');
                snippet = snippet.replace(el.constant, done);
                 
            } else {
                snippet = snippet.replace(el.constant, `<span ${this.renderStyle('comments')}>${el.string}</span>`)
            }
        })

        return snippet;
    }
    
    sliceComment(snippet, array) {
        /********** There is a potential problem with the commenting  *****************/
        let arr = [];
        array.forEach(element => {
            snippet = snippet.replace(element[0], function(string) {
                let index = snippet.search(element[0]),
                constant = `${element[1]}_${index}`;
                arr.push({
                    string,
                    constant
                });
                return constant;
            })
        })
        return {snippet, arr};
    }

    jsSpecialNames(snippet, array) {
        let arr = [];
        array.forEach(element => {
            snippet = snippet.replace(element[0], function(string) {
                let index = snippet.search(element[0]),
                constant = `${element[1]}_${index}`;
                arr.push({
                    color: element[2],
                    string,
                    constant
                });
                return constant;
            })
        })
        return {snippet, arr}
    }

    jsSpecialSymbols(snippet, array) {
        let arr = [];
        array.forEach(element => {
            let className = element[3];
            while(element[0].test(snippet)){
                snippet = snippet.replace(element[0], function(string) {
                    let index = snippet.search(element[0]);
                    let constant = `${element[1]}_${index}`;
                    let color = element[2];
                    // let str = string;
                    let aopin = snippet.indexOf('/*', index);
                    let aclin = snippet.indexOf('*/', index);
                    
                    let sc = snippet.indexOf('//', index);
                    function lookup(txt) {
                        if(!txt) return false;
                        let bopin = txt.indexOf('/*');
                        let bclin = txt.indexOf('*/');
                        if(bclin > -1 && bopin > -1) {
                            txt = txt.slice(bclin+2);
                        }
                        if(txt.length && (txt.indexOf('*/') > -1 && txt.indexOf('/*')) > -1) {
                            lookup();
                        }
                        if(txt.indexOf('/*') > -1) {
                            return true
                        } else {
                            return false;
                        }
                    }
                    
                    if(aopin > aclin || (aopin == -1 && aclin > -1)) {
                        let done = snippet.slice(0, index);
                        let y = lookup(done);
                        arr.push({single:true, string, constant})
                        return constant;
                    }
                    arr.push({constant, string, color})
                    return constant;
                })
            }
        });
        return {snippet, arr};
    }

    jsProp(snippet, regex) {
        let arr = [];
        let that = this;

        if(regex.test(snippet)) {
            snippet = snippet.replace(regex, function(str) {

                let parenthesis = /([_$\w]+(?=\(.*\)))/,
                
                index = snippet.search(regex),
                constant = `JS_PROPERTYMODE_HIGHLIGHT_CONSTANT_${index}`;
                let a = str.split('.');
                a = a.map((el, i) => {
                    
                    if(el.match(parenthesis)) {
                        el = el.replace(/,/g, `<span ${that.renderStyle('punctuations')}>,</span>`);
                        el = el.replace(parenthesis, `<span ${that.renderStyle('jsPropertyMeth')}>$1</span>`)
                        return el;
                        
                    }
                    if(!i) {
                        return `<span ${that.renderStyle('jsSpecial')}>${el}</span>`;
                    }
                    return `<span ${that.renderStyle('jsProperty')}>${el}</span>`;
                }).join('.')
                a = a.replace('.', `<span ${that.renderStyle('punctuations')}>.</span>`);

                arr.push({
                    constant,
                    string: a
                })
                return constant;
            })
        }
        return {snippet, arr};
    }

    strPos(snippet, array) {
        let arr = [];
        array.forEach(element => {
            snippet = snippet.replace(element[0], function(string) {
                let index = snippet.search(element[0]),
                constant = `${element[1]}_${index}`;
                arr.push({
                    className:element[2],
                    string,
                    constant
                });

                return constant;
            })
        });

        return {snippet, arr};
    }

    cssMode(snippet) {
        let htmlCommentReg = /\/\*.+?\s*?\n*?\*\//gs,
        type, i, startpos, innerstart, innerend, endpos, extract = "",
        comment = this.sliceComment(snippet, [
            [
                htmlCommentReg,
                'MULTILINE_COMMENT_HIGHLIGHT_COSTANT',
            ],
        ]);
        snippet = comment.snippet;
        while(snippet.indexOf('{') > -1) {
            startpos = snippet.indexOf('{');
            endpos = snippet.indexOf('}', startpos);
            endpos = endpos == -1 ? snippet.length : endpos;

            for(i = 0; i < snippet.length; i++) {
                if(snippet[i] == '{' && i > startpos) {
                    if(i < endpos ) {
                        innerstart = i;
                        innerend = snippet.indexOf('}', i);
                        innerend = innerend == -1 ? snippet.length : innerend;
                        endpos = snippet.indexOf('}', innerend);
                        endpos = endpos == -1 ? snippet.length : endpos;
                    }
                }
            }

            extract += this.cssSelector(snippet.substring(0, startpos+1));
        //    /* if(!/\{/g.test(extract))*/ extract += '{';
            extract += this.cssSection(snippet.substring(startpos, endpos));
            // console.log(snippet.substring(startpos, endpos))
            snippet = snippet.substr(endpos);

        }
        snippet = extract + snippet;

        snippet = snippet.replace(/\{/g, `<span ${this.renderStyle('punctuations')}>{</span>`).replace(/\}/g, `<span ${this.renderStyle('punctuations')}>}</span>`);

        comment.arr.forEach(el => {
            let done = el.string.split('\n').map(e => `<span ${this.renderStyle('comments')}>${e}</span>`).join('\n');
                snippet = snippet.replace(el.constant, done);
        });

        return snippet;
    }

    cssSelector(selector) {
        let idReg = /(\#\w+)/g,
        classReg = /(\.\w+)/g,
        tagReg = /\b(h1|h2|h3|h4|h5|h6|b|p|div|spa|footer|header|i|strong|input)\b/g,
        attrReg = /((?<=\w+\[)\w+)/g,
        attrValReg = /((?<=\[.+\=)\w+)/g,
        mqReg = /(\@\w+)/g;
            
        selector = selector.replace(mqReg, `<span ${this.renderStyle('cssMediaQ')}>$1</span>`)
        .replace(attrValReg, `<span ${this.renderStyle('cssSelectorVal')}>$1</span>`)
        .replace(attrReg, `<span ${this.renderStyle('cssSelector')}>$1</span>`)
        .replace(tagReg, `<span ${this.renderStyle('cssTag')}>$1</span>`)
        .replace(idReg, `<span ${this.renderStyle('cssId')}>$1</span>`)
        .replace(classReg, `<span ${this.renderStyle('cssClass')}>$1</span>`)
        // .replace(attrReg, `<span style=color:orange>$1</span>`);
        
        
        return selector;
    }

    cssSection(section) {
        let extract = "", startpos, endpos;
        while(section.indexOf(':') > -1) {
            startpos = section.indexOf('{');
            endpos = section.indexOf(';');
            endpos = endpos == -1 ? section.length : endpos;
            extract += section.substring(0, startpos);
            extract += this.cssProperty(section.substring(startpos+1, endpos+1));
            section = section.substr(endpos+1);
        }

        section = extract + section;

        return section;
    }

    cssProperty(property) {
        /*********** Highlight both css properties and Values ***************/
        let g, h = "", i, j, k, l, m, n;
        i = property.indexOf(':');
        j = property.indexOf(';');
        j = j == -1 ? j.length : j;
        g = property.search(/\w+/);
        h += property.substring(0, g);
        k = property.substring(g, i);
        k = k.split('\n').map(el => `<span ${this.renderStyle('cssProp')}>${el}</span>`).join('\n')
        l = `<span ${this.renderStyle('operators')}>${property.substring(property.substring(0, i).length, i+1)}</span>`
        m = `<span ${this.renderStyle('cssValue')}>${property.substring(i+1, j)}</span>`;
        n = `<span ${this.renderStyle('punctuations')}>${property.substring(j)}</span>`;
        // console.log(k)
        return h + k + l + m + n;
    }

    htmlMode(snippet) {
        let htmlCommentReg = /\&lt\;\!\-{2,}.+?\s*?\n*?\-{2,}\&gt\;/gs,
        doctype = /\&lt\;\s*\!\s*DOCTYPE\s+html\s*\&gt\;/gi, doctypeTxt,
        type, lt, gt, opscript, opstyle, clscript, clstyle, extract = "",
        comment = this.sliceComment(snippet, [
            [
                htmlCommentReg,
                'MULTILINE_COMMENT_HIGHLIGHT_COSTANT',
            ],
        ]);
        snippet = comment.snippet;
        snippet = snippet.replace(doctype, (str) => {
            doctypeTxt = str; 
            return `HTML_DOCTYPE_CONSTANT`;
        })
        while (snippet.indexOf("&lt;") > -1) {
            type = "";
            lt = snippet.indexOf("&lt;");
            opstyle = "&lt;style";
            clstyle = "&lt;/style&gt;";
            opscript = "&lt;script";
            clscript = "&lt;/script&gt;";
            if (snippet.substr(lt, opstyle.length).toLowerCase() == opstyle) { //case insensitive search
                type = "css";
            }
            if (snippet.substr(lt, opscript.length).toLowerCase() == opscript) { //case insensitive search
                type = "js";
            }

            gt = snippet.indexOf("&gt;", lt);
            gt = gt == -1 ? snippet.length : gt;

            extract += snippet.substring(0, lt);
            extract += this.htmlTag(snippet.substring(lt, gt + 4)); //highlight html tag
            
            snippet = snippet.substr(gt + 4);
            // console.log(this.htmlTag(snippet.substring(lt, gt + 4)))
            if (type == "css") {
                
                gt = snippet.indexOf(clstyle);
                if (gt > -1) {
                extract += this.cssMode(snippet.substring(0, gt));
                snippet = snippet.substr(gt);
                }
            }
            if (type == "js") {
                gt = snippet.indexOf(clscript);
                if (gt > -1) {
                    extract += this.jsMode(snippet.substring(0, gt));
                    snippet = snippet.substr(gt);
                }
            }
            
        }
        snippet = extract + snippet;
        if(doctypeTxt) {
            snippet = snippet.replace('HTML_DOCTYPE_CONSTANT', `<span ${this.renderStyle('doctype')}>${doctypeTxt}</span>`);
        }

        comment.arr.forEach(el => {
            let done = el.string.split('\n').map(e => `<span ${this.renderStyle('comments')}>${e}</span>`).join('\n');
                snippet = snippet.replace(el.constant, done);
        })
        return snippet;
    }

    htmlTag(tag) {
        let startpos, endpos, extract = "", result, hasAtrr = false, tmp = tag;
        while (tag.search(/(\s|\n)/) > -1) {
            hasAtrr = true;   
            startpos = tag.search(/(\s|\n)/);
            endpos = tag.indexOf("&gt;");
            if (endpos == -1) {
                endpos = tag.length;
            }
            extract += tag.substring(0, startpos); //extract the opening tag and the tag name
            // hightlight the tag name
            extract  = `<span  ${this.renderStyle('tagName')} >` + extract.substr(extract.indexOf('&lt;') + 4) + "</span>";
            
            extract += this.htmlAttr(tag.substring(startpos, endpos)); //highlight the attributes present
            
            tag = tag.substr(endpos); //extract the closing tag
        }
        if(!hasAtrr) {
            tag = `<span ${this.renderStyle('tagName')}>` + tag.substr(tag.indexOf('&lt;') + 4, tag.length - 8) + "</span>" + `<span ${this.renderStyle('tag')}>&gt;</span>`;
        }
        result = extract + tag;
        if(tmp.indexOf('/') == -1) {
            result = `<span ${this.renderStyle('tag')}>&lt;</span>` + result; //highlight opening tag
        }
        if (tmp.indexOf("/") > -1) {
            // console.log(tmp)
            result = `<span ${this.renderStyle('tag')}>&lt;/</span>` + `<span ${this.renderStyle('tagName')}>` + tmp.substr(tmp.indexOf('/')+1, tmp.length - 9) + "</span>" + `<span ${this.renderStyle('tag')}>&gt;</span>`;
            // console.log(tmp.substr(tmp.indexOf('/')+1,tmp.length - 9), tmp)
        }
        if (result.substr(result.length - 4, 4) == "&gt;") {
            result = result.substring(0, result.length - 4) + `<span ${this.renderStyle('tag')}>&gt;</span>`;
        } else {
            // if(indexOf('/') ) {

            // }
        }
        
       
        return result;
    }

    htmlAttr(snippet) {
        let extract = "",startpos, endpos, singleQ, doubleQ, space;

        while (snippet.indexOf("=") > -1) {  //match attributes with values
            endpos = -1;
            startpos = snippet.indexOf("=");
            singleQ = snippet.indexOf("'", startpos); //attribut values with surrounding single quotes
            doubleQ = snippet.indexOf('"', startpos); //attribut values with surrounding double quotes
            space = snippet.indexOf(" ", startpos + 2);  // space to match multiple values
            if (space > -1 && (space < singleQ || singleQ == -1) && (space < doubleQ || doubleQ == -1)) {

                endpos = snippet.indexOf(" ", startpos);      
            } else if (doubleQ > -1 && (doubleQ < singleQ || singleQ == -1) && (doubleQ < space || space == -1)) {
                endpos = snippet.indexOf('"', snippet.indexOf('"', startpos) + 1);
            } else if (singleQ > -1 && (singleQ < doubleQ || doubleQ == -1) && (singleQ < space || space == -1)) {
                endpos = snippet.indexOf("'", snippet.indexOf("'", startpos) + 1);
            }
            if (!endpos || endpos == -1 || endpos < startpos) {
                endpos = snippet.length;
            }
                extract += snippet.substring(0, startpos);
                let attr = snippet.substring(startpos, endpos + 1);
                // console.log(extract)
                if(/\w+/.test(attr)) extract += this.htmlAttrVal(snippet.substring(startpos, endpos + 1));
                
                snippet = snippet.substr(endpos + 1);
            }
            // console.log(extract)

        return `<span ${this.renderStyle('attribute')}>` + extract + snippet + "</span>"; //style for attribute names
    }

    htmlAttrVal(values) {
        let meth;
        if(/\w+(?=\(.+\))/.test(values)) {
            meth = values.match(/\w+(?=\(.+\))/);
            // console.log(meth[0])
        }
        
        values = values.replace(/\w+(?=\(.+\))/, `<span style=color:#fce93f>${meth}</span>`)
        .replace('=', `<span style=color:#c92c2c>=</span>`)
        .replace(/(\"|\')/g, `<span ${this.renderStyle('punctuations')}>$1</span>`)
        .replace(/(\(|\))/g, `<span ${this.renderStyle('punctuations')}>$1</span>`)
        return `<span ${this.renderStyle('cssValue')}>` + values + "</span>";
    }

    excTag(snippet) {
        return snippet.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
