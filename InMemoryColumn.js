Ext.define('FeaturesInProgress.InMemoryColumn', {
    extend: 'Rally.ui.cardboard.Column',
    alias: 'widget.inmemorycolumn',
    
    _queryForData: function(){
        this.createAndAddCards(this.features);
    }
    
});