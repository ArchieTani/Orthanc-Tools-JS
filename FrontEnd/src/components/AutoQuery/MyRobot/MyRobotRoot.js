import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { Container, Row } from 'react-bootstrap'

import apis from '../../../services/apis'
import MyRobotTableStudies from './MyRobotTableStudies'
import MyRobotTableSeries from './MyRobotTableSeries'

export const ITEM_SUCCESS = 'completed'
export const ITEM_AWAITING = 'wait'
export const ITEM_PENDING = 'active'
export const ITEM_FAILED = 'failed'
export const ITEM_DELAYED = 'delayed'
export const ROBOT_WAITING_VALIDATION = 'waiting validation'
export const ROBOT_VALIDATING = 'validation'
export const ROBOT_WAITING_RETRIEVE = 'waiting retireve'
export const ROBOT_RETRIEVING = 'retrieve'
export const ROBOT_COMPLETED = 'completed'
export const LEVEL_STUDY = 'study'
export const LEVEL_SERIES = 'series'

export default () => {

    const store = useSelector(state => {
        return {
            username: state.OrthancTools.username,
        }
    })

    const [id, setId] = useState(null)
    const [projectName, setProjectName] = useState(null)
    const [creator, setCreator] = useState(null)
    const [valid, setValid] = useState(null)
    const [approved, setApproved] = useState(null)
    const [rows, setRows] = useState([])

    const [totalPercentageProgress, setTotalPercentageProgress] = useState(0)
    const [percentageFailure, setPercentageFailure] = useState(0)

    useEffect(() => {
        refreshInfo()
        let interval = setInterval(refreshInfo, 2000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const refreshInfo = async () => {
        let retrieveIds = await apis.task.getTaskOfUser(store.username, 'retrieve')
        if (retrieveIds.length > 0) {
            let response = await apis.task.getTask(retrieveIds[0]);
            refreshHandler(response)
        }
    }

    const refreshHandler = (response) => {

        let rowsRetrieveList = []

        let newPercentageFailure = 0

        response.details.items.forEach(item => {

            rowsRetrieveList.push({
                //Merge Modalities (study level) to modality column
                Modality: item.ModalitiesInStudy,
                id: item.AnswerNumber + ":" + item.AnswerId,
                ...item
            })

            if (item.Status === ITEM_FAILED) {
                ++newPercentageFailure;
            }
        });

        //SK CALCULER EN INSTANCE ET PAS EN STUDY (1 si pas d'info)
        newPercentageFailure = (newPercentageFailure / response.details.items.length) * 100

        let newTotalPercentageProgress = Math.round((newPercentageFailure + response.progress.retrieve + Number.EPSILON) * 10) / 10

        setValid(response.details.valid)
        setApproved(response.details.approved)
        setProjectName(response.details.projectName)
        setRows(rowsRetrieveList)
        setCreator(response.creator)
        setTotalPercentageProgress(newTotalPercentageProgress)
        setPercentageFailure(newPercentageFailure)
    }

    //SK ICI CHECKER LE ITEMID dans le backend (eviter position et remplacer par un ID (actuelement aswerId mais mauvaise idee car existe qu'une fois executee))
    const retryQueryHandler = async (itemId) => {
        try {
            await apis.retrieveRobot.deleteRobotItem(robotId, itemId)
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Delete Failed')
        }
    }

    const deleteQueryHandler = async (itemId) => {
        try {
            await apis.retrieveRobot.retryRobotItem(robotId, itemId)
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Retry Failed')
        }
    }

    const seriesRows = useMemo(() => {
        return rows.filter(row => row.Level === LEVEL_SERIES)
    }, [rows])

    const studiesRows = useMemo(() => {
        return rows.filter(row => row.Level === LEVEL_STUDY)
    }, [rows])

    return (
        <Container fluid>
            <Row>
                <h1 className="col"> Robot for user {creator}, project : {projectName} </h1>
                <div className="col-md-2 text-right">
                    <CircularProgressbarWithChildren
                        value={totalPercentageProgress}
                        text={`Progress : ${totalPercentageProgress}%`}
                        styles={buildStyles({
                            textSize: '10px'
                        })}
                    >
                        {/* Foreground path */}
                        <CircularProgressbar
                            value={percentageFailure}
                            styles={buildStyles({
                                trailColor: "transparent",
                                pathColor: "#f00"
                            })}
                        />
                    </CircularProgressbarWithChildren>
                </div>
            </Row>
            {
                studiesRows.length > 0 ?
                    <Row className='mt-5'>
                        <MyRobotTableStudies robotId={id} rows={studiesRows} />
                    </Row>
                    :
                    null
            }
            {
                seriesRows.length > 0 ?
                    <Row className='mt-5'>
                        <MyRobotTableSeries robotId={id} rows={seriesRows} />
                    </Row>
                    :
                    null
            }
        </Container>
    )
}