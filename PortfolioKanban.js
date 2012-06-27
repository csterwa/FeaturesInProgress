Ext.define('FeaturesInProgress.PortfolioKanban', {
        extend: 'Ext.Container',
        
        config: {
            context: undefined,
            features: []
        },
        
        constructor: function(config){
            this.initConfig(config);
            this.callParent(arguments);
        },

        initComponent: function(){
            this.callParent(arguments);
            
            Ext.create('Rally.data.WsapiDataStore', {
                autoLoad: true,
                model: 'Type',
                sorters: {
                    property: 'ordinalValue',
                    direction: 'Asc'
                },
                listeners: {
                    load: function(store, records){
                        this._loadCardboard(records[0].get('_ref'));
                    },
                    scope: this
                }
            });

        },

        _loadCardboard: function(type) {
            this.type = type;
            this._loadStates({
                type: type,
                success: function (states) {
                    
                    var columns = this._createColumns(states);
                    this._drawCardboard(columns);
                },
                scope: this
            });

        },

        /**
         * @private
         * We need the States of the selected Portfolio Item Type to know what columns to show.
         * Whenever the type changes, reload the states to redraw the cardboard.
         * @param options
         * @param options.success called when states are loaded
         * @param options.scope the scope to call success with
         */
        _loadStates:function (options) {

            Ext.create('Rally.data.WsapiDataStore', {
                model: 'State',
                context: this.getContext().getDataContext(),
                autoLoad: true,
                fetch: ['Name', 'WIPLimit', 'Description'],
                filters: [
                    {
                        property: 'StateType',
                        value: options.type
                    },
                    {
                        property: 'Enabled',
                        value: true
                    }
                ],
                sorters: [
                    {
                        property: 'OrderIndex',
                        direction: 'ASC'
                    }
                ],
                listeners: {
                    load: function(store, records) {
                        if(options.success) {
                            options.success.call(options.scope || this, records);
                        }
                    }
                }
            });

        },

        /**
         * Given a set of columns, build a cardboard component. Otherwise show an empty message.
         * @param columns
         */
        _drawCardboard:function (columns) {
            if (columns) {
                var cardboard = this.down('#cardboard');
                if (cardboard) {
                    cardboard.destroy();
                }

                cardboard = Ext.widget('rallycardboard', {
                    types: ['PortfolioItem'],
                    itemId: 'cardboard',
                    attribute: 'State',
                    columns: columns,
                    maxColumnsPerBoard: columns.length,
                    enableRanking: false,
                    columnConfig: {
                        xtype: 'inmemorycolumn'
                    },
                    cardConfig: {
                        xtype: 'rallyportfoliokanbancard'
                    }
                });

                this.add(cardboard);

                this._attachPercentDoneToolTip(cardboard);

                Ext.EventManager.onWindowResize(cardboard.resizeAllColumns, cardboard);
            } else {
                this._showNoColumns();
            }

        },

        _showNoColumns:function () {
            this.add({
                xtype: 'container',
                cls: 'no-type-text',
                html: '<p>This Type has no states defined.</p>'
            });
        },

        _createColumns: function(states){
            var columns;

            if (states.length) {
                
                var features = Ext.Array.filter(this.getFeatures(), function(feature){
                    return !feature.get('State');
                });

                columns = [
                    {
                        displayValue: 'No Entry',
                        value: null,
                        cardLimit: 50,
                        features: features
                    }
                ];

                Ext.Array.each(states, function(state){
                    
                    var features = Ext.Array.filter(this.getFeatures(), function(feature){
                        return feature.get('State') && feature.get('State')._refObjectName === state.get('Name');
                    });
                    
                    columns.push({
                        value: state.get('_ref'),
                        displayValue: state.get('Name'),
                        features: features
                    });
                }, this);
            }

            return columns;
        },

        _attachPercentDoneToolTip:function (cardboard) {
            Ext.create('Rally.ui.tooltip.PercentDoneToolTip', {
                target: cardboard.getEl(),
                delegate: '.percentDoneContainer',
                listeners: {
                    beforeshow: function(tip){

                        var cardElement = Ext.get(tip.triggerElement).up('.cardContainer');
                        var card = Ext.getCmp(cardElement.id);

                        tip.updateContent(card.getRecord().data);
                    },
                    scope:this
                }
            });
        }

    });