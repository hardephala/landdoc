import axios from 'axios'

export const getAllRoles = async (address) => {

    try {
        const { data } = await axios.get(`http://localhost:4000/api/admin/roles/`, { address })
        return data.data
    } catch (error) {
        throw error
    }
}