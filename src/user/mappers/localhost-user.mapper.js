import { User } from "../models/user"

/**
 * 
 * @param {Like<User>} localhost 
 * @returns {User}
 */
export const localHostUserToModel = (localhost) => {

    const {
        id,
        email,
        Password,
        Nombres,
        ApellidoPaterno,
        ApellidoMaterno,
        intentos,
        estado,
        documento,
        activado,
        celular,
        nacimiento,
        direccion,
        departamento,
        provincia,
        distrito,
        TipoDocumento
    } = localhost;

    return new User({
        id,
        email,
        password: Password,
        razonsocial,
        nombres: Nombres,
        apellidoPaterno: ApellidoPaterno,
        apellidoMaterno: ApellidoMaterno,
        intentos,
        estado,
        documento,
        activado,
        celular,
        sexo,
        nacimiento,
        direccion,
        departamento,
        provincia,
        distrito,
        tipoDocumento: TipoDocumento,
    })
}