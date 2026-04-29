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
    static getFilterJek = async (
        ism,
        familiya,
        tuman,
        mahalla,
        number,
        isActive,
        page = 1,
        limit = 1000000000000000,
        role
    ) => {

        const params = {}

        if (ism) params.first_name = ism
        if (familiya) params.last_name = familiya
        if (tuman) params.district = tuman
        if (mahalla) params.neighborhood = mahalla
        if (number) params.phoneNumber = number
        if (isActive !== "") params.isActive = isActive

        params.page = page
        params.limit = limit
        if (role) params.role = role


        const response = await $api.get(`${BASE_URL}/admins/filter-list`, {
            params
        })

        return response;
    }
    static getById = async (id) => {
        const response = await $api.get(`${BASE_URL}/admins/find/${id}`)
        return response;
    }
    static profil = async (id, first_name, last_name, phoneNumber) => {
        const response = await $api.patch(`${BASE_URL}/admins/update/profile/${id}`, {

            id,
            first_name,
            last_name,
            phoneNumber
        })
        return response;
    }
    static parol = async (id, password, passwordConfirm) => {
        const response = await $api.patch(`${BASE_URL}/admins/change/password/${id}`, {
            id,
            password,
            passwordConfirm
        })
        return response;
    }
    static mahalla = async (id, district, neighborhood) => {
        const response = await $api.post(`${BASE_URL}/addresses/assign/${id}`, {
            id,
            district,
            neighborhood
        })
        return response;
    }
    static delete = async ( jek_id, addressId,) => {
        const response = await $api.delete(`${BASE_URL}/addresses/remove/${jek_id}/${addressId}`)
            return response
    }


}

export { apiJekData };