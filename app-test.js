Rally.onReady(function () {
    Rally.loadScripts([
        "ProjectTree.js",
        "InMemoryColumn.js",
        "PortfolioKanbanCard.js",
        "PortfolioKanban.js",
        "InProgressBoard.js",
        "App.js"
    ], function () {
        //include the tests in the test.html head
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.getEnv().execute();
    }, true);
});
