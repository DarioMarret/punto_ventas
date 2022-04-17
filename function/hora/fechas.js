export function Fecha(formato){
    try {
        var fecha_ = new Date()
        let fecha = moment(fecha_).format(formato || "DD/MM/YYYY HH:mm:ss")
        return fecha;
    } catch (error) {
        return null
    }
}