Ext.define('FeaturesInProgress.InProgressBoard', {
    extend: 'Ext.Container',
    
    config: {
        context: undefined,
        selectedProject: undefined
    },
    
    constructor: function(config){
        this.initConfig(config);
        this.callParent(arguments);
    },
    
    initComponent: function(){
        this.callParent(arguments);
        
        this.add({
            xtype: 'component',
            autoEl: 'h1',
            html: 'In Progress Features'
        });
        this.add({
            xtype: 'component',
            cls: 'grayLabel',
            html: 'The in progress Features shown have child User Stories assigned to the selected Project on the left.'
        });
        this.add({
            xtype: 'container',
            itemId: 'boardContainer'
        });
        
        Rally.data.ModelFactory.getModel({
            type: 'Portfolio Item',
            success: function(model){
                this.portfolioItemModel = model;
                this.buildBoard();
            },
            scope: this
        });
    },
    
    buildBoard: function(){
        
        var container = this.down('#boardContainer');
        container.removeAll();
        
        if(!this.getSelectedProject()){
            container.add({
                xtype: 'component',
                cls: 'noProjectSelected',
                html: 'No project selected'
            });
            return;
        }
        
        this.findFeaturesForProject(this.getSelectedProject(), function(featureRefs){
            featureRefs = Ext.Array.unique(featureRefs);
            
            this.hydrateFeatureRefs({
                featureRefs: featureRefs,
                callback: function(features){
                    var cardboard = Ext.create('FeaturesInProgress.PortfolioKanban', {
                        context: this.getContext(),
                        features: features
                    });
                    container.add(cardboard);
                },
                scope: this
            });
            
        }, this);
        
    },
    
    findFeaturesForProject: function(project, callback, scope){
        
        var storyFilter = Ext.create('Rally.data.QueryFilter', {
            property: 'Parent',
            operator: '!=',
            value: 'null'
        });
        
        storyFilter = storyFilter.or({
            property: 'PortfolioItem',
            operator: '!=',
            value: 'null'
        });
        
        storyFilter = storyFilter.and({
            property: 'ScheduleState',
            value: 'In-Progress'
        });
        
        var store = Ext.create('Rally.data.WsapiDataStore', {
            pageSize: 200,
            model: 'User Story',
            filters: storyFilter,
            context: {
                project: project.get('_ref'),
                projectScopeDown: true
            }
        });
        
        store.load({
            callback: function(records){
                this.findFeaturesForUserStories(records, [], function(featureRefs){
                    callback.call(scope, featureRefs);
                }, this);
            },
            scope: this
        });
        
    },
    
    /**
     * Given a list of stories, finds the collection of feature refs that they belong to.
     * Calls callback with feature refs.
     */
    findFeaturesForUserStories: function(stories, features, callback, scope){
        features = features || [];
        
        if(stories.length === 0){
            callback.call(scope, features);
            return;
        }
        
        var story = stories.shift();
        this.findFeatureForUserStory(story, function(feature){
            if(feature){
                features.push(feature);
            }
            
            this.findFeaturesForUserStories(stories, features, callback, scope);
        }, this);
        
    },
    
    /**
     * Looks at the parent recursively until it finds a portfolio item.
     * Calls the callback with the found portfolio item ref.
     */
    findFeatureForUserStory: function(story, callback, scope){
        
        if(story.get('PortfolioItem')){
            callback.call(scope, story.get('PortfolioItem')._ref);
        } else if(story.get('Parent')) {
            
            var oid = Rally.util.Ref.getOidFromRef(story.get('Parent')._ref);
            story.self.load(oid, {
                callback: function(parent){
                    this.findFeatureForUserStory(parent, callback, scope);
                },
                scope: this
            });
            
        } else {
            callback.call(scope);
        }
    },
    
    hydrateFeatureRefs: function(options){
        options.features = options.features || [];
        
        if(options.featureRefs.length === 0){
            options.callback.call(options.scope, options.features);
            return;
        }
        
        var ref = options.featureRefs.shift();
        this._hydrate({
            ref: ref,
            callback: function(feature){
                options.features.push(feature);
                this.hydrateFeatureRefs(options);
            },
            scope: this
        });
        
        
    },
    
    _hydrate: function(options){
        var oid = Rally.util.Ref.getOidFromRef(options.ref);
        this.portfolioItemModel.load(oid, {
            callback: function(record){
                options.callback.call(options.scope, record);
            }
        });
    },
    
    updateWithProject: function(record){
        this.setSelectedProject(record);
        this.buildBoard();
    }
});