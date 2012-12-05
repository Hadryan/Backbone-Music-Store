var Helpers = {
	showMessage: function ( header, message, type ) {
		var _html = "<h4>" + header + "</h4>";
		_html += "<p>" + message + "</p>";

		$('#alert')
			.removeClass()
			.removeAttr('style')
			.addClass('alert alert-block alert-' + type)
			.html(_html)
			.animate({ opacity: 1.0 }, 5000)
			.fadeOut('slow');
	}
};

Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

window.Genre = Backbone.Model.extend({
	defaults: {
		id: null,
		name: ''
	},
	validate: function ( attribs ) {
		if (attribs.name === undefined || attribs.name === '') {
			return 'Remember to set a name for your genre.';
		}
	}
});

window.Genres = Backbone.Collection.extend({
	model: Genre
});

window.GenreListView = Backbone.View.extend({
	el: $('#genre-menu'),
	initialize: function () {
		this.render();
	},
	render: function ( e ) {
		_.each(this.model.models, function ( genre ) {
			$(this.el).append(new GenreListItemView({ model: genre }).render());
		}, this);
		return this.el;
	}
});

window.GenreListItemView = Backbone.View.extend({
	template: _.template($('#genre-item-template').html()),
	initialize: function () {
		var self = this;
		this.model.bind('change', self.render, this);
		this.model.bind('destroy', self.close, this);
	},
	render: function ( e ) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this.el;
	},
	close: function () {
		$(this.el).unbind().remove();
	}
});

window.GenreView = Backbone.View.extend({
	el: $('#content'),
	template: _.template($('#genre-template').html()),
	initialize: function () {
		var self = this;
		this.model.on('error', function ( model, error ) {
			Helpers.showMessage('Genre', error, 'error');
		});
		this.model.bind('change', self.render, this);
		this.model.bind('destroy', self.close, this);
		this.render();
	},
	render: function ( e ) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this.el;
	},
	events: {
		'click a.btn-primary': 'saveChanges'
	},
	saveChanges: function () {
		this.model.set({
			'id': $('#id').val(),
			'name': $('#name').val()
		});
	},
	close: function () {
		$(this.el).unbind().empty();
	}
});

var AppRouter = Backbone.Router.extend({
	routes: {
		'genres/:id': 'browse'
	},
	browse: function ( id ) {
		var genre = genreList.get(id);
		console.log( 'Browsing ' + genre.get('name'));
		var genreView = new GenreView({ model: genre });
	}
});

var genreList = new Genres();
genreList.add(new Genre({ id: 1, name: 'Blues' }));
genreList.add(new Genre({ id: 2, name: 'Classical' }));
genreList.add(new Genre({ id: 3, name: 'Electronic' }));
genreList.add(new Genre({ id: 4, name: 'Jazz' }));
genreList.add(new Genre({ id: 5, name: 'Pop' }));
genreList.add(new Genre({ id: 6, name: 'R&B' }));
genreList.add(new Genre({ id: 7, name: 'Reggae' }));
genreList.add(new Genre({ id: 8, name: 'Rock' }));

this.genreMenu = new GenreListView({ model: genreList });

var app = new AppRouter();
Backbone.history.start();
