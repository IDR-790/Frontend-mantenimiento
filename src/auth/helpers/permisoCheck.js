
export const permisoCheck = (permisosApp={}, permisosUser=[]) => {

    const misPermisos = {...permisosApp};
    permisosUser.map( obj => {
        misPermisos[obj.codigo] = true
    });
    return misPermisos
}

