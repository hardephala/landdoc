import axios from 'axios'

export const getAllRoles = async (address) => {
        const { data } = await axios.get(`http://localhost:4000/api/admin/roles/`, { address })
        return data.data
}