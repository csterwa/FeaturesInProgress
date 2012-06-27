Ext.define('FeaturesInProgress', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
        {
            xtype: 'container',
            cls: 'leftSide',
            itemId: 'leftSide'
        },
        {
            xtype: 'container',
            cls: 'rightSide',
            itemId: 'rightSide'
        }
    ],

    launch: function() {
        
        //left column: project tree
        //right column:
        //list of features that has stories under it assigned to the selected project
        //pi kanban board of features
        
        this.buildProjectTree();
        this.buildKanbanBoard();
        
    },
    
    buildProjectTree: function(){
        
        var tree = Ext.create('FeaturesInProgress.ProjectTree');
        tree.on('projectselected', this.projectSelected, this);
        this.down('#leftSide').add(tree);
    },
    
    projectSelected: function(record){
        this.board.updateWithProject(record);
    },
    
    buildKanbanBoard: function(){
        
        var board = this.board = Ext.create('FeaturesInProgress.InProgressBoard', {
            context: this.getContext()
        });
        this.down('#rightSide').add(board);
    }
});
