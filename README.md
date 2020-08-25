# HighlightJS
Script to hight HTML, CSS and JAVASCRIPT code snippet.

### For HighlightJS initialiation
```Javascript
let highlight = new Highlight(enable_list?, style?);
//style is an optional object with style rules;
//enable_list is a boolean: True to enable listing, false to disable. enabled by default.
highlight.style();
```

#### Example below

```HTML
```HTML
<div class="code">
  <div class="mark-up" data-custom="data"> content </div>
</div>
```
```

```Javascript
let highlight = new Highlight(true {
  className : {
    tag: 'class'
    }
  }
  
  attributes{//},
  styles: {//}
});
highlight.style();
```


