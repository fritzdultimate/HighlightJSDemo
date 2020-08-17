/*
 * Highlight.js
 * (c) Nwosu Darlignton C
 * august 2020
*/
class Highlight {
    constructor(elem, mode, styles) {
      this.identifier = this.getElemIdentifierPos(elem);
        this.d = document, this.gC = 'getElementsByClassName', this.gI = 'getElementById';
        this.mode = mode;
        // set default mode to ** HTML **
        this.mode = !this.mode ? "html" : this.mode;
        // set default styles for highlighting
        this.dStyleObj = {
            tag: '#bacc27',
            tagName: '#bacc27',
            attribute: '#bdaa21',
            attributeVal: '#27af0e',
            comment: '#8e9a8e',
            importantFlag: 'red',
            cssPropVal: '#bacc27',
            cssDel: '#d8d0d0',
            cssProp: '#72119a',
            cssSelector: '#32a53a',
            jsColor: 'yellow',
            jsKeyWord: '#4545b9',
            jsString: '#009419',
            jsNum: 'red',
            jsProp: 'red',
            braces: 'green',
            curryBraces: 'orange'
        };

        this.dElemStyleObj = {
            fontFamily: "Consolas,'Courier New', monospace",
            whiteSpace: "pre",
            display: 'block',
            maxHeight: 'inherit',
            height: '100%',
            padding: '0'
        }

        this.parentElemStyleObj = {
          backgroundColor: '#1b1818',
          color:'#fff',
          margin: '.5em 0',
          position: 'relative',
          boxShadow: '-1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf',
          borderLeft: '5px solid #358ccb',
          padding: '0',
          width: '100%',
          display: 'block',
          borderRadius:'10px'

        }

        this.styleObj = !styles ? this.dStyleObj : this.destStyleObj(styles);
        if(!this.mediaQuery()[0]) {
          this.d.head.append(this.mediaQuery()[1])
        }

    }

    mediaQuery() {
      let s = this.d.head.children,
      c = false;
      Array.from(s).forEach((el) => {
        if(el.id == 'highlightJs') {
          c = true;
        }
      })
      let style = this.d.createElement('style'),
      template = `
        @media only screen and (max-width: 600px) {
          .highlight-snippet {
            width:100%!important;
          }
        }
        .highlight-markup{
          margin:0;
          padding:inherit;
          counter-reset:item;
          list-style-type:none;
      }
      .highlight-markup li:nth-of-type(even){
        background:rgba(100, 223, 223, 0.1)
      }
      .highlight-markup li {
        background-size: 3em 3em;
        background-origin: content-box;
        padding:2px 2px;
        display:block;
        width : 100%;
        overflow:auto;
      }

      .highlight-markup li:before {
        content: counter(item) " ";
        counter-increment: item;
        margin:0;
        padding:2px;
        color:#a4bbb9;
        font-family: "san-serif, serif";
      }

      .highlight-dot {
        letter-spacing:2px;
        padding-right:5px;
        color:#a4bbb9;
      }
      `;
      style.id = 'highlightJs';
      style.append(template);
      return [c, style];
    }

    // Replace default style rules with new one
    destStyleObj(obj) {
        Object.keys(obj).forEach((el, id) => {
            if(this.dStyleObj.hasOwnProperty(el)) {
                this.dStyleObj[el] = obj[el];
            }
        })
    }

    // Extract comments from the code snippet (e.g <!-- -->, //, /* */)
    sliceComment(str, begin, end, func, constant) {

        let s, e, d = "", a = [];

        while (str.search(begin) > -1) {
        s = str.search(begin);
        e = str.indexOf(end, s);
        // style the whole line if no closing tag is matched
        if (e == -1) {e = str.length;}
        // Temporary replace the comment with a constant
        if (constant) {
            a.push(this[func](str.substring(s, e + (end.length))));     
            str = str.substring(0, s) + constant + str.substr(e + (end.length));
        } else {
            d += str.substring(0, s);
            d += this[func](str.substring(s, e + (end.length)));
            str = str.substr(e + (end.length));
        }
        }
        return {
            rest: d + str,
            arr: a
        };
    }

