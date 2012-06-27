Ext.define('FeaturesInProgress.ProjectTree', {
    extend: 'Ext.Container',
    
    initComponent: function(){
        this.callParent(arguments);
        this.add({
            xtype: 'component',
            autoEl: 'h1',
            html: 'Projects'
        });
        this.add({
            xtype: 'component',
            cls: 'grayLabel',
            html: 'Drill down to see Projects in Rally. Select one to see in progress Features on the right.'
        });
        this.buildTree();
    },
    
    buildTree: function(){
        var tree = Ext.widget('rallytree', {
            topLevelModel: 'Workspace',
            topLevelStoreConfig: {
                filters: [], 
                sorters: [], 
                context: {
                    workspace: 'null', 
                    project: undefined
                }
            },
            treeItemConfigForRecordFn: function(record){
                if(record.get('_type') === 'workspace'){
                    return {
                        expanded: true
                    };
                } else {
                    return {
                        selectable: true
                    };
                }
            },
            childModelTypeForRecordFn: function(){
                 return 'Project';
            },
            parentAttributeForChildRecordFn: function(record){
                return 'Parent';
            },
            childItemsStoreConfigForParentRecordFn: function(record){
                if(record.get('_type') === 'workspace'){
                    return {
                        filters: [{
                                property: 'Parent', 
                                value: 'null'
                        }],
                        sorters: [],
                        context: {
                            workspace: record.get('_ref'), 
                            project: null
                        }
                    };
                } else {
                    return {
                        sorters:[]
                    };
                }
            },
            canExpandFn: function(record){
                return record.get('Projects') && record.get('Projects').length > 0
                || record.get('Children') && record.get('Children').length > 0;
            }
        });
        
        tree.on('itemselected', function(selectedTreeItem){
            selectedTreeItem.addCls('selected');
            this.fireEvent('projectselected', selectedTreeItem.getRecord())
        }, this);
        
        this.add(tree);
    }
});