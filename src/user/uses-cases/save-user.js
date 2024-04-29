import { User } from "../models/user";
import { localHostUserToModel } from "../mappers/localhost-user.mapper";



/**
 * 
 * @param {List<User>} userLike 
 * @returns 
 */
export const saveUser = async (userLike) => {

    /* let loadedUser = {};

    const container = document.querySelector("#form__container");
    const form = container.querySelector('form');

    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const formData = FormData( form );
        const userLike = {...loadedUser};

        for (const [key, value] of formData) {
            userLike[key] = value;
        }

    }); */
    const user = new User( userLike );

    if ( !user.firstName || !user.lastName ) 
        throw 'First & last name are required';


    const userToSave = userModelToLocalhost( user );
    let userUpdated;

    if ( user.id ) {
        userUpdated = await updateUser(userToSave);
    } else {
        userUpdated = await createUser( userToSave );
    }

    return localHostUserToModel( userUpdated );
}

/**
 * 
 * @param {*} user 
 * @returns 
 */
const createUser = async (user) => {

    const url = `${import.meta.env.VITE_BASE_URL}/users`;
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const newUser = await res.json();
    console.log({ newUser });

    return newUser;

}