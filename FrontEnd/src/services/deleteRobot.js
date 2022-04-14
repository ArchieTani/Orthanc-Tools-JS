import axios from "axios"

const deleteRobot = {

    createDeleteRobot(deleteArray, username) {

        return axios.post('/api/tasks/' + username + '/delete', deleteArray).then(answer => {
            if (!answer.ok) { throw answer }
            return answer.data
        }).catch(error => {
            throw error
        })
    },

    flush(){
        
        return axios.delete('/api/tasks/type/delete/flush').then(answer => {
            if (!answer.ok) {throw answer}
            return true
        }).catch(error => {
            throw error
        })
    }
}

export default deleteRobot