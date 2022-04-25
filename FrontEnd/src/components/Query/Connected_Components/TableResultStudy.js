import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux'
import {
    commonColumns,
    patientColumns,
    seriesColumns,
    studyColumns
} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFactories";
import NestedTable from "../../CommonComponents/RessourcesDisplay/ReactTable/NestedTable";
import apis from "../../../services/apis";
import { addManualQuerySeriesDetails } from "../../../actions/ManualQuery";


export default ({ studiesData, style, addManualQuerySeriesDetails }) => {

    const [series, setSeries] = useState([]);

    const dataSeries = useMemo(() => studiesData.map(result => {
        let res = { ...result, raw: result }

        let queryData = {
            Level: 'Series',
            Query: {
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: '',
                StudyInstanceUID: result.StudyInstanceUID,
                SeriesNumber: '',
                NumberOfSeriesRelatedInstances: ''
            }
        }

        let handle_open = () => {
            let queryAnswers = apis.query.dicomQuery(result.OriginAET, queryData);
            let answers = apis.query.retrieveAnswer(queryAnswers.ID);
            console.log(answers)
            setSeries(answers);
        }
    }))


    style = style || {};
    const columns = useMemo(() => [
        commonColumns.RAW,
        studyColumns.ORTHANC_ID,
        studyColumns.INSTANCE_UID,
        patientColumns.NAME(),
        patientColumns.ID(),
        studyColumns.DATE,
        studyColumns.DESCRIPTION,
        studyColumns.REQUESTED_PROCEDURE,
        studyColumns.NB_STUDY_SERIES,
        seriesColumns.NB_SERIES_INSTANCES,
        commonColumns.AET,
        studyColumns.RETRIEVE
        , {
            accessor: 'seriesDetails',
            lazy: true,
            table: [
                commonColumns.RAW,
                seriesColumns.ORTHANC_ID,
                seriesColumns.DESCRIPTION,
                seriesColumns.MODALITY,
                seriesColumns.SERIES_NUMBER,
                seriesColumns.NB_SERIES_INSTANCES,
                commonColumns.AET,
                seriesColumns.RETRIEVE
            ]
        }
    ], [])

    /*
    const data = useMemo(() => results.map(result => {
        let res = {...result, raw: result}

        let queryData = {
            Level: 'Series',
            Query: {
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: '',
                StudyInstanceUID: result.StudyInstanceUID,
                SeriesNumber: '',
                NumberOfSeriesRelatedInstances: ''
            }
        }


        const seriesDetails = [...result.seriesDetails];
        if (seriesDetails.length !== 0) {
            res.seriesDetails = async () => {
                return seriesDetails.map(serie => ({
                    ...serie,
                    raw: serie
                }))
            }
        } else {
            res.seriesDetails = () => {
                return apis.query.dicomQuery(result.OriginAET, queryData)
                    .then(queryAnswers => apis.query.retrieveAnswer(queryAnswers.ID))
                    .then(seriesAnswers => {
                        addManualQuerySeriesDetails(seriesAnswers, result.StudyInstanceUID);
                        return seriesAnswers;
                    })
                    .then(series => series.map(serie => ({
                        ...serie,
                        raw: serie
                    })))
            }
        }
        return res;
    }), [ addManualQuerySeriesDetails]);
*/

    const onExpendRow = (rowId, isExpanded) => {
        console.log(rowId)
    }

    return (
        <React.Fragment>
            <div style={style}>
                <div className="mt-5 h-5">
                    {console.log(studiesData)}
                    {console.log()}
                    <NestedTable columns={columns} toggleRowExpanded={onExpendRow} data={studiesData} filtered sorted hiddenSelect />
                </div>
            </div>
        </React.Fragment>
    )
}
