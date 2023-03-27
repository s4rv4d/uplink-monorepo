import { _prismaClient } from "lib";
import { validateSpaceEns } from "../utils/validateFormData.js";

const findSpaceById = async (id: string) => {
    return await _prismaClient.space.findUnique({
        where: {
            id: id
        },
        include: {
            admins: true
        }
    });
}



const queries = {
    Query: {
        async spaces() {
            const spaces = await _prismaClient.space.findMany({
                include: {
                    admins: true
                }
            });
            return spaces
        },
        async space(parent, { id, name }, contextValue, info) {
            return await findSpaceById(id);
        },
        async isEnsValid(parent, { ens }, contextValue, info) {
            const result = await validateSpaceEns(ens);
            const isSuccess = !result.error;
            const errors = { ens: result.error }
            return {
                success: isSuccess,
                errors: errors,
                ens: result.value
            }
        },
    },

    Space: {
        async __resolveReference(space) {
            return await findSpaceById(space.id);
        }
    }
};




export default queries