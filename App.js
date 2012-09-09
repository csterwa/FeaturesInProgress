Ext.define('FeaturesInProgress', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        this.buildProjectPicker();
        this.buildKanbanBoard();
    },
    
    buildProjectPicker: function(){
        var picker = Ext.widget('rallyprojectpicker');
        picker.on('change', this.projectSelected, this);
        this.add(picker);
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
