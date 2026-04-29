import axios from "axios";
import { $api, BASE_URL } from "../parametres/axios";
class apiAriza {
    // static getAll = async (status, page, limit) => {
    //     const response = await $api.get(`${BASE_URL}/requests/jek/list?status=${status}&page=${page}&limit=${limit}`)
    //     return response;
    // }
    static getFilteredRequest = async (id , start, end, tuman, mahalla, status, search, page, limit) => {
        const response = await $api.get(`${BASE_URL}/requests/universal-search`,
            {
                params: {
                    assigned_jek_id : id,
                    startDate: start,
                    endDate: end,
                    district: tuman,
                    neighborhood: mahalla,
                    status: status,
                    search: search,
                    page: page,
                    limit: limit
                }
            });

        return response;
    };
    static Kutilmoqda = async (id) => {
        const response = await $api.patch(`${BASE_URL}/requests/assign/${id}`)
        return response;
    }
    static Tugatildi = async (id, note, file) => {
        const formData = new FormData();

        formData.append("note", note);
        formData.append("photos", file); // 🔥 MUHIM

        const response = await $api.patch(
            `${BASE_URL}/requests/complete/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response;
    }
    static Muammo = async (id) => {
        const response = await $api.get(`${BASE_URL}/requests/request/${id}`)
        return response;
    }

    // static RadEtish = async (id , reason) => {
    //     const response = await $api.patch(`${BASE_URL}/requests/reject/${id}` , {reason: reason})
    //     return response;
    // }
}

export { apiAriza };