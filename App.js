Ext.define('FeaturesInProgress', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        this.buildProjectTree();
        this.buildKanbanBoard();
    },
    
    buildProjectTree: function(){
        var tree = Ext.widget('rallyprojectpicker');
        tree.on('change', this.projectSelected, this);
        this.add(tree);
    },
    
    projectSelected: function(field, value){
        this.board.updateWithProject(value);
    },
    
    buildKanbanBoard: function(){
        var board = this.board = Ext.create('FeaturesInProgress.InProgressBoard', {
            context: this.getContext()
        });
        this.add(board);
    }
});
