# HighlightJS
Script to hight HTML, CSS and JAVASCRIPT code snippet.

### For HighlightJS initialiation
```Javascript
let highlight = new Highlight(element, lang, style?);
//element can be an element id == '#id' or class == '.class'
//lang is the language to highlight ('html' || 'css' || 'js');
//style is an optional object with style rules;
highlight.mark();
```

#### Example below

```HTML
<div class="code">
  &lt;div class="mark-up" data-custom="data"&gt; content &lt;/div&gt;
</div>
```

```Javascript

let highlight = new Highlight('.code', 'html', {
  tag:'red', 
  tagName: 'green', 
  attribute: 'orange', 
  attributeVal: 'red'
});
highlight.mark();
```


