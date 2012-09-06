Rally.onReady(function () {
    Rally.loadScripts([
        "ProjectTree.js",
        "InMemoryColumn.js",
        "PortfolioKanbanCard.js",
        "PortfolioKanban.js",
        "InProgressBoard.js",
        "App.js"
    ], function () {
        Rally.launchApp('FeaturesInProgress', {
            name:'FeaturesInProgress'
        })
    }, true);
});