    htmlMode(snippet) {
        let rest = snippet,
        done = "",
        comment,
        startpos,
        endpos,
        lang,
        i;
        // 
        comment = this.sliceComment(rest, "&lt;!--", "--&gt;", "commentMode", "HTMLCOMMENT");
        rest = comment.rest;

        while (rest.indexOf("&lt;") > -1) {
            lang = "";
            startpos = rest.indexOf("&lt;");
            if (rest.substr(startpos, 9).toUpperCase() == "&LT;STYLE") {
                lang = "css";
            }
            if (rest.substr(startpos, 10).toUpperCase() == "&LT;SCRIPT") {
                lang = "javascript";
            }

            endpos = rest.indexOf("&gt;", startpos);
            if (endpos == -1) {
                endpos = rest.length;
            }
            done += rest.substring(0, startpos);
            done += this.tagMode(rest.substring(startpos, endpos + 4));
            rest = rest.substr(endpos + 4);

            if (lang == "css") {
                endpos = rest.indexOf("&lt;/style&gt;");
                if (endpos > -1) {
                done += this.cssMode(rest.substring(0, endpos));
                rest = rest.substr(endpos);
                }
            }
            if (lang == "javascript") {
                endpos = rest.indexOf("&lt;/script&gt;");
                if (endpos > -1) {
                    done += this.jsMode(rest.substring(0, endpos));
                    rest = rest.substr(endpos);
                }
            }
        }

        rest = done + rest;
        for (i = 0; i < comment.arr.length; i++) {
            rest = rest.replace("HTMLCOMMENT", comment.arr[i]);
        }
        return rest;
    }

    cssMode(snippet) {
        let rest = snippet,
        done = "",
        start,
        end,
        comment,
        i,
        cprops,
        cp,
        cpd;
    comment = this.sliceComment(rest, /\/\*/, "*/", "commentMode", "CSSCOMMENT");
    rest = comment.rest;
    while (rest.search("{") > -1) {
      start = rest.search("{");
      cprops = rest.substr(start + 1);
      cpd = 1;
      cp = 0;
      for (i = 0; i < cprops.length; i++) {
        if (cprops.substr(i, 1) == "{") {
            cpd++; cp++
        }
        if (cprops.substr(i, 1) == "}") {
            cpd--;
        }
        if (cpd == 0) {
            break;
        }
      }
      if (cpd != 0) {
          cp = 0;
        }
      end = start;
      for (i = 0; i <= cp; i++) {
        end = rest.indexOf("}", end + 1);
      }
      if (end == -1) {
          end = rest.length;
      }
      
      done += rest.substring(0, start + 1);
      done += this.cssPropertyMode(rest.substring(start + 1, end));
      rest = rest.substr(end);
    }
    rest = done + rest;
    
    rest = rest.replace(/{/g, `<span style="color: ${this.styleObj.cssDel} ">{</span>`);
    rest = rest.replace(/}/g, "<span style=color:" + this.styleObj.cssDel + ">}</span>");
    for (i = 0; i < comment.arr.length; i++) {
        rest = rest.replace("CSSCOMMENT", comment.arr[i]);
    }
    
    return `<span style="color:${this.dStyleObj.cssSelector};">${rest}</span>`;
    } 

    cssSelectorMode(snippet) {;
      return `<span style="color:${this.dStyleObj.cssSelector}">${snippet}</span>`
    }

