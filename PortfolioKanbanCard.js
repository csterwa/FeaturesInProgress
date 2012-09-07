/**
 * A special cardboard card for use by the PortfolioKanbanApp
 */
Ext.define('Rally.app.portfolioitem.PortfolioKanbanCard', {
    extend:'Rally.ui.cardboard.Card',
    alias:'widget.rallyportfoliokanbancard',

    inheritableStatics:{

        getFetchFields:function () {
            return [
                'Owner',
                'FormattedID',
                'Name',
                'StateChangedDate',
                'State'
            ];
        }

    },

    constructor: function(config) {
        config.fields = Ext.Array.union(config.fields || [], ['StateChangedDate']);
        this.callParent(arguments);
    },

    _hasReadyField:function () {
        return false;
    },

    _hasBlockedField:function () {
        return false;
    }

});