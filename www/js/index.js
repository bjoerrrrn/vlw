var appomat = {};

appomat.app = {
	
	blogData: [	{title: "vLw NRW e.V.", body:"Willkommen!"}, 
				{title: "vLw NRW e.V.", body:"Willkommen!"}],
	
	postTemplate: {},	
	blogListTemplate: {},

	post: {},
	savedPosts: {},

	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		this.postTemplate = Handlebars.compile($("#post-template").html());
		this.blogListTemplate = Handlebars.compile($("#blog-list-template").html());
		
		var app = this;
		$("#home-refresh-btn").click(function(){
			app.get_blog_data();
		});
		
		$("#post-save-btn").click(function(){
			if (app.savedPosts[app.post.url]===undefined) {
				app.savedPosts[app.post.url] = app.post.title;
			} else {
				delete app.savedPosts[app.post.url];
			}
			app.updatePostSaveButton();
		});
    },

	homeBeforeCreate: function(event, args) {
		this.get_blog_data();
	},
	
	get_blog_data: function() {
		var app = this;
		$.get("https://vlw-nrw.de/index.php/component/k2/itemlist/category/1?format=feed&type=rss", function(data) {
			app.blogData= $(data).find("item").map(function(i, item) {
				return { 
					url: $(item).find("link").text(), 
					title: $(item).find("title").text(), 
					body: $(item).find("description").text()
				};
			}).toArray();
			$("#home-content").html(app.blogListTemplate(app.blogData));
			$("#home-content").enhanceWithin();
		});
		
	},
	
	updatePostSaveButton: function() {
		if (this.savedPosts[this.post.url]===undefined) {
			$("#post-save-btn").text("Save").removeClass("ui-btn-b");
		} else {
			$("#post-save-btn").text("Saved").addClass("ui-btn-b");			
		}
 	},

	postBeforeShow: function(event, args) {
		this.post = this.blogData[args[1]];
		$("#post-content").html(this.postTemplate(this.post));
		$("#post-content").enhanceWithin();
		$("#post-content a").click(function(e) {
			window.open(this.href, '_blank', 'location=yes'); 
			return false;	
		});
		this.updatePostSaveButton();
	},

	onDeviceReady: function() {
		FastClick.attach(document.body);		
    }

};

appomat.router = new $.mobile.Router(
	{
		"#post[?](\\d+)$": {handler: "postBeforeShow", events:"bs"},
		"#home$": {handler: "homeBeforeCreate", events:"bc"}
	}, 
	appomat.app
);