    jsMode(snippet) {
        let rest = snippet,
        done = "",
        esc = [],
        i,
        ic,
        excs = "",
        sq,
        dq,
        commultipos,
        comilinepos,
        keywordpos,
        numpos,
        mypos,
        dotpos,
        y;
    for (i = 0; i < rest.length; i++)  {
      ic = rest.substr(i, 1);
      if (ic == "\\") {
        esc.push(rest.substr(i, 2));
        ic = "JSEXC";
        i++;
      }
      excs += ic;
    }
    rest = excs;
// 
    y = 1;
    while (y == 1) {
      sq = this.getPos(rest, "'", "'", "jsStringMode");
      dq = this.getPos(rest, '"', '"', "jsStringMode");
      // commultipos = this.getPos(rest, /\/\*/, "*/", "commentMode");
      // comilinepos = this.getPos(rest, /\/\//, "<br>", "commentMode");      
      numpos = this.getNumPos(rest, "jsNumberMode");
      keywordpos = this.getKeywordPos("js", rest, "jsKeywordMode");
      dotpos = this.getDotPos(rest, "jsPropertyMode");
      if (Math.max(numpos[0], sq[0], dq[0], /*commultipos[0],*/ /*comilinepos[0],*/ keywordpos[0], dotpos[0]) == -1) {
          break;
        }
      mypos = this.getMinPos(numpos, sq, dq, /*commultipos,*/ /*comilinepos,*/ keywordpos, dotpos);
      if (mypos[0] == -1) {
          break;
        }
      if (mypos[0] > -1) {
        done += rest.substring(0, mypos[0]);
        done += this[mypos[2]](rest.substring(mypos[0], mypos[1]));
        rest = rest.substr(mypos[1]);
      }
    }

    rest = done + rest;
    for (i = 0; i < esc.length; i++) {
      rest = rest.replace("JSEXC", esc[i]);
    }
    rest = rest.replace(/{/g, `<span style="color: ${this.styleObj.curryBraces} ">{</span>`);
    rest = rest.replace(/}/g, "<span style=color:" + this.styleObj.curryBraces + ">}</span>");
    rest = rest.replace(/\(/g, `<span style="color: ${this.styleObj.braces} ">(</span>`);
    rest = rest.replace(/\)/g, "<span style=color:" + this.styleObj.braces + ">)</span>");
    // return `<span style="color: ${this.styleObj.jsColor}">${rest}</span>`;

    




    // Work around
    let comment = this.sliceComment(rest, /\/\//, "\n", "commentMode", "JSCOMMENT");
    rest = comment.rest
    for (i = 0; i < comment.arr.length; i++) {
      let tmp = document.createElement('span');
      tmp.innerHTML = comment.arr[i];
      tmp.innerHTML = tmp.textContent;
      tmp.style.color = this.styleObj.comment;

      rest = rest.replace("JSCOMMENT", tmp.outerHTML);
    }
  let startAste = this.sliceComment(rest, /\/\*(.?)?/g, "\n", "commentMode", "JSCOMMENT");
  rest = startAste.rest;
  for (i = 0; i < startAste.arr.length; i++) {
    let tmp = document.createElement('span');
    tmp.innerHTML = startAste.arr[i];
    tmp.innerHTML = tmp.textContent;
    tmp.style.color = this.styleObj.comment;
    rest = rest.replace("JSCOMMENT", tmp.outerHTML);
  }

  let midleAste = this.sliceComment(rest, /\*(.+?)/g, "\n", "commentMode", "JSCOMMENT");
  rest = midleAste.rest;
  for (i = 0; i < midleAste.arr.length; i++) {
    let tmp = document.createElement('span');
    tmp.innerHTML = midleAste.arr[i];
    tmp.innerHTML = tmp.textContent;
    tmp.style.color = this.styleObj.comment;
    rest = rest.replace("JSCOMMENT", tmp.outerHTML);
  }

  let endAste = this.sliceComment(rest, /\*\//, "\n", "commentMode", "JSCOMMENT");
  rest = endAste.rest;
  for (i = 0; i < endAste.arr.length; i++) {
    let tmp = document.createElement('span');
    tmp.innerHTML = endAste.arr[i];
    tmp.innerHTML = tmp.textContent;
    tmp.style.color = this.styleObj.comment;
    rest = rest.replace("JSCOMMENT", tmp.outerHTML);
  }
    // Work around






    return rest;
    }

    commentMode(snippet) {
        return "<span style=color:" + this.styleObj.comment + ">" + snippet + "</span>";
    }

    tagMode(snippet) {
        let rest = snippet,
        done = "",
        startpos,
        endpos,
        result;

        while (rest.search(/(\s|<br>)/) > -1) {    
            startpos = rest.search(/(\s|<br>)/);
            endpos = rest.indexOf("&gt;");
            if (endpos == -1) {
                endpos = rest.length;
            }
            done += rest.substring(0, startpos);
            done += this.attributeMode(rest.substring(startpos, endpos));
            rest = rest.substr(endpos);
        }

        result = done + rest;
        result = "<span style=color:" + this.styleObj.tag + ">&lt;</span>" + result.substring(4);
        if (result.substr(result.length - 4, 4) == "&gt;") {
            result = result.substring(0, result.length - 4) + "<span style=color:" + this.styleObj.tag + ">&gt;</span>";
        }
        return "<span style=color:" + this.styleObj.tagName + ">" + result + "</span>";
    }

    attributeMode(snippet) {
        let rest = snippet,
        done = "",
        startpos,
        endpos,
        sq,
        dq,
        spp;

        while (rest.indexOf("=") > -1) {
            endpos = -1;
            startpos = rest.indexOf("=");
            sq = rest.indexOf("'", startpos);
            dq = rest.indexOf('"', startpos);
            spp = rest.indexOf(" ", startpos + 2);
            if (spp > -1 && (spp < sq || sq == -1) && (spp < dq || dq == -1)) {
                endpos = rest.indexOf(" ", startpos);      
            } else if (dq > -1 && (dq < sq || sq == -1) && (dq < spp || spp == -1)) {
                endpos = rest.indexOf('"', rest.indexOf('"', startpos) + 1);
            } else if (sq > -1 && (sq < dq || dq == -1) && (sq < spp || spp == -1)) {
                endpos = rest.indexOf("'", rest.indexOf("'", startpos) + 1);
            }
            if (!endpos || endpos == -1 || endpos < startpos) {
                endpos = rest.length;
            }
                done += rest.substring(0, startpos);
                done += this.attributeValueMode(rest.substring(startpos, endpos + 1));
                rest = rest.substr(endpos + 1);
            }

        return "<span style=color:" + this.styleObj.attribute + ">" + done + rest + "</span>";
    }

    attributeValueMode(snippet) {
        return "<span style=color:" + this.styleObj.attributeVal + ">" + snippet + "</span>";
    }

    cssPropertyMode(snippet) {
        let rest = snippet,
        done = "",
        start,
        end,
        nth,
        loop;

        if (rest.indexOf("{") > -1 ) { 
            return this.cssMode(rest); 
        }

        while (rest.search(":") > -1) {
        start = rest.search(":");
        loop = true;
        nth = start;
        while (loop == true) {
            loop = false;
            end = rest.indexOf(";", nth);
            if (rest.substring(end - 5, end + 1) == "&nbsp;") {
                loop = true;
                nth = end + 1;
            }
        }
        if (end == -1) {
            end = rest.length;
        }
        done += rest.substring(0, start);
        done = `<span style="color:${this.styleObj.cssProp}">${done}</span>`;
        done += this.cssPropertyValueMode(rest.substring(start));
        rest = rest.substr(end + 1);
        }
        return done ; 
    }

    cssPropertyValueMode(snippet) {
        let rest = snippet,
        done = "",
        start,
        result;
        rest = `<span style="color: ${this.styleObj.cssDel} ">:</span><span style="color:${this.styleObj.cssPropVal}">${rest.substring(1)}</span>`; 

        while (rest.search(/!important/i) > -1) {
            start = rest.search(/!important/i);
            done += rest.substring(0, start);
            done += this.cssImportantMode(rest.substring(start, start + 10));
            rest = rest.substr(start + 10);
        }
        result = done + rest;    
        if (result.substr(result.length - 1, 1) == ";" && result.substr(result.length - 6, 6) != "&nbsp;" && result.substr(result.length - 4, 4) != "&lt;" && result.substr(result.length - 4, 4) != "&gt;" && result.substr(result.length - 5, 5) != "&amp;") {
            result = result.substring(0, result.length - 1) + "<span style=color:" + this.styleObj.cssDel + ">;</span>";
        }
        return result;
    }

    cssImportantMode(snippet) {
        return "<span style=color:" + this.styleObj.cssImportant + ";font-weight:bold;>" + snippet + "</span>";
    }

    jsStringMode(snippet) {
        return "<span style=color:" + this.styleObj.jsString + ">" + snippet + "</span>";
    }

    jsKeywordMode(snippet) {
        return "<span style=color:" + this.styleObj.jsKeyWord + ">" + snippet + "</span>";
    }

    jsNumberMode(snippet) {
      let a = snippet.match(/\d+/);
      if(snippet.match(/\d+/)) {
        return "<span style=color:" + this.styleObj.jsNum + ">" + snippet + "</span>";
      }
      return snippet;
    }

    jsPropertyMode(snippet) {
        return "<span style=color:" + this.styleObj.jsKeyWord + ">" + snippet + "</span>";
    }

    getDotPos(snippet, func) {
        let x,
        i,
        j,
        start,
        k,
        sub,
        tmp,
        arr = [".","<", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/" ,"-", "*", "|", "%"];
        start = snippet.indexOf(".");
        if (start > -1) {
          sub = snippet.substr(start + 1);
          for (j = 0; j < sub.length; j++) {
            tmp = sub[j];
            for (i = 0; i < arr.length; i++) {
              if (tmp.indexOf(arr[i]) > -1) {
                k = j;
                return [start + 1, k + start + 1, func];
              }
            }
          }
        }
        return [-1, -1, func];
      }

    getMinPos(...args) {
        let i,
        arr = [];
        for (i = 0; i < args.length; i++) {
          if (args[i][0] > -1) {
            if (arr.length == 0 || args[i][0] < arr[0]) {
                arr = args[i];
            }
          }
        }
        if (arr.length == 0) {
            arr = args[i];
        }
        return arr;
      }

    getKeywordPos(typ, snippet, func) {
        let words,
        i,
        pos,
        rpos = -1,
        rpos2 = -1,
        regex;
        if (typ == "js") {
            // JavaScript keywords
          words = [
              "abstract","arguments","boolean","break","byte","case","catch","char","class","const","continue","debugger","default","delete","do","double","else","enum","eval","export","extends","false","final","finally","float","for","function","goto","if","implements","import","in","instanceof","int","interface","let","long","NaN","native","new","null","package","private","protected","public","return","short","static","super","switch","synchronized","this","throw","throws","transient","true","try","typeof","var","void","volatile","while","with","yield"
            ];
        }
        for (i = 0; i < words.length; i++) {
          pos = snippet.indexOf(words[i]);
          if (pos > -1) {
            regex = /\W/g;
            if (snippet.substr(pos + words[i].length,1).match(regex) && snippet.substr(pos - 1,1).match(regex)) {
              if (pos > -1 && (rpos == -1 || pos < rpos)) {
                rpos = pos;
                rpos2 = rpos + words[i].length;
              }
            }
          } 
        }
        return [rpos, rpos2, func];
      }

    getNumPos(snippet, func) {
        let arr = [
            "<br>", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/" ,"-", "*", "|", "%", "="
        ],
        i,
        j,
        c,
        startpos = 0,
        endpos,
        word;
        for (i = 0; i < snippet.length; i++) {
          for (j = 0; j < arr.length; j++) {
            c = snippet.substr(i, arr[j].length);
            if (c == arr[j]) {
              if (c == "-" && (snippet.substr(i - 1, 1) == "e" || snippet.substr(i - 1, 1) == "E")) {
                continue;
              }
              endpos = i;
              if (startpos < endpos) {
                word = snippet.substring(startpos, endpos);
                if (!isNaN(word)) {
                    return [startpos, endpos, func];
                }
              }
              i += arr[j].length;
              startpos = i;
              i -= 1;
              break;
            }
          }
        }  
        return [-1, -1, func];
      }

      getPos(snippet, start, end, func) {
        let s, 
        e;
        s = snippet.search(start);
        e = snippet.indexOf(end, s + (end.length));
        if (e == -1) {
          e = snippet.length;
        }
        return [s, e + (end.length), func];
      }

      getElemIdentifierPos(identifier) {
        let typ,
        cc,
        s;
        if(identifier.search(/^(\s+)?\./) > -1 ) {
          s = identifier.indexOf('.');
          typ = 'class';
          cc = identifier.substr(s+1, identifier.length).trim();
          return [true, typ, cc];
        }
        if(identifier.search(/^(\s?)+\#/) > -1) {
          s = identifier.indexOf('#');
          typ = 'id';
          cc = identifier.substr(s+1, identifier.length).trim();
          return [true, typ, cc];
        }
        return [];
      }

      parentStyles(elem, obj) {
        Object.keys(obj).forEach((el) => {
          elem.style[el] = obj[el];
        })
      }

    // Hightlight the codes
    mark() {
      let valid = this.identifier[0],
      del = this.identifier[1],
      elem = this.identifier[2],
      node,
      snippet,
      parent;
      if(valid) {
        if (del == 'class') {
          node = this.d[this.gC](elem);
          Array.from(node).forEach((el) => {
            let div = this.d.createElement('div');
            div.className = 'highlight-snippet 00-h';
            this.parentStyles(el, this.dElemStyleObj);
            snippet = el.innerHTML;
            snippet = this[this.mode + 'Mode'](snippet);
            el.innerHTML = snippet;
            div.innerHTML = el.outerHTML;
            this.parentStyles(div, this.parentElemStyleObj);
            el.replaceWith(div);
            this.utility()
            div.classList.remove('00-h')
            
          })

        } else if(del == 'id') {
          let div = this.d.createElement('div');
          div.className = 'highlight-snippet 00-h';
          node = this.d[this.gI](elem);
          this.parentStyles(node, this.dElemStyleObj);
          snippet = node.innerHTML;
          snippet = this[this.mode + 'Mode'](snippet);
          node.innerHTML = snippet;
          this.parentStyles(div, this.parentElemStyleObj);
          div.innerHTML = node.outerHTML;

          node.replaceWith(div);
          this.utility()
          // div.classList.remove('00-h')
        }
      }
    }

    utility() {
      let parentClass = this.d[this.gC]('00-h'); // Highlight Parent container

      Array.from(parentClass).forEach((el) => {
        let firstC = el.firstChild;
        let firstCE = firstC.innerHTML;
        let ol = document.createElement('ol'); 
        ol.className = 'highlight-markup';
        ol.innerHTML = firstCE;

        let loop = ol.innerHTML;
        ol.innerHTML = '';
        while(loop.match(/\n/)) {
          if(!loop.match(/\n.+/) ){ //Terrible work around here
            break;
          }
          let li = document.createElement('li');
          li.innerHTML = loop.match(/\n.+/);
          loop = loop.substring(loop.match(/\n.+/)[0].length)
          ol.innerHTML += li.outerHTML;
        }


        for(let j = 0; j < ol.children.length; j++) {

          let html = ol.children[j].innerHTML,
          s = 0,
          i,
          dot = '',
          regex = /^\s+/;
  
          s = html.search(/([^\s])/);
          for(i = 0; i < s; i++) {
            dot += '.'
          }
  
          let span = document.createElement('span');
          span.className = 'highlight-dot';
          span.innerHTML = dot;
          html = html.replace(regex, span.outerHTML);
          ol.children[j].innerHTML = html;
        }
        el.firstChild.innerHTML = ol.outerHTML;
        // parentClass.classList.remove('00-h')
      });
      
    }
}