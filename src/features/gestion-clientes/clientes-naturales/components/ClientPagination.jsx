import * as React from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {createFakeServer} from '@mui/x-data-grid-generator';

const PAGE_SIZE = 5;

const SERVER_OPTIONS = {
    useCursorPagination: true,
};

const {useQuery, ...data} = createFakeServer({}, SERVER_OPTIONS);


// TODO : Implement Server side rendering for Customer's table
export function ClientPagination() {

    // eslint-disable-next-line no-undef
    const mapPageToNextCursor = useRef({});

    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: PAGE_SIZE,
    });

    const queryOptions = useMemo(
        () => ({
            cursor: mapPageToNextCursor.current[paginationModel.page - 1],
            pageSize: paginationModel.pageSize,
        }),
        [paginationModel],
    );
    const {isLoading, rows, pageInfo} = useQuery(queryOptions);

    const handlePaginationModelChange = (newPaginationModel) => {
        if (
            newPaginationModel.page === 0 ||
            mapPageToNextCursor.current[newPaginationModel.page - 1]
        ) {
            setPaginationModel(newPaginationModel);
        }
    };

    useEffect(() => {
        if (!isLoading && pageInfo?.nextCursor) {
            mapPageToNextCursor.current[paginationModel.page] = pageInfo?.nextCursor;
        }
    }, [paginationModel.page, isLoading, pageInfo?.nextCursor]);

    const [rowCountState, setRowCountState] = React.useState(
        pageInfo?.totalRowCount || 0,
    );
    useEffect(() => {
        setRowCountState((prevRowCountState) =>
            pageInfo?.totalRowCount !== undefined
                ? pageInfo?.totalRowCount
                : prevRowCountState,
        );
    }, [pageInfo?.totalRowCount, setRowCountState]);

    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                {...data}
                pageSizeOptions={[PAGE_SIZE]}
                initialState={{
                    ...data.initialState,
                    pagination: { paginationModel: { pageSize: 25 } },
                }}
                rowCount={rowCountState}
                paginationMode="server"
                onPaginationModelChange={handlePaginationModelChange}
                paginationModel={paginationModel}
                loading={isLoading}

            />
        </div>
    );
}