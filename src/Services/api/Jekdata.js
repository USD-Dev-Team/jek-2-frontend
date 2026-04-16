import axios from "axios";
import { $api, BASE_URL } from "../parametres/axios";
class apiJekData {
    static DataGet = async () => {
        const response = await $api.get(`${BASE_URL}/admins/self/data`)
        return response;
    }
    static getAll = async () => {
        const response = await $api.get(`${BASE_URL}/admins/all-list`)
        return response;
    }
    static deActivation = async (id, payload) => {
        const response = await $api.patch(`${BASE_URL}/admins/update/status/${id}`, payload)
        return response;
    }
    static getFilterJek = async (ism, familiya, tuman, mahalla, number, isActive) => {

        const params = {}

        if (ism) params.first_name = ism
        if (familiya) params.last_name = familiya
        if (tuman) params.district = tuman
        if (mahalla) params.neighborhood = mahalla
        if (number) params.phoneNumber = number
        if (isActive !== "") params.isActive = isActive

        const response = await $api.get(`${BASE_URL}/admins/filter-list`, {
            params
        })

        return response;
    }


}

export { apiJekData };