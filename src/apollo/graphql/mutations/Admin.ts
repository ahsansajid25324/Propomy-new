    import { gql } from "@apollo/client";

    export const UPDATE_USER_API_LIMIT = gql`
    mutation UpdateUserApiLimit($input: UpdateUserApiLimitInput!) {
        updateUserApiLimit(input: $input) {
        success
        message
        id
        apiLimit
        }
    }
    `;

    export const DELETE_USER = gql`
    mutation DeleteUser($input: DeleteUserInput!) {
        deleteUser(input: $input) {
        success
        message
        }
    }
    `;
