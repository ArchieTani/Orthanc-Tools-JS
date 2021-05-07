import React, { Component } from "react"
import {connect} from 'react-redux'

import TableStudy from "../CommonComponents/RessourcesDisplay/TableStudy"
import apis from "../../services/apis"
import task from "../../services/task"
import MonitorTask from "../../tools/MonitorTask"
import { Fragment } from "react"

import {addStudiesToDeleteList} from "../../actions/DeleteList"
import {addStudiesToExportList} from "../../actions/ExportList"


class AnonymizedResults extends Component {

    state = {
        studies: []
    }

    componentDidMount = async () => {
        if (this.props.anonTaskID) {
            let anonTask = await task.getTask(this.props.anonTaskID);
            if (!!anonTask) {
                this.handleTask(anonTask);
                if (!["completed", "failed"].includes(anonTask.state)) {
                    this.monitor = new MonitorTask(this.props.anonTaskID, 4000);
                    this.monitor.onUpdate(this.handleTask.bind(this));
                    this.monitor.onFinish(() => {
                    });
                    this.monitor.startMonitoringJob();
                }
            }
        }
    }

    componentWillUnmount = () => {
        if (this.monitor) this.monitor.stopMonitoringJob();
    }

    handleTask = async anonTask => {
        let studies = []
        for (const item of anonTask.details.items) {
            if (item.state === "completed") {
                try {
                    let study = await apis.content.getStudiesDetails(item.result)
                    console.log(study)
                    studies.push({
                        ...study,
                        ...study.MainDicomTags,
                        ...study.PatientMainDicomTags,
                        StudyOrthancID: study.ID,
                        AnonymizedFrom: study.AnonymizedFrom,
                        newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : '',
                        newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : ''
                    });
                } catch (err) {
                    if (err.statusCode !== 404) {
                        throw err;
                    }
                }

            }
        }
        this.setState({
            studies
        });
    }

    getCSV = () => {
        //Level study ou series
        //Get le anonymized from pour le level study
    }

    removeStudyAnonymized = (studyID) => {
        apis.content.deleteStudies(studyID)
    }

    exportList = () => {
        this.props.addStudiesToExportList(this.state.studies)
    }

    deleteList = () => {
        this.props.addStudiesToDeleteList(this.state.studies)
    }

    render = () => {
        console.log(this.state)
        return (
            <Fragment>
                <div>
                    <div className="float-right">
                        <button type='button' className="btn btn-warning"
                            onClick={this.emptyAnonymizedList}>Empty List
                        </button>
                    </div>
                    <TableStudy
                        data={this.state.studies}
                        hiddenActionBouton={true}
                        hiddenRemoveRow={false}
                        onDelete={this.removeStudyAnonymized}
                        hiddenName={false}
                        hiddenID={false}
                        pagination={true}
                        hiddenCSV={false}
                    />
                </div>
                <div className="text-center">
                    <button type='button' className='btn btn-primary mr-3' onClick={this.exportList}>
                        To Export List
                            </button>
                    <button type='button' className='btn btn-danger' onClick={this.deleteList}>
                        To Delete List
                            </button>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToExportList
}

export default connect(null, mapDispatchToProps)(AnonymizedResults)