let routes = {
    //index page (default page)
    '/' : {
        name : 'index',
        matched(){
            hideLoader();
            document.title = "Highlight - demo";
            let data = {
                description : "A lighweight syntax highlighter",
                user : 'Fritz'
            };

            this.view(data)
        },
        
        mounted() {
            let highlight = new Highlight();
            highlight.style();
        },
        exist(){
            // history.go(0)
            showLoader();
        }
    },

    //matches about
    '/about' : {
        name : 'about',
        matched(){
            hideLoader();
            document.title = "HighlightJs - About";
            
            this.view();
        },
        //calls this method when the view is mounted
        mounted(){
        },
        exist(){
            showLoader();
            // history.go(0)
        }
    },


    '/docs' : {
        name : 'docs',
        matched(){
            hideLoader();
            document.title = "walkifyjs - documentation";
            this.view();
            hideLoader();
            // history.go(0)
        },
        mounted(){
            let highlight = new Highlight(true, {});
            highlight.style();
            let a = document.getElementsByClassName('app')[0];
            a.innerHTML = a.innerHTML;
        },
        exist(){
            showLoader();
            // history.go(0)
        }
    },
    //registering 404 route
    '!' : {
        name : '404',
        matched(){
            document.title = "walkifyjs - 404";
            //this object is ignored when this view is called from redirectTo method
            hideLoader();
            let data = {
                message : 'page not found'
            };
           this.view(data);
        },
        exist(){
            showLoader();
        }
    }
}

//instatiating walkify Class with routes Object as the argument;
let router = new Walkify(routes);
//mounting to the container with class 'app'
router.mount('.app');
/*
or one liner
let router = new Walkify(routes).mount('.app');

*/
