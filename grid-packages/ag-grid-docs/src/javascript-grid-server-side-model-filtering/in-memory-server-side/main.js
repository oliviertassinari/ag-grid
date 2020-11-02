var gridOptions = {
    columnDefs: [
        { field: 'athlete', minWidth: 220, filter: 'agTextColumnFilter' },
        { field: 'country', minWidth: 200,
            filter: 'agSetColumnFilter',
            filterParams: {
                values: ['United States','Ireland','United Kingdom','Russia','Australia','Canada','Norway']
            }
        },
        { field: 'year', filter: 'agNumberColumnFilter' },
        { field: 'gold', type: 'number' },
        { field: 'silver', type: 'number' },
        { field: 'bronze', type: 'number' }
    ],
    defaultColDef: {
        flex: 1,
        minWidth: 100,
        sortable: true,
        resizable: true,
        menuTabs: ['filterMenuTab']
    },
    columnTypes: {
        'number': { filter: 'agNumberColumnFilter' },
    },
    rowModelType: 'serverSide',
    serverSideStoreType: 'inMemory',
    serverSideFilter: true,
    animateRows: true,
    debug: true
};

function ServerSideDatasource(server) {
    return {
        getRows: function(params) {
            console.log('[Datasource] - rows requested by grid: ', params.request);

            // get data for request from our fake server
            var response = server.getData(params.request);

            // simulating real server call with a 500ms delay
            setTimeout(function() {
                if (response.success) {
                    // supply rows for requested block to grid
                    params.success({rowData: response.rows, rowCount: response.lastRow});
                } else {
                    params.fail();
                }
            }, 500);
        }
    };
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json' }).then(function(data) {
        // setup the fake server with entire dataset
        var fakeServer = new FakeServer(data);

        // create datasource with a reference to the fake server
        var datasource = new ServerSideDatasource(fakeServer);

        // register the datasource with the grid
        gridOptions.api.setServerSideDatasource(datasource);
    });
});
